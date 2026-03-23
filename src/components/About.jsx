import React from "react";
import { usePortfolio } from "../context/PortfolioContext.jsx";

export default function About() {
  const { data } = usePortfolio();
  const about = data?.about || { title: "About Me", paragraphs: [], highlights: [] };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
        {/* Left column - Text */}
        <div className="space-y-8" data-aos="fade-right">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {about.title}
              </span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>
          
          <div className="space-y-3 sm:space-y-4 text-white/75 leading-7 sm:leading-8">
            {about.paragraphs?.map((p, i) => (
              <p key={i} className="text-sm sm:text-base md:text-lg font-light">{p}</p>
            ))}
          </div>
        </div>

        {/* Right column - Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5" data-aos="fade-left">
          {about.highlights?.map((h, idx) => (
            <div
              key={h.title}
              className="group p-4 sm:p-6 rounded-xl border border-white/10 hover:border-indigo-400/50 bg-white/5 hover:bg-indigo-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
              data-aos="zoom-in"
              data-aos-delay={`${idx * 100}`}
            >
              <div className="text-3xl sm:text-4xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                {h.icon}
              </div>
              <div className="mt-3 sm:mt-4 font-semibold text-base sm:text-lg text-white group-hover:text-indigo-300 transition">
                {h.title}
              </div>
              <div className="mt-2 text-sm text-white/70 leading-relaxed">{h.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}