import React from "react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto glass p-8">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-3 text-white/80">
          This portfolio may collect basic analytics (page views/click events) and contact form
          messages you submit. Your data is used only to respond to inquiries and improve the
          portfolio experience.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Contact Messages</h2>
        <p className="mt-2 text-white/80">
          If you submit the contact form, your name, email, and message may be stored in a database
          (Firebase) for reply purposes.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Analytics</h2>
        <p className="mt-2 text-white/80">
          Anonymous usage analytics may be stored (e.g., page views and button clicks). No sensitive
          personal data is intentionally collected.
        </p>

        <p className="mt-10 text-sm text-white/60">
          Last updated: 2026-03-19
        </p>
      </div>
    </main>
  );
}