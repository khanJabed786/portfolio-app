import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

import ParticleBackground from "./Animations/ParticleBackground.jsx";
import CustomCursor from "./Animations/CustomCursor.jsx";
import EasterEgg from "./Animations/EasterEgg.jsx";

import { PortfolioProvider } from "./context/PortfolioContext.jsx";
import { applyTheme, getTheme } from "./utils/theme.js";
import { trackPageView } from "./utils/analytics.js";
import { initClarity, initHotjar } from "./utils/heatmap.js";

const HomePage = React.lazy(() => import("./pages/HomePage.jsx"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage.jsx"));
const TermsPage = React.lazy(() => import("./pages/TermsPage.jsx"));
const AdminPage = React.lazy(() => import("./pages/Admin/AdminPage.jsx"));

const ProjectCaseStudyPage = React.lazy(() => import("./pages/ProjectCaseStudyPage.jsx"));
const ResumePage = React.lazy(() => import("./pages/ResumePage.jsx"));

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

export default function App() {
  useEffect(() => {
    console.log("✅ [App] Component mounted");
    window.history.scrollRestoration = "manual";
    applyTheme(getTheme());

    initClarity();
    initHotjar();

    AOS.init({
      duration: 700,
      easing: "ease-out",
      once: true,
      offset: 80
    });
  }, []);

  return (
    <PortfolioProvider>
      <div className="min-h-screen animated-gradient page-enter">
        <ParticleBackground />
        <CustomCursor />
        <EasterEgg />

        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <PageViewTracker />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <HomePage />
                </>
              }
            />

            <Route
              path="/resume"
              element={
                <>
                  <Navbar />
                  <ResumePage />
                </>
              }
            />

            <Route
              path="/projects/:id"
              element={
                <>
                  <Navbar />
                  <ProjectCaseStudyPage />
                </>
              }
            />

            <Route
              path="/privacy"
              element={
                <>
                  <Navbar />
                  <PrivacyPage />
                </>
              }
            />
            <Route
              path="/terms"
              element={
                <>
                  <Navbar />
                  <TermsPage />
                </>
              }
            />

            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </PortfolioProvider>
  );
}