import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getTheme, setTheme } from "../utils/theme.js";
import usePortfolioData from "../utils/usePortfolioData.js";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" }
];

const NAV_OFFSET = 92; // sticky navbar height approx

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Navbar() {
  const { data } = usePortfolioData();
  const profile = data?.profile || { name: "Portfolio", image: null };
  const [activeId, setActiveId] = useState("home");
  const [open, setOpen] = useState(false);
  const [theme, setThemeState] = useState(getTheme());

  const location = useLocation();
  const navigate = useNavigate();

  const isHome = useMemo(() => location.pathname === "/", [location.pathname]);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!isHome) return;

    const ids = SECTIONS.map((s) => s.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { root: null, threshold: [0.25, 0.4, 0.55] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [isHome]);

  const onNavClick = (id) => {
    if (!isHome) {
      navigate("/");
      setTimeout(() => scrollToId(id), 120);
      return;
    }
    scrollToId(id);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    setTheme(next);
  };

  const NavButton = ({ id, label }) => (
    <button
      onClick={() => onNavClick(id)}
      className={[
        "px-3 py-2 rounded-xl transition border",
        activeId === id && isHome
          ? "bg-white/10 border-white/20"
          : "border-transparent hover:border-white/15 hover:bg-white/5"
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-6xl px-4 pt-4">
        <div className="glass px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-semibold tracking-wide">
            {profile.image && (
              <img 
                src={profile.image} 
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
            )}
            <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent">
              JabedKhan
            </span>
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <button
              className="glass px-3 py-2"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀" : "🌙"}
            </button>
            <button
              className="glass px-3 py-2"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {SECTIONS.map((s) => (
              <NavButton key={s.id} id={s.id} label={s.label} />
            ))}

            <button
              onClick={toggleTheme}
              className="ml-1 px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>

            <Link
              to="/admin"
              className="ml-1 px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
              title="Admin"
            >
              Admin
            </Link>
          </div>
        </div>

        {open ? (
          <div className="md:hidden mt-3 glass p-3">
            <div className="grid gap-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onNavClick(s.id)}
                  className="text-left px-3 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  {s.label}
                </button>
              ))}
              <Link
                to="/admin"
                className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
              >
                Admin
              </Link>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}