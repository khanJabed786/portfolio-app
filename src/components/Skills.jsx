import React from "react";
import { usePortfolio } from "../context/PortfolioContext.jsx";

const SKILL_COLORS = {
  Frontend: { bg: "bg-blue-500/20", border: "border-blue-400/50", text: "text-blue-200" },
  Backend: { bg: "bg-purple-500/20", border: "border-purple-400/50", text: "text-purple-200" },
  Tools: { bg: "bg-green-500/20", border: "border-green-400/50", text: "text-green-200" },
  "Web3": { bg: "bg-pink-500/20", border: "border-pink-400/50", text: "text-pink-200" },
  Default: { bg: "bg-white/10", border: "border-white/30", text: "text-white/90" }
};

export default function Skills() {
  const { data } = usePortfolio();
  const skills = data?.skills || { title: "Skills", groups: [] };

  const getColor = (groupName) => SKILL_COLORS[groupName] || SKILL_COLORS.Default;

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="space-y-12" data-aos="fade-up">
        {/* Header */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {skills.title}
            </span>
          </h2>
          <p className="mt-3 text-white/70 text-lg">Technologies I work with</p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
        </div>

        {/* Skills Groups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {skills.groups?.map((g, idx) => {
            const colors = getColor(g.name);
            return (
              <div
                key={g.name}
                className="p-4 sm:p-6 lg:p-8 rounded-xl border border-white/10 hover:border-emerald-400/50 bg-white/5 hover:bg-emerald-500/5 transition-all duration-300 group"
                data-aos="zoom-in"
                data-aos-delay={`${idx * 100}`}
              >
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-emerald-300 transition mb-3 sm:mb-4">
                  {g.name}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {g.items?.map((s) => (
                    <span
                      key={s}
                      className={`${colors.bg} ${colors.border} ${colors.text} px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}