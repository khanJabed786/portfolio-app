import React, { useEffect } from "react";

export default function Toast({ open, type = "success", message, onClose, duration = 2600 }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const color =
    type === "success"
      ? "border-emerald-400/30 bg-emerald-500/10"
      : "border-rose-400/30 bg-rose-500/10";

  return (
    <div className="fixed z-[60] bottom-6 left-1/2 -translate-x-1/2">
      <div className={`glass px-5 py-3 border ${color}`}>
        <div className="text-white/90">{message}</div>
      </div>
    </div>
  );
}