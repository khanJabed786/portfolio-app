import React, { useState } from "react";

export default function LazyImage({ src, alt, className = "", ...rest }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded ? <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" /> : null}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className="w-full h-full object-contain rounded-xl"
        {...rest}
      />
    </div>
  );
}