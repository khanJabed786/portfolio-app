import React, { useState } from "react";
import Modal from "./Modal.jsx";
import { linkedInShareUrl, shareLink, whatsappShareUrl } from "../../utils/share.js";

export default function ShareButtons({ title, text }) {
  const [open, setOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const onShare = async () => {
    const res = await shareLink({ title, text, url });
    if (!res.ok) setOpen(true);
  };

  return (
    <>
      <button
        onClick={onShare}
        className="ripple-btn px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
      >
        Share
      </button>

      <Modal open={open} title="Share this page" onClose={() => setOpen(false)}>
        <div className="flex flex-wrap gap-2">
          <a
            className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/25 hover:bg-emerald-500/30 transition"
            href={whatsappShareUrl(url, text)}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a
            className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/25 hover:bg-indigo-500/30 transition"
            href={linkedInShareUrl(url)}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>

          <button
            className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              setOpen(false);
            }}
          >
            Copy Link
          </button>
        </div>
      </Modal>
    </>
  );
}