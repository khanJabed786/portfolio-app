import React, { useEffect } from "react";

export default function Modal({ open, title, children, onClose }) {
  // Lock body scroll using class and ensure modal visible
  useEffect(() => {
    if (open) {
      // Immediate scroll to top - multiple methods for maximum compatibility
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
      
      // Add class after scroll
      document.documentElement.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
    }
    return () => {
      document.documentElement.classList.remove('modal-open');
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => (e.key === "Escape" ? onClose?.() : null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close modal overlay"
      />
      <div className="relative w-full max-w-4xl glass p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="text-lg font-semibold">{title}</div>
          <button
            className="px-3 py-1 rounded-xl border border-white/15 hover:bg-white/10 transition"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}