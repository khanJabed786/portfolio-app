import { useEffect, useState } from "react";
import { portfolio as fallback } from "../data/portfolio.js";
import {
  ensurePublicProfile,
  getPublicProfile,
  getPublicProjects,
  getPublicTypewriter,
  onProfileChange,
  onAboutChange,
  onSkillsChange,
  onExperienceChange,
  onAchievementsChange,
  onTypewriterChange,
  onProjectsChange
} from "./firebaseUtils.js";

export default function usePortfolioData() {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(false); // Start as false to show fallback immediately

  useEffect(() => {
    let mounted = true;
    const unsubscribers = [];
    let timeoutId = null;

    async function run() {
      try {
        console.log("[usePortfolioData] Starting data load...");
        
        // Set a 10-second timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.warn("[usePortfolioData] Loading timeout - using fallback");
            setLoading(false);
          }
        }, 10000);

        // Ensure profile exists once (optional)
        try {
          await ensurePublicProfile(fallback.profile);
        } catch (e) {
          console.warn("[usePortfolioData] ensurePublicProfile error (non-blocking):", e.message);
        }

        // One-time fetch for initial profile
        try {
          const profile = await getPublicProfile();
          if (mounted && profile) {
            console.log("[usePortfolioData] Profile loaded");
            setData((d) => ({ ...d, profile: { ...d.profile, ...profile } }));
          }
        } catch (e) {
          console.warn("[usePortfolioData] getPublicProfile error:", e.message);
        }

        // One-time fetch for projects as fallback
        try {
          const projects = await getPublicProjects();
          if (mounted && projects?.length) {
            console.log("[usePortfolioData] Projects loaded:", projects.length);
            setData((d) => ({
              ...d,
              projects: {
                ...d.projects,
                items: projects
              }
            }));
          }
        } catch (e) {
          console.warn("[usePortfolioData] getPublicProjects error (will use fallback):", e.message);
        }

        // One-time fetch for typewriter words
        try {
          const typewriter = await getPublicTypewriter();
          if (mounted && typewriter?.words) {
            console.log("[usePortfolioData] Typewriter loaded");
            setData((d) => ({
              ...d,
              typewriter
            }));
          }
        } catch (e) {
          console.warn("[usePortfolioData] getPublicTypewriter error (will use fallback):", e.message);
        }

        console.log("[usePortfolioData] Initial load complete");
      } catch (e) {
        console.error("[usePortfolioData] Unexpected error:", e);
      } finally {
        if (mounted) {
          setLoading(false);
          if (timeoutId) clearTimeout(timeoutId);
        }
      }
    }

    run();

    // Set up real-time listeners
    if (mounted) {
      const unsubProfile = onProfileChange((profile) => {
        if (mounted) {
          setData((d) => ({ ...d, profile: { ...d.profile, ...profile } }));
        }
      });
      unsubscribers.push(unsubProfile);

      const unsubAbout = onAboutChange((about) => {
        if (mounted) {
          setData((d) => ({ ...d, about }));
        }
      });
      unsubscribers.push(unsubAbout);

      const unsubSkills = onSkillsChange((skills) => {
        if (mounted) {
          setData((d) => ({ ...d, skills }));
        }
      });
      unsubscribers.push(unsubSkills);

      const unsubExperience = onExperienceChange((experience) => {
        if (mounted) {
          setData((d) => ({ ...d, experience }));
        }
      });
      unsubscribers.push(unsubExperience);

      const unsubAchievements = onAchievementsChange((achievements) => {
        if (mounted) {
          setData((d) => ({ ...d, achievements }));
        }
      });
      unsubscribers.push(unsubAchievements);

      const unsubTypewriter = onTypewriterChange((typewriter) => {
        if (mounted) {
          setData((d) => ({ ...d, typewriter }));
        }
      });
      unsubscribers.push(unsubTypewriter);

      const unsubProjects = onProjectsChange((projects) => {
        if (mounted) {
          setData((d) => ({
            ...d,
            projects: {
              ...d.projects,
              items: projects
            }
          }));
        }
      });
      unsubscribers.push(unsubProjects);
    }

    return () => {
      mounted = false;
      unsubscribers.forEach((unsub) => unsub?.());
    };
  }, []);

  return { data, loading };
}