import React from "react";
import { Link } from "react-router-dom";
import { portfolio } from "../data/portfolio.js";
import usePortfolioData from "../utils/usePortfolioData.js";

export default function ResumePage() {
  const { data } = usePortfolioData();
  const { profile: firebaseProfile } = data;
  const { profile, skills, experience, projects } = portfolio;

  const handleResumeDownload = () => {
    if (!firebaseProfile.resumeFile) {
      alert("Resume file not available");
      return;
    }

    try {
      const byteCharacters = atob(firebaseProfile.resumeFile.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = firebaseProfile.resumeFileName || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("✅ Resume downloaded:", firebaseProfile.resumeFileName);
    } catch (error) {
      console.error("❌ Failed to download resume:", error);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass p-6 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-2xl font-semibold">{profile.name}</div>
            <div className="text-white/70">{profile.role}</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {firebaseProfile.resumeFile && (
              <button
                onClick={handleResumeDownload}
                className="ripple-btn px-4 py-2 rounded-xl bg-green-500/70 hover:bg-green-500 transition"
              >
                ⬇️ Download Resume
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="ripple-btn px-4 py-2 rounded-xl bg-indigo-500/70 hover:bg-indigo-500 transition"
            >
              Print / Save PDF
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="mt-4 glass p-8">
          <Section title="Summary">
            <p className="text-white/80 leading-relaxed">{profile.intro}</p>
          </Section>

          <Section title="Skills">
            <div className="grid md:grid-cols-3 gap-4">
              {skills.groups.map((g) => (
                <div key={g.name} className="glass p-4">
                  <div className="font-semibold">{g.name}</div>
                  <div className="mt-2 text-white/80 text-sm">{g.items.join(", ")}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Experience">
            <div className="grid gap-3">
              {experience.items.map((e) => (
                <div key={e.year} className="glass p-4">
                  <div className="flex justify-between gap-3 flex-wrap">
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-white/70">{e.year}</div>
                  </div>
                  <div className="mt-1 text-white/80 text-sm">{e.desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Projects">
            <div className="grid gap-3">
              {projects.items.slice(0, 4).map((p) => (
                <div key={p.id} className="glass p-4">
                  <div className="font-semibold">{p.title}</div>
                  <div className="mt-1 text-white/80 text-sm">{p.description}</div>
                  <div className="mt-2 text-white/70 text-xs">{p.tech.join(" • ")}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <style>{`
        @media print {
          header, nav, footer, button, a { display: none !important; }
          body { background: white !important; color: black !important; }
          .glass { background: white !important; border: 1px solid #e5e7eb !important; box-shadow: none !important; }
        }
      `}</style>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-8">
      <div className="text-lg font-semibold text-indigo-200">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}