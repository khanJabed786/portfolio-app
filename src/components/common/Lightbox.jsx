import React, { useEffect, useState } from "react";

export default function Lightbox({ open, images = [], index = 0, onClose, onPrev, onNext }) {
  const [loadError, setLoadError] = useState(false);
  
  useEffect(() => {
    setLoadError(false);
  }, [index]);

  // Lock body scroll using class
  useEffect(() => {
    if (open) {
      // Scroll to top when opening - especially important for mobile
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Immediate scroll on mobile for better UX
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  const src = images[index];
  
  if (!src) {
    return (
      <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
        <button className="absolute inset-0 bg-black/75" onClick={onClose} aria-label="Close" />
        <div className="relative w-full max-w-5xl glass p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-white/80 text-sm">No image</div>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/20 h-96 flex items-center justify-center">
            <div className="text-white/50">No image data</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/75" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-5xl glass p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-white/80 text-sm">
            {index + 1} / {images.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onPrev}
              className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
            >
              ←
            </button>
            <button
              onClick={onNext}
              className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
            >
              →
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/20">
          {loadError ? (
            <div className="w-full h-96 flex items-center justify-center bg-black/40">
              <div className="text-center">
                <div className="text-red-400 text-lg mb-2">📸</div>
                <div className="text-white/60 text-sm">Image failed to load</div>
                <div className="text-white/40 text-xs mt-2">Try refreshing or selecting another image</div>
              </div>
            </div>
          ) : (
            <img
              key={`lightbox-${index}-${src?.substring(0, 20)}`}
              src={src}
              alt="Project screenshot"
              className="w-full max-h-[75vh] object-contain"
              loading="eager"
              onLoad={() => {
                console.log(`✓ Image ${index + 1} loaded successfully in Lightbox`);
                console.log(`  src length: ${src.length}`);
              }}
              onError={(e) => {
                const img = e.target;
                console.error(`❌ Lightbox image ${index + 1} failed to load! Details:`);
                console.error(`  - src exists: ${!!src}`);
                console.error(`  - src length: ${src?.length || 'undefined'}`);
                console.error(`  - src type: ${typeof src}`);
                console.error(`  - src starts with: ${src?.substring(0, 100) || 'undefined'}`);
                console.error(`  - img.src exists: ${!!img.src}`);
                console.error(`  - img.naturalWidth: ${img.naturalWidth}`);
                console.error(`  - img.naturalHeight: ${img.naturalHeight}`);
                console.error(`  - img.complete: ${img.complete}`);
                console.error(`  - img.currentSrc: ${img.currentSrc || 'undefined'}`);
                console.error(`  - Browser error: ${e.target.error}`);
                setLoadError(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}