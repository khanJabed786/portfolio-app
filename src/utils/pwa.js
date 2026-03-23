export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  // Vite dev server pe SW debugging avoid
  if (import.meta.env.DEV) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((e) => console.warn("[pwa] service worker register failed", e));
  });
}