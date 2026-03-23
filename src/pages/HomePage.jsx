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

export default function HomePage() {
  React.useEffect(() => {
    console.log("✅ HomePage mounted - rendering sections");
  }, []);

  return (
    <main className="relative">
      <ScrollProgress />
      <BackToTop />

      <ErrorBoundary section="Hero">
        <section id="home" className="min-h-screen flex items-center">
          <div className="w-full">
            <Hero />
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary section="About">
        <section id="about" className="min-h-screen flex items-center py-20">
          <div className="w-full">
            <About />
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary section="Skills">
        <section id="skills" className="min-h-screen flex items-center py-20">
          <div className="w-full">
            <Skills />
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary section="Projects">
        <section id="projects" className="min-h-screen flex items-center py-20">
          <div className="w-full">
            <Projects />
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary section="Experience">
        <section id="experience" className="min-h-screen flex items-center py-20">
          <div className="w-full">
            <Experience />
          </div>
        </section>
      </ErrorBoundary>
                                          
      <ErrorBoundary section="Achievements">
        <section id="achievements" className="min-h-screen flex items-center py-20">
          <div className="w-full">
            <Achievements />
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary section="Certificates">
        <Certificates />
      </ErrorBoundary>

      <ErrorBoundary section="Contact">
        <section id="contact" className="min-h-screen flex items-center py-20">
          <div className="w-full">
            <Contact />
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary section="Footer">
        <Footer />
      </ErrorBoundary>
    </main>
  );
}