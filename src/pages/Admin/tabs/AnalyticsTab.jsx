import React, { useEffect, useState, useMemo } from "react";
import Toast from "../../../components/common/Toast.jsx";
import { adminListAnalytics } from "../../../config/adminFirestore.js";

export default function AnalyticsTab() {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [items, setItems] = useState([]);

  const load = async () => {
    setBusy(true);
    try {
      const data = await adminListAnalytics();
      setItems(data);
    } catch (e) {
      console.error("Analytics error:", e);
      setToast({ open: true, type: "error", message: "Failed to load analytics." });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const analytics = useMemo(() => {
    const totalEvents = items.length;
    const pageViews = items.filter((e) => e.type === "page_view").length;
    const clicks = items.filter((e) => e.type === "click").length;

    const pageMap = {};
    items.forEach((e) => {
      if (e.type === "page_view" && e.path) {
        pageMap[e.path] = (pageMap[e.path] || 0) + 1;
      }
    });
    const topPages = Object.entries(pageMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const interactionMap = {};
    items.forEach((e) => {
      if (e.type === "click" && e.label) {
        interactionMap[e.label] = (interactionMap[e.label] || 0) + 1;
      }
    });
    const topInteractions = Object.entries(interactionMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentEvents = items.slice(0, 30);

    return { totalEvents, pageViews, clicks, topPages, topInteractions, recentEvents };
  }, [items]);

  const StatCard = ({ label, value, icon }) => (
    <div className="p-6 rounded-lg bg-slate-700/60 border border-white/20 hover:border-white/40 transition shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">{label}</div>
          <div className="text-4xl font-bold text-white mt-3">{value}</div>
        </div>
        <div className="text-5xl flex-shrink-0">{icon}</div>
      </div>
    </div>
  );

  return (
    <section className="w-full space-y-8 p-8 rounded-2xl bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-2xl">
      <div style={{ color: "white", fontSize: "16px", fontWeight: "bold", padding: "12px", backgroundColor: "#cc0000", borderRadius: "8px", textAlign: "center" }}>
        ✅ Items: {items.length} | Busy: {busy ? "YES" : "NO"} | Events: {analytics.totalEvents}
      </div>

      <div className="flex items-center justify-between gap-3 pb-6 border-b-2 border-white/20">
        <div>
          <h2 className="text-3xl font-bold text-white">📊 Analytics Dashboard</h2>
          <p className="text-white/70 text-sm mt-2">Real-time portfolio event tracking</p>
        </div>
        <button
          onClick={load}
          disabled={busy}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold transition disabled:opacity-50 shadow-lg"
        >
          {busy ? "⏳ Loading..." : "🔄 Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard label="Total Events" value={analytics.totalEvents} icon="📊" />
        <StatCard label="Page Views" value={analytics.pageViews} icon="👁️" />
        <StatCard label="Interactions" value={analytics.clicks} icon="🖱️" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-slate-700/60 border border-white/20 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 pb-3 border-b border-white/20">
            <span>🏆</span> Top Pages
          </h3>
          <div className="space-y-4">
            {analytics.topPages.map((page, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{page.path || "/"}</div>
                  <div className="mt-2 h-3 bg-slate-600 rounded-full overflow-hidden border border-slate-500">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg"
                      style={{ width: `${Math.min(100, (page.count / (analytics.topPages[0]?.count || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-bold text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-lg">{page.count}</div>
              </div>
            ))}
            {analytics.topPages.length === 0 && <div className="text-white/60 text-sm text-center py-4">No data</div>}
          </div>
        </div>

        <div className="p-6 rounded-lg bg-slate-700/60 border border-white/20 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 pb-3 border-b border-white/20">
            <span>⚡</span> Top Interactions
          </h3>
          <div className="space-y-4">
            {analytics.topInteractions.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{item.label}</div>
                  <div className="mt-2 h-3 bg-slate-600 rounded-full overflow-hidden border border-slate-500">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                      style={{ width: `${Math.min(100, (item.count / (analytics.topInteractions[0]?.count || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-lg">{item.count}</div>
              </div>
            ))}
            {analytics.topInteractions.length === 0 && <div className="text-white/60 text-sm text-center py-4">No data</div>}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg bg-slate-700/60 border border-white/20 shadow-lg overflow-x-auto">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 pb-3 border-b border-white/20">
          <span>📝</span> Recent Events ({analytics.recentEvents.length})
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-white/30 bg-slate-900/50">
              <th className="text-left py-3 px-4 text-white font-bold">#</th>
              <th className="text-left py-3 px-4 text-white font-bold">Type</th>
              <th className="text-left py-3 px-4 text-white font-bold">Path</th>
              <th className="text-left py-3 px-4 text-white font-bold">Label</th>
              <th className="text-left py-3 px-4 text-white font-bold">Date</th>
              <th className="text-left py-3 px-4 text-white font-bold">Time</th>
            </tr>
          </thead>
          <tbody>
            {analytics.recentEvents.length > 0 ? (
              analytics.recentEvents.map((event, idx) => {
                const dt = event.createdAt ? new Date(event.createdAt.seconds ? event.createdAt.seconds * 1000 : event.createdAt) : null;
                return (
                  <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 text-white/90">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.type === "page_view" ? "bg-cyan-500/40 text-cyan-100" : "bg-purple-500/40 text-purple-100"}`}>
                        {event.type === "page_view" ? "👁️ VIEW" : "🖱️ CLICK"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/80 truncate max-w-xs">{event.path || "-"}</td>
                    <td className="py-3 px-4 text-white/80 truncate max-w-xs bg-white/10 px-2 py-1 rounded inline-block">{event.label || "-"}</td>
                    <td className="py-3 px-4 text-white/70 text-xs">{dt ? dt.toLocaleDateString() : "-"}</td>
                    <td className="py-3 px-4 text-white/70 text-xs">{dt ? dt.toLocaleTimeString() : "-"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-8 px-4 text-center text-white/60">No events yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {busy && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000, backgroundColor: "rgba(0,0,0,0.8)", padding: "30px", borderRadius: "15px", textAlign: "center", border: "2px solid cyan" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid rgba(255,255,255,0.2)", borderTop: "4px solid cyan", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
          <p style={{ color: "white", fontSize: "16px" }}>⏳ Loading...</p>
        </div>
      )}

      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, open: false }))} />
    </section>
  );
}
