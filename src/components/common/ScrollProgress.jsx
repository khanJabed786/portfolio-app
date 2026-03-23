import React, { useEffect, useState } from "react";
import { clamp } from "../../utils/helpers.js";

export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const val = max > 0 ? (h.scrollTop / max) * 100 : 0;
      setP(clamp(val, 0, 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[80] h-[3px] bg-white/5">
      <div
        className="h-full bg-indigo-400/80"
        style={{ width: `${p}%`, transition: "width 80ms linear" }}
      />
    </div>
  );
}