import { logAnalyticsEvent } from "./firebaseUtils.js";

export function trackPageView(path) {
  return logAnalyticsEvent({ type: "page_view", path });
}

export function trackClick(path, label, meta) {
  return logAnalyticsEvent({ type: "click", path, label, meta });
}