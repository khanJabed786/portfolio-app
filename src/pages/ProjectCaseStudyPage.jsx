import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext.jsx";
import ShareButtons from "../components/common/ShareButtons.jsx";
import Lightbox from "../components/common/Lightbox.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { useState } from "react";

export default function ProjectCaseStudyPage() {
  const { id } = useParams();
  const { data, loading } = usePortfolio();
  const [lb, setLb] = useState({ open: false, images: [], index: 0, title: "" });

  const project = useMemo(() => {
    if (!data?.projects?.items) return null;
    const found = data.projects.items.find((p) => p.id === id);
    console.log(`🔍 Looking for project: ${id}`, found ? "✅ Found" : "❌ Not found");
    if (found) {
      console.log("📋 Project data:", found);
    }
    return found;
  }, [id, data]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!project) {
    return (
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto glass p-8">
          <h1 className="text-2xl font-semibold">Project not found</h1>
          <p className="mt-2 text-white/70">
            Project ID: <code className="bg-white/10 px-2 py-1 rounded">{id}</code>
          </p>
          <p className="mt-2 text-white/70">Available projects: {data?.projects?.items?.map((p) => p.id).join(", ") || "None"}</p>
          <Link
            to="/"
            className="inline-block mt-6 px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="glass p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold">{project.title}</h1>
              <p className="mt-2 text-white/80">{project.description}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <ShareButtons title={project.title} text="Check out this project" />
              <Link
                to="/"
                className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
              >
                Home
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-xl border border-white/15 bg-white/5 text-white/80 text-sm"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {project.caseStudy?.problem && (
              <CaseCard title="Problem">
                {project.caseStudy.problem}
              </CaseCard>
            )}
            {project.caseStudy?.solution && (
              <CaseCard title="Solution">
                {project.caseStudy.solution}
              </CaseCard>
            )}
            {project.caseStudy?.result && (
              <CaseCard title="Result">
                {project.caseStudy.result}
              </CaseCard>
            )}
            {!project.caseStudy?.problem && !project.caseStudy?.solution && !project.caseStudy?.result && (
              <>
                <CaseCard title="Problem">
                  Need a premium, fast portfolio with admin system and real features.
                </CaseCard>
                <CaseCard title="Solution">
                  Build React + Tailwind UI with animations + Firebase backend + admin dashboard.
                </CaseCard>
                <CaseCard title="Result">
                  A product-like portfolio with search, tracking, contact system, and content management.
                </CaseCard>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="ripple-btn px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
            >
              GitHub
            </a>
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="ripple-btn px-4 py-2 rounded-xl bg-indigo-500/70 hover:bg-indigo-500 transition"
            >
              Live Demo
            </a>
          </div>

          {project.video ? (
            <div className="mt-10">
              <div className="text-lg font-semibold">Demo Video</div>
              <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-white/10">
                <iframe
                  className="w-full h-full"
                  src={project.video}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}

          {project.images?.length ? (
            <div className="mt-10">
              <div className="text-lg font-semibold">Gallery</div>
              <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLb({ open: true, images: project.images, index: idx, title: project.title })}
                    className="overflow-hidden rounded-xl border border-white/10 hover:border-white/30 transition group"
                  >
                    <img src={img} alt={`${project.title} ${idx + 1}`} className="w-full h-40 object-cover group-hover:scale-105 transition" />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <Lightbox
            open={lb.open}
            images={lb.images}
            index={lb.index}
            title={lb.title}
            onClose={() => setLb((s) => ({ ...s, open: false }))}
            onPrev={() => setLb((s) => ({ ...s, index: (s.index - 1 + s.images.length) % s.images.length }))}
            onNext={() => setLb((s) => ({ ...s, index: (s.index + 1) % s.images.length }))}
          />
        </div>
      </div>
    </main>
  );
}

function CaseCard({ title, children }) {
  return (
    <div className="glass p-6 glow-hover">
      <div className="text-indigo-200 font-semibold">{title}</div>
      <div className="mt-2 text-white/80 text-sm leading-relaxed">{children}</div>
    </div>
  );
}