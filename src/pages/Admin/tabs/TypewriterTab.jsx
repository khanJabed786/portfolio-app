import React, { useEffect, useState } from "react";
import Toast from "../../../components/common/Toast.jsx";
import { portfolio as fallback } from "../../../data/portfolio.js";
import { getPublicTypewriter } from "../../../utils/firebaseUtils.js";
import { adminUpsertTypewriter } from "../../../config/adminFirestore.js";

const COLORS = [
  { hex: "#FF6B6B", name: "Red" },
  { hex: "#4ECDC4", name: "Teal" },
  { hex: "#45B7D1", name: "Blue" },
  { hex: "#FFA07A", name: "Light Salmon" },
  { hex: "#98D8C8", name: "Mint" },
  { hex: "#F7DC6F", name: "Yellow" },
  { hex: "#BB8FCE", name: "Purple" },
  { hex: "#85C1E2", name: "Sky Blue" },
  { hex: "#F8B88B", name: "Peach" },
  { hex: "#A8D8EA", name: "Light Blue" }
];

export default function TypewriterTab() {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [words, setWords] = useState([
    { text: "Fast UI", color: "#FF6B6B" },
    { text: "Modern Animations", color: "#4ECDC4" },
    { text: "Clean Code", color: "#45B7D1" },
    { text: "Firebase Backend", color: "#FFA07A" }
  ]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPublicTypewriter();
        if (!mounted || !data) return;
        setWords(data.words ?? []);
      } catch (e) {
        console.warn(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const addWord = () => {
    setWords((prev) => [
      ...prev,
      { text: "New Skill", color: COLORS[prev.length % COLORS.length].hex }
    ]);
  };

  const removeWord = (idx) => {
    setWords((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateWord = (idx, field, value) => {
    setWords((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const onSave = async () => {
    setBusy(true);
    try {
      if (!words.length) {
        setToast({ open: true, type: "error", message: "At least one word required" });
        setBusy(false);
        return;
      }

      await adminUpsertTypewriter({ words });
      setToast({ open: true, type: "success", message: "Typewriter words updated!" });
    } catch (err) {
      console.error(err);
      setToast({ open: true, type: "error", message: "Failed to update words." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="glass p-6">
      <h2 className="text-xl font-semibold">Typewriter Words</h2>
      <p className="text-white/70 text-sm mt-1">Manage rotating text with colors. (Hero section)</p>

      <div className="mt-5 space-y-3">
        {words.map((word, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-sm text-white/70 mb-1 block">Word/Phrase #{idx + 1}</label>
              <input
                className="glass px-4 py-3 outline-none w-full"
                value={word.text}
                onChange={(e) => updateWord(idx, "text", e.target.value)}
                placeholder="e.g., Fast UI"
                disabled={busy}
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1 block">Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={word.color}
                  onChange={(e) => updateWord(idx, "color", e.target.value)}
                  className="w-12 h-12 cursor-pointer rounded-lg"
                  disabled={busy}
                />
                <span className="text-white/70 text-sm">{word.color}</span>
              </div>
            </div>

            <div>
              <button
                onClick={() => removeWord(idx)}
                className="w-full px-3 py-3 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition disabled:opacity-60"
                disabled={busy || words.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={addWord}
          disabled={busy}
          className="px-5 py-3 rounded-xl bg-green-500/80 hover:bg-green-500 transition disabled:opacity-60"
        >
          + Add Word
        </button>
        <button
          onClick={onSave}
          disabled={busy}
          className="px-5 py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 transition disabled:opacity-60"
        >
          {busy ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white/70 text-sm mb-2">Color Suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <div key={c.hex} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-white/20"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-white/70 text-sm">{c.name}</span>
            </div>
          ))}
        </div>
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
