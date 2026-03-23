import React from "react";

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto glass p-8">
        <h1 className="text-3xl font-semibold">Terms of Use</h1>
        <p className="mt-3 text-white/80">
          This website is provided for showcasing projects and skills. Content may change anytime.
          You may not copy or redistribute proprietary content without permission.
        </p>

        <h2 className="mt-8 text-xl font-semibold">No Warranty</h2>
        <p className="mt-2 text-white/80">
          This website is provided "as is" without warranties of any kind.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Contact</h2>
        <p className="mt-2 text-white/80">
          For questions, use the contact form.
        </p>

        <p className="mt-10 text-sm text-white/60">
          Last updated: 2026-03-19
        </p>
      </div>
    </main>
  );
}