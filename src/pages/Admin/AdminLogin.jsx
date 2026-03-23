import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../../components/common/Toast.jsx";
import { adminLogin, isAdminUser } from "../../config/adminAuth.js";

export default function AdminLogin() {
  const nav = useNavigate();

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [form, setForm] = useState({ email: "javedkhan1foru@gmail.com", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.password.trim()) {
      setToast({ open: true, type: "error", message: "Password is required!" });
      return;
    }
    
    setBusy(true);
    try {
      console.log("[AdminLogin] Attempting login with:", form.email);
      const user = await adminLogin(form.email.trim(), form.password);
      console.log("[AdminLogin] User received:", user);
      
      if (!isAdminUser(user)) {
        console.log("[AdminLogin] User not in admin allowlist. Email:", user.email, "UID:", user.uid);
        setToast({ open: true, type: "error", message: `Not approved as admin. Ask developer to add: ${user.uid}` });
        return;
      }
      
      console.log("[AdminLogin] Admin verified!");
      setToast({ open: true, type: "success", message: "Admin login successful!" });
      setTimeout(() => nav("/admin/dashboard"), 500);
    } catch (err) {
      console.error("[AdminLogin] Error:", err.code, err.message);
      
      let errMsg = "Login failed. Check credentials.";
      if (err.code === "auth/user-not-found") {
        errMsg = "User not found. Create account first or check email.";
      } else if (err.code === "auth/wrong-password") {
        errMsg = "Wrong password!";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Invalid email format!";
      }
      
      setToast({ open: true, type: "error", message: errMsg });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-xl mx-auto glass p-8">
        <h1 className="text-3xl font-semibold">Admin Login</h1>
        <p className="mt-3 text-white/80">
          Only approved admin can access dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="glass px-4 py-3 outline-none"
            placeholder="Email"
            type="email"
            disabled={busy}
          />
          <input
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="glass px-4 py-3 outline-none"
            placeholder="Password"
            type="password"
            disabled={busy}
          />

          <button
            disabled={busy}
            className="ripple-btn px-5 py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 transition disabled:opacity-60"
          >
            {busy ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 p-4 bg-white/5 border border-white/15 rounded-xl text-sm">
          <h3 className="font-semibold text-indigo-200 mb-2">📝 Test Account</h3>
          <p className="text-white/80 mb-2">Use these credentials to test:</p>
          <code className="block bg-black/40 p-2 rounded mb-2">
            Email: test@test.com
            <br />
            Password: You need to create this in Firebase Console
          </code>
          <p className="text-white/70 text-xs mt-2">
            ℹ️ Go to Firebase Console → Authentication → Create a new user with email "test@test.com"
          </p>
        </div>

        <div className="mt-4">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10 transition"
          >
            Back to site
          </Link>
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