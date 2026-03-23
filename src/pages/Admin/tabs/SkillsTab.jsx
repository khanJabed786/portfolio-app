import React, { useEffect, useState } from "react";
import Toast from "../../../components/common/Toast.jsx";
import { adminUpsertSkills } from "../../../config/adminFirestore.js";
import { usePortfolio } from "../../../context/PortfolioContext.jsx";

export default function SkillsTab() {
  const { data } = usePortfolio();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  
  const [form, setForm] = useState({
    title: "",
    groups: [{ name: "", items: [""] }]
  });

  useEffect(() => {
    if (data?.skills) {
      setForm({
        title: data.skills.title || "",
        groups: Array.isArray(data.skills.groups) ? data.skills.groups : [{ name: "", items: [""] }]
      });
    }
  }, [data?.skills]);

  const updateGroupName = (idx, value) => {
    setForm((f) => {
      const g = [...f.groups];
      g[idx] = { ...g[idx], name: value };
      return { ...f, groups: g };
    });
  };

  const updateGroupItem = (gIdx, iIdx, value) => {
    setForm((f) => {
      const g = [...f.groups];
      const items = [...g[gIdx].items];
      items[iIdx] = value;
      g[gIdx] = { ...g[gIdx], items };
      return { ...f, groups: g };
    });
  };

  const addItemToGroup = (gIdx) => {
    setForm((f) => {
      const g = [...f.groups];
      g[gIdx] = { ...g[gIdx], items: [...g[gIdx].items, ""] };
      return { ...f, groups: g };
    });
  };

  const removeItemFromGroup = (gIdx, iIdx) => {
    setForm((f) => {
      const g = [...f.groups];
      g[gIdx] = { ...g[gIdx], items: g[gIdx].items.filter((_, i) => i !== iIdx) };
      return { ...f, groups: g };
    });
  };

  const addGroup = () => {
    setForm((f) => ({ ...f, groups: [...f.groups, { name: "", items: [""] }] }));
  };

  const removeGroup = (idx) => {
    setForm((f) => ({ ...f, groups: f.groups.filter((_, i) => i !== idx) }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setToast({ open: true, type: "error", message: "Title is required." });
      return;
    }

    setBusy(true);
    try {
      await adminUpsertSkills({
        title: form.title.trim(),
        groups: form.groups
          .filter((g) => g.name.trim())
          .map((g) => ({
            name: g.name.trim(),
            items: g.items.filter((i) => i.trim())
          }))
      });
      setToast({ open: true, type: "success", message: "Skills updated!" });
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
        <h2 className="text-xl font-semibold mb-4">Edit Skills</h2>

        <form onSubmit={onSave} className="grid gap-6">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Title</label>
            <input
              className="glass px-4 py-3 outline-none w-full"
              placeholder="Skills"
              value={form.title}
              disabled={busy}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/70">Skill Groups</label>
              <button
                type="button"
                onClick={addGroup}
                className="text-xs px-2 py-1 rounded bg-indigo-500/60 hover:bg-indigo-500 transition"
                disabled={busy}
              >
                + Group
              </button>
            </div>
            <div className="grid gap-3">
              {form.groups.map((group, gIdx) => (
                <div key={gIdx} className="glass p-4 grid gap-2">
                  <div className="flex gap-2">
                    <input
                      className="glass px-3 py-2 outline-none flex-1"
                      placeholder="Group name (e.g., Frontend)"
                      value={group.name}
                      disabled={busy}
                      onChange={(e) => updateGroupName(gIdx, e.target.value)}
                    />
                    {form.groups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGroup(gIdx)}
                        className="px-2 py-1 rounded bg-red-500/60 hover:bg-red-500 transition text-sm"
                        disabled={busy}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="pl-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-white/60">Skills</label>
                      <button
                        type="button"
                        onClick={() => addItemToGroup(gIdx)}
                        className="text-xs px-1 py-0.5 rounded bg-indigo-500/40 hover:bg-indigo-500/60 transition"
                        disabled={busy}
                      >
                        + Skill
                      </button>
                    </div>
                    <div className="grid gap-1">
                      {group.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex gap-1">
                          <input
                            className="glass px-2 py-1 outline-none flex-1 text-sm"
                            placeholder={`Skill ${iIdx + 1}`}
                            value={item}
                            disabled={busy}
                            onChange={(e) => updateGroupItem(gIdx, iIdx, e.target.value)}
                          />
                          {group.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItemFromGroup(gIdx, iIdx)}
                              className="px-1 rounded bg-red-500/40 hover:bg-red-500/60 transition text-xs"
                              disabled={busy}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="px-5 py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 transition disabled:opacity-60" disabled={busy}>
            {busy ? "Saving..." : "Save Skills"}
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
