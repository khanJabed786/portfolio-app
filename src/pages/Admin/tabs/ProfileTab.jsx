import React, { useEffect, useState } from "react";
import Toast from "../../../components/common/Toast.jsx";
import Lightbox from "../../../components/common/Lightbox.jsx";
import { portfolio as fallback } from "../../../data/portfolio.js";
import { getPublicProfile } from "../../../utils/firebaseUtils.js";
import { adminUpsertProfile } from "../../../config/adminFirestore.js";

export default function ProfileTab() {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [form, setForm] = useState({
    name: fallback.profile.name,
    role: fallback.profile.role,
    intro: fallback.profile.intro,
    image: "",
    resumeHref: fallback.profile.ctas.resume.href,
    resumeFile: "",
    resumeFileName: "",
    linkedin: fallback.profile.social.find((s) => s.label === "LinkedIn")?.href ?? "#",
    github: fallback.profile.social.find((s) => s.label === "GitHub")?.href ?? "#"
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await getPublicProfile();
        if (!mounted || !profile) return;
        setForm((f) => ({
          ...f,
          name: profile.name ?? f.name,
          role: profile.role ?? f.role,
          intro: profile.intro ?? f.intro,
          image: profile.image ?? f.image,
          resumeHref: profile.ctas?.resume?.href ?? f.resumeHref,
          resumeFile: profile.resumeFile ?? f.resumeFile,
          resumeFileName: profile.resumeFileName ?? f.resumeFileName,
          linkedin:
            profile.social?.find((s) => s.label === "LinkedIn")?.href ?? f.linkedin,
          github: profile.social?.find((s) => s.label === "GitHub")?.href ?? f.github
        }));
      } catch (e) {
        console.warn(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setToast({ open: true, type: "error", message: "Image must be less than 5MB" });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      setToast({ open: true, type: "error", message: "Failed to read file" });
    };
    reader.onload = (event) => {
      const base64String = event.target?.result;
      if (base64String) {
        // Compress image using canvas
        const img = new Image();
        img.onerror = () => {
          setToast({ open: true, type: "error", message: "Failed to load image" });
        };
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          // Calculate new dimensions (max 1200px)
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          
          if (width > height) {
            if (width > maxDim) {
              height = (height * maxDim) / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = (width * maxDim) / height;
              height = maxDim;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.8 quality
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
          console.log("Original size:", file.size, "Compressed base64 length:", compressedBase64.length);
          setForm((f) => ({ ...f, image: compressedBase64 }));
        };
        img.src = base64String;
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((f) => ({ ...f, image: "" }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setToast({ open: true, type: "error", message: "Please upload a PDF file only." });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setToast({ open: true, type: "error", message: "Resume must be less than 10MB" });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      setToast({ open: true, type: "error", message: "Failed to read resume file" });
    };
    reader.onload = (event) => {
      const base64String = event.target?.result;
      if (base64String) {
        console.log("Resume uploaded - Name:", file.name, "Size:", file.size, "Base64 length:", base64String.length);
        setForm((f) => ({
          ...f,
          resumeFile: base64String,
          resumeFileName: file.name
        }));
        setToast({ open: true, type: "success", message: `Resume uploaded: ${file.name}` });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeResume = () => {
    setForm((f) => ({
      ...f,
      resumeFile: "",
      resumeFileName: ""
    }));
  };

  const onSave = async () => {
    setBusy(true);
    try {
      // Check if image is too large for Firestore (1MB limit per field)
      if (form.image && form.image.length > 900000) {
        setToast({ open: true, type: "error", message: "Image too large. Please use a smaller image." });
        setBusy(false);
        return;
      }

      console.log("Saving profile with image length:", form.image?.length || 0);
      console.log("Saving profile with resume length:", form.resumeFile?.length || 0);
      
      if (form.resumeFile && form.resumeFile.length > 2000000) {
        setToast({ open: true, type: "error", message: "Resume file too large. Please use a smaller file." });
        setBusy(false);
        return;
      }

      await adminUpsertProfile({
        name: form.name,
        role: form.role,
        intro: form.intro,
        image: form.image,
        resumeFile: form.resumeFile,
        resumeFileName: form.resumeFileName,
        ctas: {
          ...fallback.profile.ctas,
          resume: { ...fallback.profile.ctas.resume, href: form.resumeHref }
        },
        social: [
          { label: "GitHub", href: form.github },
          { label: "LinkedIn", href: form.linkedin },
          { label: "Email", href: "mailto:javedkhan1foru@gmail.com" }
        ]
      });

      setToast({ open: true, type: "success", message: "Profile updated!" });
    } catch (err) {
      console.error("Profile save error:", err);
      const errorMsg = err?.message || "Failed to update profile.";
      setToast({ open: true, type: "error", message: errorMsg });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="glass p-6">
      <h2 className="text-xl font-semibold">Profile</h2>
      <p className="text-white/70 text-sm mt-1">This updates the Hero section.</p>

      <div className="mt-5 grid md:grid-cols-2 gap-3">
        {form.image && (
          <div className="md:col-span-2 relative group">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="relative block cursor-pointer group"
            >
              <img src={form.image} alt="Profile" className="w-32 h-32 object-cover rounded-lg" />
              <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Preview</span>
              </div>
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white px-2 py-1 rounded text-xs transition"
              disabled={busy}
            >
              Remove
            </button>
          </div>
        )}
        <div className="md:col-span-2">
          <label className="text-sm text-white/70 mb-2 block">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={busy}
            className="glass px-4 py-3 outline-none w-full"
          />
        </div>
        <input
          className="glass px-4 py-3 outline-none"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Name"
          disabled={busy}
        />
        <input
          className="glass px-4 py-3 outline-none"
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          placeholder="Role"
          disabled={busy}
        />
        <input
          className="glass px-4 py-3 outline-none"
          value={form.github}
          onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
          placeholder="GitHub URL"
          disabled={busy}
        />
        <input
          className="glass px-4 py-3 outline-none"
          value={form.linkedin}
          onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
          placeholder="LinkedIn URL"
          disabled={busy}
        />
        <div className="md:col-span-2">
          <label className="text-sm text-white/70 mb-2 block">Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            disabled={busy}
            className="glass px-4 py-3 outline-none w-full"
          />
          {form.resumeFileName && (
            <div className="mt-2 flex items-center justify-between gap-2 p-3 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
              <span className="text-sm text-white/80 truncate">📄 {form.resumeFileName}</span>
              <button
                type="button"
                onClick={removeResume}
                disabled={busy}
                className="text-xs px-2 py-1 rounded bg-red-500/60 hover:bg-red-500 transition"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        <input
          className="glass px-4 py-3 outline-none md:col-span-2"
          value={form.resumeHref}
          onChange={(e) => setForm((f) => ({ ...f, resumeHref: e.target.value }))}
          placeholder="Resume URL (optional - if you prefer external link)"
          disabled={busy}
        />
        <textarea
          className="glass px-4 py-3 outline-none md:col-span-2 resize-none"
          rows={4}
          value={form.intro}
          onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
          placeholder="Intro"
          disabled={busy}
        />
      </div>

      <div className="mt-5">
        <button
          onClick={onSave}
          disabled={busy}
          className="ripple-btn px-5 py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 transition disabled:opacity-60"
        >
          {busy ? "Saving..." : "Save"}
        </button>
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      {form.image && (
        <Lightbox
          images={[form.image]}
          index={0}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onChangePrev={() => {}}
          onChangeNext={() => {}}
        />
      )}
    </section>
  );
}