import React, { useEffect, useState } from "react";
import Toast from "../../../components/common/Toast.jsx";
import { adminUpsertExperience } from "../../../config/adminFirestore.js";
import { usePortfolio } from "../../../context/PortfolioContext.jsx";

export default function ExperienceTab() {
  const { data } = usePortfolio();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  
  const [form, setForm] = useState({
    title: "",
    items: [{ year: "", title: "", desc: "" }]
  });

  useEffect(() => {
    if (data?.experience) {
      setForm({
        title: data.experience.title || "",
        items: Array.isArray(data.experience.items) ? data.experience.items : [{ year: "", title: "", desc: "" }]
      });
    }
  }, [data?.experience]);

  const updateItem = (idx, key, value) => {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...f, items };
    });
  };

  const addItem = () => {
    setForm((f) => ({ ...f, items: [...f.items, { year: "", title: "", desc: "" }] }));
  };

  const removeItem = (idx) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setToast({ open: true, type: "error", message: "Title is required." });
      return;
    }

    setBusy(true);
    try {
      await adminUpsertExperience({
        title: form.title.trim(),
        items: form.items.filter((i) => i.year.trim() || i.title.trim() || i.desc.trim())
      });
      setToast({ open: true, type: "success", message: "Experience updated!" });
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
        <h2 className="text-xl font-semibold mb-4">Edit Experience / Timeline</h2>

        <form onSubmit={onSave} className="grid gap-6">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Title</label>
            <input
              className="glass px-4 py-3 outline-none w-full"
              placeholder="Experience"
              value={form.title}
              disabled={busy}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/70">Timeline</label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs px-2 py-1 rounded bg-indigo-500/60 hover:bg-indigo-500 transition"
                disabled={busy}
              >
                + Add Entry
              </button>
            </div>
            <div className="grid gap-3">
              {form.items.map((item, idx) => (
                <div key={idx} className="glass p-4 grid gap-2">
                  <div className="flex gap-2">
                    <input
                      className="glass px-3 py-2 outline-none w-20"
                      placeholder="Year"
                      value={item.year}
                      disabled={busy}
                      onChange={(e) => updateItem(idx, "year", e.target.value)}
                    />
                    <input
                      className="glass px-3 py-2 outline-none flex-1"
                      placeholder="Title"
                      value={item.title}
                      disabled={busy}
                      onChange={(e) => updateItem(idx, "title", e.target.value)}
                    />
                  </div>
                  <textarea
                    className="glass px-3 py-2 outline-none resize-none"
                    rows={2}
                    placeholder="Description"
                    value={item.desc}
                    disabled={busy}
                    onChange={(e) => updateItem(idx, "desc", e.target.value)}
                  />
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="px-2 py-1 rounded bg-red-500/60 hover:bg-red-500 transition text-sm"
                      disabled={busy}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button className="px-5 py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 transition disabled:opacity-60" disabled={busy}>
            {busy ? "Saving..." : "Save Experience"}
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
