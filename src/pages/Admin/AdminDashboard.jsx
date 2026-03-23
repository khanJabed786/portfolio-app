import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Toast from "../../components/common/Toast.jsx";
import { adminLogout } from "../../config/adminAuth.js";

import ProfileTab from "./tabs/ProfileTab.jsx";
import ProjectsTab from "./tabs/ProjectsTab.jsx";
import AboutTab from "./tabs/AboutTab.jsx";
import SkillsTab from "./tabs/SkillsTab.jsx";
import ExperienceTab from "./tabs/ExperienceTab.jsx";
import AchievementsTab from "./tabs/AchievementsTab.jsx";
import TypewriterTab from "./tabs/TypewriterTab.jsx";
import MessagesTab from "./tabs/MessagesTab.jsx";
import AnalyticsTab from "./tabs/AnalyticsTab.jsx";
import CertificatesTab from "./tabs/CertificatesTab.jsx";

const TABS = ["Profile", "About", "Skills", "Experience", "Achievements", "Typewriter", "Certificates", "Projects", "Messages", "Analytics"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Profile");
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });

  useEffect(() => {
    document.title = `Admin • ${tab}`;
  }, [tab]);

  const onLogout = async () => {
    await adminLogout();
    setToast({ open: true, type: "success", message: "Logged out" });
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="glass p-6 flex items-center justify-between gap-3 flex-wrap rounded-2xl border border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">Manage your portfolio content & analytics</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-white transition"
            >
              ← Back to site
            </Link>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 glass p-4 flex gap-2 flex-wrap rounded-xl border border-white/10 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition border ${
                tab === t 
                  ? "bg-cyan-600/40 border-cyan-500/50 text-white font-semibold" 
                  : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8 min-h-96 w-full">
          {tab === "Profile" && <ProfileTab />}
          {tab === "About" && <AboutTab />}
          {tab === "Skills" && <SkillsTab />}
          {tab === "Experience" && <ExperienceTab />}
          {tab === "Achievements" && <AchievementsTab />}
          {tab === "Typewriter" && <TypewriterTab />}
          {tab === "Certificates" && <CertificatesTab />}
          {tab === "Projects" && <ProjectsTab />}
          {tab === "Messages" && <MessagesTab />}
          {tab === "Analytics" && <AnalyticsTab />}
        </div>
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </main>
  );
}