import React, { useEffect, useMemo, useState } from "react";

export default function EasterEgg() {
  const [active, setActive] = useState(false);

  const seq = useMemo(
    () => ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"],
    []
  );

  useEffect(() => {
    let idx = 0;

    const onKeyDown = (e) => {
      const key = e.key;
      const expected = seq[idx];

      const normalized = key.length === 1 ? key.toLowerCase() : key;

      if (normalized === expected) {
        idx += 1;
        if (idx === seq.length) {
          setActive(true);
          idx = 0;
          // auto off
          setTimeout(() => setActive(false), 4500);
        }
      } else {
        idx = 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [seq]);

  if (!active) return null;

  return (
    <div className="easter-overlay">
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-5 py-3 text-white/90">
        Secret Mode Activated
      </div>
    </div>
  );
}