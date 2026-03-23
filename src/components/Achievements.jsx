import React, { useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext.jsx";
import { clamp } from "../utils/helpers.js";

function useCountUp(target, ms = 900) {
  const [v, setV] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (t) => {
      const p = clamp((t - start) / ms, 0, 1);
      setV(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return v;
}

export default function Achievements() {
  const { data } = usePortfolio();
  const achievements = data?.achievements || { title: "Achievements", stats: [], badges: [] };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="space-y-8 sm:space-y-12" data-aos="fade-up">
        {/* Header */}
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {achievements.title}
            </span>
          </h2>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {achievements.stats?.map((s, idx) => (
            <StatCard key={s.label} label={s.label} value={s.value} delay={idx * 100} />
          ))}
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Certifications & Badges</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {achievements.badges?.map((b, idx) => (
              <span
                key={b}
                className="px-4 py-2 rounded-full border border-cyan-400/50 bg-cyan-500/10 text-cyan-200 text-sm font-medium hover:border-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 hover:scale-105"
                data-aos="zoom-in"
                data-aos-delay={`${idx * 50}`}
              >
                🏆 {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delay }) {
  const v = useCountUp(value, 1100);

  return (
    <div
      className="group p-6 sm:p-8 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-gradient-to-br from-white/5 to-cyan-500/5 hover:from-white/10 hover:to-cyan-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
      data-aos="flip-left"
      data-aos-delay={`${delay}`}
    >
      <div className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
        {v}+
      </div>
      <div className="mt-3 sm:mt-4">
        <p className="text-xs sm:text-sm font-semibold text-cyan-200 group-hover:text-cyan-100 transition">{label}</p>
      </div>
    </div>
  );
}