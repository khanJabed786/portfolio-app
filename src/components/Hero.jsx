import React, { useMemo, useState } from "react";
import usePortfolioData from "../utils/usePortfolioData.js";
import useTypewriter from "../utils/useTypewriter.js";
import { trackClick } from "../utils/analytics.js";

export default function Hero() {
  const { data } = usePortfolioData();
  const profile = data?.profile || {};
  const typewriter = data?.typewriter || { words: [] };

  // Safe fallback for profile
  const safeProfile = {
    name: profile.name || "Portfolio Developer",
    role: profile.role || "Full Stack Engineer",
    intro: profile.intro || "Building beautiful web experiences with modern tech stack",
    image: profile.image || null,
    resumeFile: profile.resumeFile || null,
    resumeFileName: profile.resumeFileName || "resume.pdf",
    ctas: profile.ctas || {
      primary: { label: "Hire Me", href: "#contact" },
      secondary: { label: "View Projects", href: "#projects" },
      resume: { label: "Download Resume", href: "#" }
    },
    social: profile.social || []
  };

  const words = useMemo(
    () => (typewriter.words && typewriter.words.length > 0
      ? typewriter.words.map((w) => w.text || w)
      : ["Fast UI", "Modern Animations", "Clean Code", "Firebase Backend", safeProfile.role]),
    [typewriter.words, safeProfile.role]
  );

  const typed = useTypewriter({ words });

  // Find current word to get its color
  const currentWordObj = typewriter.words?.find((w) => w.text === typed);
  const currentColor = currentWordObj?.color || "#4ECDC4";

  const onTrack = (label) => {
    trackClick("/", label, { section: "hero" });
  };

  const handleResumeDownload = (e) => {
    e.preventDefault();
    onTrack("cta_resume_download");
    
    if (!safeProfile.resumeFile) {
      // Fallback to URL if no resume file
      if (safeProfile.ctas?.resume?.href && safeProfile.ctas.resume.href !== "#") {
        window.open(safeProfile.ctas.resume.href, "_blank");
      }
      return;
    }

    try {
      // Convert base64 to blob
      const byteCharacters = atob(safeProfile.resumeFile.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = safeProfile.resumeFileName || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("✅ Resume downloaded:", safeProfile.resumeFileName);
    } catch (error) {
      console.error("❌ Failed to download resume:", error);
    }
  };

  return (
    <div className="relative w-full">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl opacity-0 lg:opacity-100 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-0 lg:opacity-100 animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Content - Centered */}
        <div className="grid lg:grid-cols-1 gap-6 sm:gap-8 items-center py-8 sm:py-12">
          <div className="text-center space-y-6 sm:space-y-8" data-aos="fade-up">
            {/* Greeting + Name */}
            <div className="space-y-4 sm:space-y-6">
              <p className="text-xs sm:text-sm font-semibold tracking-widest text-indigo-400 uppercase">Welcome to my portfolio</p>
              
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  {safeProfile.name}
                </span>
              </h1>

              {/* Typewriter role */}
              <div className="min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold">
                  <span className="text-white/90">I'm a </span>
                  <span style={{ color: currentColor }} className="transition-colors duration-300 font-bold">
                    {typed}
                  </span>
                  <span className="ml-2 inline-block w-1 h-7 sm:h-8 bg-gradient-to-b from-white to-transparent align-middle animate-bounce" />
                </div>
              </div>
            </div>

            {/* Intro text */}
            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              {safeProfile.intro}
            </p>

            {/* CTA Buttons - 3D Interactive */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
              <a
                href={safeProfile.ctas.primary.href}
                onClick={() => onTrack("cta_hire_me")}
                className="ripple-btn btn-glow btn-3d-hover function-hover group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  💼 {safeProfile.ctas.primary.label}
                </span>
              </a>

              <a
                href={safeProfile.ctas.secondary.href}
                onClick={() => onTrack("cta_view_projects")}
                className="ripple-btn btn-scale btn-3d-hover function-hover group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base border-2 border-indigo-400/50 hover:border-indigo-400 text-white/90 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🚀 {safeProfile.ctas.secondary.label}
                </span>
              </a>

              <button
                onClick={handleResumeDownload}
                className="ripple-btn btn-scale btn-3d-hover function-hover group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base border-2 border-green-400/50 hover:border-green-400 text-white/90 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  📄 {safeProfile.ctas.resume.label}
                </span>
              </button>
            </div>

            {/* Social Links - 3D Interactive */}
            <div className="flex flex-wrap gap-2 sm:gap-3 text-white/75 justify-center pt-2 sm:pt-4">
              {safeProfile.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClick("/", `social_${s.label.toLowerCase()}`)}
                  className="icon-bounce btn-3d-hover function-hover group px-3 sm:px-4 py-2 rounded-full border border-white/20 hover:border-indigo-400 bg-white/5 hover:bg-indigo-500/10 transition-all duration-300 text-xs sm:text-sm"
                >
                  <span className="group-hover:scale-110 transition-transform inline-block">
                    {s.label === "GitHub" && "🐙"}
                    {s.label === "LinkedIn" && "💼"}
                    {s.label === "Email" && "✉️"}
                    {!s.label.match(/GitHub|LinkedIn|Email/) && "🔗"}
                  </span>
                  <span className="ml-2">{s.label}</span>
                </a>
              ))}
            </div>

            {/* Scroll indicator */}
            <div className="pt-2 sm:pt-3 animate-bounce">
              <a href="#about" className="inline-flex flex-col items-center gap-1 text-white/50 hover:text-white/70 transition">
                <span className="text-xs sm:text-sm">Scroll to explore</span>
                <span className="text-lg sm:text-xl">↓</span>
              </a>
            </div>
          </div>

        </div>

        {/* Feature Cards */}
        {!safeProfile.image && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16" data-aos="fade-up" data-aos-delay="200">
            <FeatureCard icon="⚡" title="Performance" desc="Optimized for speed and UX" delay="0s" />
            <FeatureCard icon="🎨" title="Design" desc="Premium glassmorphism UI" delay="0.1s" />
            <FeatureCard icon="🛠" title="System" desc="Admin dashboard + analytics" delay="0.2s" />
            <FeatureCard icon="🔒" title="Security" desc="Protected auth & rules" delay="0.3s" />
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div
      className="glass p-4 sm:p-6 rounded-xl border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 group"
      style={{ animationDelay: delay }}
      data-aos="zoom-in"
    >
      <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">{icon}</div>
      <div className="mt-2 sm:mt-3 font-semibold text-sm sm:text-base text-white group-hover:text-indigo-300 transition">{title}</div>
      <p className="mt-1 text-white/60 text-xs sm:text-sm leading-relaxed">{desc}</p>
    </div>
  );
}