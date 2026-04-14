import React from "react";

import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Skills from "../components/Skills.jsx";
import Projects from "../components/Projects.jsx";
import Experience from "../components/Experience.jsx";
import Achievements from "../components/Achievements.jsx";
import Certificates from "../components/Certificates.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

import ScrollProgress from "../components/common/ScrollProgress.jsx";
import BackToTop from "../components/common/BackToTop.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary.jsx";

const SECTIONS = [
  { id: "home", component: Hero, label: "Hero" },
  { id: "about", component: About, label: "About" },
  { id: "skills", component: Skills, label: "Skills" },
  { id: "projects", component: Projects, label: "Projects" },
  { id: "experience", component: Experience, label: "Experience" },
  { id: "achievements", component: Achievements, label: "Achievements" },
];

const SINGLE_SECTIONS = [
  { id: "certificates", component: Certificates, label: "Certificates", fullHeight: true },
  { id: "contact", component: Contact, label: "Contact", fullHeight: true },
];

export default function HomePage() {
  return (
    <main className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <ScrollProgress />
      <BackToTop />

      {SECTIONS.map((section) => {
        const Component = section.component;
        return (
          <ErrorBoundary key={section.id} section={section.label}>
            <section
              id={section.id}
              className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
            >
              <div className="w-full max-w-7xl">
                <Component />
              </div>
            </section>
          </ErrorBoundary>
        );
      })}

      {SINGLE_SECTIONS.map((section) => {
        const Component = section.component;
        return (
          <ErrorBoundary key={section.id} section={section.label}>
            {section.fullHeight ? (
              <section
                id={section.id}
                className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
              >
                <div className="w-full max-w-7xl">
                  <Component />
                </div>
              </section>
            ) : (
              <section id={section.id} className="w-full px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl mx-auto">
                  <Component />
                </div>
              </section>
            )}
          </ErrorBoundary>
        );
      })}

      <ErrorBoundary section="Footer">
        <Footer />
      </ErrorBoundary>
    </main>
  );
}