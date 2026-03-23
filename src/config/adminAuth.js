import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase.js";
import { ADMIN_ALLOWLIST_EMAILS, ADMIN_ALLOWLIST_UIDS } from "../config/admin.js";

export function isAdminUser(user) {
  if (!user) return false;

  const emailOk =
    user.email && ADMIN_ALLOWLIST_EMAILS.map((e) => e.toLowerCase()).includes(user.email.toLowerCase());

  const uidOk = ADMIN_ALLOWLIST_UIDS.length ? ADMIN_ALLOWLIST_UIDS.includes(user.uid) : true;

  return emailOk && uidOk;
}

export function watchAuth(cb) {
  return onAuthStateChanged(auth, (user) => cb(user));
}

export async function adminLogin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function adminLogout() {
  await signOut(auth);
}