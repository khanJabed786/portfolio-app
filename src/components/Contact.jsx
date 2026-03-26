import React, { useState } from "react";
import { portfolio } from "../data/portfolio.js";
import Toast from "./common/Toast.jsx";
import { addContactMessage } from "../utils/firebaseUtils.js";

export default function Contact() {
  const { contact } = portfolio;

  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setToast({ open: true, type: "error", message: "Please fill all fields." });
      return;
    }

    setBusy(true);
    try {
      await addContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        meta: {
          ua: navigator.userAgent,
          path: location.pathname,
          ts: new Date().toISOString()
        }
      });

      setToast({ open: true, type: "success", message: "Message sent successfully!" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setToast({ open: true, type: "error", message: "Failed to send message. Try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="space-y-8 sm:space-y-12">
        {/* Header */}
        <div data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              {contact.title}
            </span>
          </h2>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Info Section */}
          <div className="space-y-6 sm:space-y-8" data-aos="fade-right">
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">{contact.subtitle}</p>

            <div className="p-4 sm:p-6 rounded-xl border border-orange-400/30 bg-orange-500/10 hover:bg-orange-500/20 transition-all duration-300">
              <div className="text-xs sm:text-sm font-semibold tracking-widest text-orange-300 uppercase mb-2">
                📧 Email
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="text-lg sm:text-xl font-semibold text-orange-200 hover:text-orange-100 transition"
              >
                {contact.email}
              </a>
            </div>

            <a
              href="https://maps.google.com/?q=India"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 sm:p-6 rounded-xl border border-orange-400/30 bg-orange-500/10 hover:bg-orange-500/20 transition-all duration-300 cursor-pointer group function-hover"
            >
              <div className="text-xs sm:text-sm font-semibold tracking-widest text-orange-300 uppercase mb-3">
                📍 Based In
              </div>
              <p className="text-lg sm:text-xl font-semibold text-orange-200 group-hover:text-orange-100 transition">
                India
              </p>
              <p className="text-xs text-orange-300/60 mt-2">Click to view on Google Maps</p>
            </a>

            <div>
              <p className="text-sm text-white/60">
                💡 Feel free to reach out for collaborations, freelance work, or just a friendly hello!
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={onSubmit} className="space-y-4" data-aos="fade-left">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              className="w-full px-5 py-4 rounded-xl glass border border-white/10 focus:border-orange-400 outline-none transition bg-white/5 hover:bg-white/10 text-white placeholder-white/50"
              disabled={busy}
            />
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Your email"
              type="email"
              className="w-full px-5 py-4 rounded-xl glass border border-white/10 focus:border-orange-400 outline-none transition bg-white/5 hover:bg-white/10 text-white placeholder-white/50"
              disabled={busy}
            />
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Your message..."
              rows={5}
              className="w-full px-5 py-4 rounded-xl glass border border-white/10 focus:border-orange-400 outline-none transition bg-white/5 hover:bg-white/10 text-white placeholder-white/50 resize-none"
              disabled={busy}
            />
            <button
              disabled={busy}
              className="w-full ripple-btn px-6 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {busy ? "✉️ Sending..." : "🚀 Send Message"}
            </button>
          </form>
        </div>
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </div>
  );
}