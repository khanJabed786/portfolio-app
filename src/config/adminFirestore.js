import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../config/firebase.js";

// Public content
export async function adminUpsertProfile(profile) {
  const ref = doc(db, "public", "profile");
  await setDoc(
    ref,
    {
      ...profile,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function adminUpsertAbout(about) {
  const ref = doc(db, "public", "about");
  await setDoc(
    ref,
    {
      ...about,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function adminUpsertSkills(skills) {
  const ref = doc(db, "public", "skills");
  await setDoc(
    ref,
    {
      ...skills,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function adminUpsertExperience(experience) {
  const ref = doc(db, "public", "experience");
  await setDoc(
    ref,
    {
      ...experience,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function adminUpsertAchievements(achievements) {
  const ref = doc(db, "public", "achievements");
  await setDoc(
    ref,
    {
      ...achievements,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function adminUpsertTypewriter(typewriter) {
  const ref = doc(db, "public", "typewriter");
  await setDoc(
    ref,
    {
      ...typewriter,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function adminAddProject(project) {
  const ref = collection(db, "publicProjects");
  return await addDoc(ref, {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function adminUpdateProject(id, patch) {
  const ref = doc(db, "publicProjects", id);
  await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

export async function adminDeleteProject(id) {
  await deleteDoc(doc(db, "publicProjects", id));
}

// Contact messages + analytics (read-only list)
export async function adminListMessages() {
  const ref = collection(db, "contactMessages");
  const q = query(ref, orderBy("createdAt", "desc"), limit(200));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function adminListAnalytics() {
  const ref = collection(db, "analyticsEvents");
  const q = query(ref, orderBy("createdAt", "desc"), limit(200));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function adminListProjects() {
  const ref = collection(db, "publicProjects");
  const q = query(ref, orderBy("createdAt", "desc"), limit(200));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Certificates management
export async function adminGetCertificates() {
  const ref = collection(db, "publicCertificates");
  const q = query(ref, orderBy("createdAt", "desc"), limit(200));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function adminAddCertificate(certificate) {
  const ref = collection(db, "publicCertificates");
  return await addDoc(ref, {
    ...certificate,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function adminUpdateCertificate(id, patch) {
  const ref = doc(db, "publicCertificates", id);
  await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

export async function adminDeleteCertificate(id) {
  await deleteDoc(doc(db, "publicCertificates", id));
}