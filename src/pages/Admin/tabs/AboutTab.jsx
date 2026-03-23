import React, { useEffect, useState } from "react";
import Toast from "../../../components/common/Toast.jsx";
import { adminUpsertAbout } from "../../../config/adminFirestore.js";
import { usePortfolio } from "../../../context/PortfolioContext.jsx";

export default function AboutTab() {
  const { data } = usePortfolio();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  
  const [form, setForm] = useState({
    title: "",
    paragraphs: [""],
    highlights: [{ title: "", desc: "", icon: "" }]
  });

  useEffect(() => {
    if (data?.about) {
      setForm({
        title: data.about.title || "",
        paragraphs: Array.isArray(data.about.paragraphs) ? data.about.paragraphs : [""],
        highlights: Array.isArray(data.about.highlights) ? data.about.highlights : [{ title: "", desc: "", icon: "" }]
      });
    }
  }, [data?.about]);

  const updateParagraph = (idx, value) => {
    setForm((f) => {
      const p = [...f.paragraphs];
      p[idx] = value;
      return { ...f, paragraphs: p };
    });
  };

  const addParagraph = () => {
    setForm((f) => ({ ...f, paragraphs: [...f.paragraphs, ""] }));
  };

  const removeParagraph = (idx) => {
    setForm((f) => ({ ...f, paragraphs: f.paragraphs.filter((_, i) => i !== idx) }));
  };

  const updateHighlight = (idx, key, value) => {
    setForm((f) => {
      const h = [...f.highlights];
      h[idx] = { ...h[idx], [key]: value };
      return { ...f, highlights: h };
    });
  };

  const addHighlight = () => {
    setForm((f) => ({ ...f, highlights: [...f.highlights, { title: "", desc: "", icon: "" }] }));
  };

  const removeHighlight = (idx) => {
    setForm((f) => ({ ...f, highlights: f.highlights.filter((_, i) => i !== idx) }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setToast({ open: true, type: "error", message: "Title is required." });
      return;
    }

    setBusy(true);
    try {
      await adminUpsertAbout({
        title: form.title.trim(),
        paragraphs: form.paragraphs.filter((p) => p.trim()),
        highlights: form.highlights.filter((h) => h.title.trim() || h.desc.trim() || h.icon.trim())
      });
      setToast({ open: true, type: "success", message: "About section updated!" });
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
        <h2 className="text-xl font-semibold mb-4">Edit About Section</h2>

        <form onSubmit={onSave} className="grid gap-6">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Title</label>
            <input
              className="glass px-4 py-3 outline-none w-full"
              placeholder="About Me"
              value={form.title}
              disabled={busy}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/70">Paragraphs</label>
              <button
                type="button"
                onClick={addParagraph}
                className="text-xs px-2 py-1 rounded bg-indigo-500/60 hover:bg-indigo-500 transition"
                disabled={busy}
              >
                + Add
              </button>
            </div>
            <div className="grid gap-2">
              {form.paragraphs.map((para, idx) => (
                <div key={idx} className="flex gap-2">
                  <textarea
                    className="glass px-4 py-3 outline-none flex-1 resize-none"
                    rows={2}
                    placeholder={`Paragraph ${idx + 1}`}
                    value={para}
                    disabled={busy}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                  />
                  {form.paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParagraph(idx)}
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
              <label className="text-sm text-white/70">Highlights (Features)</label>
              <button
                type="button"
                onClick={addHighlight}
                className="text-xs px-2 py-1 rounded bg-indigo-500/60 hover:bg-indigo-500 transition"
                disabled={busy}
              >
                + Add
              </button>
            </div>
            <div className="grid gap-3">
              {form.highlights.map((h, idx) => (
                <div key={idx} className="glass p-4 grid gap-2">
                  <div className="flex gap-2">
                    <input
                      className="glass px-3 py-2 outline-none w-12 text-center"
                      placeholder="Icon"
                      value={h.icon}
                      disabled={busy}
                      onChange={(e) => updateHighlight(idx, "icon", e.target.value)}
                    />
                    <input
                      className="glass px-3 py-2 outline-none flex-1"
                      placeholder="Title"
                      value={h.title}
                      disabled={busy}
                      onChange={(e) => updateHighlight(idx, "title", e.target.value)}
                    />
                  </div>
                  <textarea
                    className="glass px-3 py-2 outline-none resize-none"
                    rows={2}
                    placeholder="Description"
                    value={h.desc}
                    disabled={busy}
                    onChange={(e) => updateHighlight(idx, "desc", e.target.value)}
                  />
                  {form.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
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
            {busy ? "Saving..." : "Save About"}
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
