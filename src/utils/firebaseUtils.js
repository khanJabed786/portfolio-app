import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { db } from "../config/firebase.js";

/**
 * Collections design:
 * - public/profile (doc: "main")
 * - public/about (doc: "main")
 * - public/skills (doc: "main")
 * - public/experience (doc: "main")
 * - public/achievements (doc: "main")
 * - publicProjects (collection)
 * - contactMessages (collection)
 * - analyticsEvents (collection)
 */

// Real-time listeners
export function onProfileChange(callback) {
  const ref = doc(db, "public", "profile");
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (err) => console.warn("[onProfileChange]", err));
}

export function onAboutChange(callback) {
  const ref = doc(db, "public", "about");
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (err) => console.warn("[onAboutChange]", err));
}

export function onSkillsChange(callback) {
  const ref = doc(db, "public", "skills");
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (err) => console.warn("[onSkillsChange]", err));
}

export function onExperienceChange(callback) {
  const ref = doc(db, "public", "experience");
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (err) => console.warn("[onExperienceChange]", err));
}

export function onAchievementsChange(callback) {
  const ref = doc(db, "public", "achievements");
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (err) => console.warn("[onAchievementsChange]", err));
}

export function onProjectsChange(callback) {
  const ref = collection(db, "publicProjects");
  const q = query(ref, orderBy("createdAt", "desc"), limit(50));
  return onSnapshot(q, (snaps) => {
    const projects = snaps.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        // Ensure images is always an array
        images: Array.isArray(data.images)
          ? data.images.filter(Boolean)
          : data.images
          ? [data.images]
          : []
      };
    });
    callback(projects);
  }, (err) => console.warn("[onProjectsChange]", err));
}

export function onTypewriterChange(callback) {
  const ref = doc(db, "public", "typewriter");
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (err) => console.warn("[onTypewriterChange]", err));
}

// One-time fetches (for backward compatibility)
export async function getPublicProfile() {
  const ref = doc(db, "public", "profile");
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

export async function getPublicTypewriter() {
  const ref = doc(db, "public", "typewriter");
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

export async function ensurePublicProfile(defaultProfile) {
  const ref = doc(db, "public", "profile");
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  await setDoc(ref, {
    ...defaultProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function getPublicProjects() {
  const ref = collection(db, "publicProjects");
  const q = query(ref, orderBy("createdAt", "desc"), limit(50));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      // Ensure images is always an array
      images: Array.isArray(data.images)
        ? data.images.filter(Boolean)
        : data.images
        ? [data.images]
        : []
    };
  });
}

export async function addContactMessage({ name, email, message, meta }) {
  const ref = collection(db, "contactMessages");
  return await addDoc(ref, {
    name,
    email,
    message,
    meta: meta ?? {},
    createdAt: serverTimestamp()
  });
}

export async function logAnalyticsEvent({ type, path, label, meta }) {
  const ref = collection(db, "analyticsEvents");
  try {
    await addDoc(ref, {
      type,
      path: path ?? "",
      label: label ?? "",
      meta: meta ?? {},
      createdAt: serverTimestamp()
    });
  } catch (e) {
    // analytics should never break UX
    console.warn("[analytics] log failed", e);
  }
}