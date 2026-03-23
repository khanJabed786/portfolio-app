import React, { useEffect, useState } from "react";
import Toast from "../../../components/common/Toast.jsx";
import { adminListMessages } from "../../../config/adminFirestore.js";

export default function MessagesTab() {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [items, setItems] = useState([]);

  const load = async () => {
    setBusy(true);
    try {
      setItems(await adminListMessages());
    } catch (e) {
      console.error(e);
      setToast({ open: true, type: "error", message: "Failed to load messages." });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="glass p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button
          onClick={load}
          disabled={busy}
          className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
        >
          Refresh
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {items.map((m) => (
          <div key={m.id} className="glass p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-semibold">{m.name}</div>
              <a className="text-indigo-200 hover:text-indigo-100" href={`mailto:${m.email}`}>
                {m.email}
              </a>
            </div>
            <div className="mt-3 text-white/80 whitespace-pre-wrap">{m.message}</div>
          </div>
        ))}

        {!items.length ? <div className="text-white/70">No messages yet.</div> : null}
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