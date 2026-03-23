import React from "react";

export default function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={fullScreen ? "min-h-screen flex items-center justify-center px-6" : ""}>
      <div className="max-w-xl w-full glass p-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <div className="text-white/80">Loading...</div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}