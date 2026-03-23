import React, { useEffect, useState } from "react";
import Toast from "../../../components/common/Toast.jsx";
import { adminUpsertAchievements } from "../../../config/adminFirestore.js";
import { usePortfolio } from "../../../context/PortfolioContext.jsx";

export default function AchievementsTab() {
  const { data } = usePortfolio();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  
  const [form, setForm] = useState({
    title: "",
    stats: [{ label: "", value: 0 }],
    badges: [""]
  });

  useEffect(() => {
    if (data?.achievements) {
      setForm({
        title: data.achievements.title || "",
        stats: Array.isArray(data.achievements.stats) ? data.achievements.stats : [{ label: "", value: 0 }],
        badges: Array.isArray(data.achievements.badges) ? data.achievements.badges : [""]
      });
    }
  }, [data?.achievements]);

  const updateStat = (idx, key, value) => {
    setForm((f) => {
      const stats = [...f.stats];
      stats[idx] = { ...stats[idx], [key]: key === "value" ? parseInt(value) || 0 : value };
      return { ...f, stats };
    });
  };

  const addStat = () => {
    setForm((f) => ({ ...f, stats: [...f.stats, { label: "", value: 0 }] }));
  };

  const removeStat = (idx) => {
    setForm((f) => ({ ...f, stats: f.stats.filter((_, i) => i !== idx) }));
  };

  const updateBadge = (idx, value) => {
    setForm((f) => {
      const badges = [...f.badges];
      badges[idx] = value;
      return { ...f, badges };
    });
  };

  const addBadge = () => {
    setForm((f) => ({ ...f, badges: [...f.badges, ""] }));
  };

  const removeBadge = (idx) => {
    setForm((f) => ({ ...f, badges: f.badges.filter((_, i) => i !== idx) }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setToast({ open: true, type: "error", message: "Title is required." });
      return;
    }

    setBusy(true);
    try {
      await adminUpsertAchievements({
        title: form.title.trim(),
        stats: form.stats.filter((s) => s.label.trim()),
        badges: form.badges.filter((b) => b.trim())
      });
      setToast({ open: true, type: "success", message: "Achievements updated!" });
    } catch (err) {
      console.error(err);
      setToast({ open: true, type: "error", message: "Failed to save." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="glass p-6">
      <div className="max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Edit Achievements</h2>

        <form onSubmit={onSave} className="grid gap-6">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Title</label>
            <input
              className="glass px-4 py-3 outline-none w-full"
              placeholder="Achievements"
              value={form.title}
              disabled={busy}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/70">Stats</label>
              <button
                type="button"
                onClick={addStat}
                className="text-xs px-2 py-1 rounded bg-indigo-500/60 hover:bg-indigo-500 transition"
                disabled={busy}
              >
                + Stat
              </button>
            </div>
            <div className="grid gap-2">
              {form.stats.map((stat, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="glass px-3 py-2 outline-none flex-1"
                    placeholder="Label (e.g., Projects Built)"
                    value={stat.label}
                    disabled={busy}
                    onChange={(e) => updateStat(idx, "label", e.target.value)}
                  />
                  <input
                    type="number"
                    className="glass px-3 py-2 outline-none w-20"
                    placeholder="0"
                    value={stat.value}
                    disabled={busy}
                    onChange={(e) => updateStat(idx, "value", e.target.value)}
                  />
                  {form.stats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStat(idx)}
                      className="px-2 py-1 rounded bg-red-500/60 hover:bg-red-500 transition text-sm"
                      disabled={busy}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/70">Badges</label>
              <button
                type="button"
                onClick={addBadge}
                className="text-xs px-2 py-1 rounded bg-indigo-500/60 hover:bg-indigo-500 transition"
                disabled={busy}
              >
                + Badge
              </button>
            </div>
            <div className="grid gap-2">
              {form.badges.map((badge, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="glass px-3 py-2 outline-none flex-1"
                    placeholder={`Badge ${idx + 1}`}
                    value={badge}
                    disabled={busy}
                    onChange={(e) => updateBadge(idx, e.target.value)}
                  />
                  {form.badges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBadge(idx)}
                      className="px-2 py-1 rounded bg-red-500/60 hover:bg-red-500 transition text-sm"
                      disabled={busy}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button className="px-5 py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 transition disabled:opacity-60" disabled={busy}>
            {busy ? "Saving..." : "Save Achievements"}
          </button>
        </form>
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </section>
  );
}
