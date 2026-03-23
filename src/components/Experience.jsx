import React from "react";
import { usePortfolio } from "../context/PortfolioContext.jsx";

export default function Experience() {
  const { data } = usePortfolio();
  const experience = data?.experience || { title: "Experience", items: [] };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="space-y-8 sm:space-y-12" data-aos="fade-up">
        {/* Header */}
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              {experience.title}
            </span>
          </h2>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative space-y-4 sm:space-y-6 pl-6 sm:pl-8">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500 rounded-full" />

          {experience.items?.map((it, idx) => (
            <div
              key={it.year}
              className="group relative"
              data-aos="fade-right"
              data-aos-delay={`${idx * 50}`}
            >
              {/* Timeline dot */}
              <div className="absolute -left-4 top-2 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 border-2 border-indigo-950 group-hover:scale-125 transition-transform shadow-lg shadow-pink-500/50" />

              {/* Content */}
              <div className="p-4 sm:p-6 rounded-xl border border-white/10 hover:border-pink-400/50 bg-white/5 hover:bg-pink-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-pink-300 transition">
                    {it.title}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-400/30 whitespace-nowrap">
                    {it.year}
                  </span>
                </div>
                <p className="text-white/70 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}