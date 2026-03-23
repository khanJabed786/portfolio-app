import React, { useEffect, useState, useRef } from "react";
import Toast from "../../../components/common/Toast.jsx";
import {
  adminGetCertificates,
  adminAddCertificate,
  adminUpdateCertificate,
  adminDeleteCertificate,
} from "../../../config/adminFirestore.js";

// Helper function - OUTSIDE component so it's always available
const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export default function CertificatesTab() {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [certificates, setCertificates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    issueDate: getCurrentMonth(),
    expiryDate: "",
    credentialUrl: "",
    description: "",
    images: [],
    imageFiles: [],
  });
  const [carouselIndex, setCarouselIndex] = useState({});
  const intervalsRef = useRef({});

  const loadCertificates = async () => {
    setBusy(true);
    try {
      const certs = await adminGetCertificates();
      setCertificates(certs);
    } catch (e) {
      console.error("Error loading certificates:", e);
      setToast({ open: true, type: "error", message: `Failed to load certificates: ${e.message}` });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    // Clear old intervals
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};

    // Set up intervals for certificates with multiple images
    certificates.forEach((cert) => {
      if (cert.images && cert.images.length > 1) {
        intervalsRef.current[cert.id] = setInterval(() => {
          setCarouselIndex((prev) => ({
            ...prev,
            [cert.id]: ((prev[cert.id] || 0) + 1) % cert.images.length,
          }));
        }, 4000);
      }
    });

    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, [certificates]);

  const resetForm = () => {
    setForm({
      title: "",
      issuer: "",
      issueDate: getCurrentMonth(),
      expiryDate: "",
      credentialUrl: "",
      description: "",
      images: [],
      imageFiles: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleImageSelect = (e) => {
    const files = e.target.files;
    if (!files) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, dataUrl],
          imageFiles: [...prev.imageFiles, file.name],
        }));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.issuer || !form.issueDate) {
      setToast({ open: true, type: "error", message: "Please fill Title, Issuer, and Issue Date (all required *)" });
      return;
    }

    setBusy(true);
    try {
      const dataToSave = {
        title: form.title,
        issuer: form.issuer,
        issueDate: form.issueDate,
        expiryDate: form.expiryDate,
        credentialUrl: form.credentialUrl,
        description: form.description,
        images: form.images,
      };

      if (editingId) {
        await adminUpdateCertificate(editingId, dataToSave);
        setToast({ open: true, type: "success", message: "✅ Certificate updated!" });
      } else {
        await adminAddCertificate(dataToSave);
        setToast({ open: true, type: "success", message: "✅ Certificate added successfully!" });
      }
      
      resetForm();
      await loadCertificates();
    } catch (e) {
      console.error("Certificate error:", e);
      let errorMsg = e.message || "Failed to save certificate";
      if (e.code === "permission-denied") {
        errorMsg = "Permission denied. Check Firestore rules for publicCertificates collection.";
      }
      setToast({ open: true, type: "error", message: `❌ ${errorMsg}` });
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (cert) => {
    setForm({
      title: cert.title || "",
      issuer: cert.issuer || "",
      issueDate: cert.issueDate || "",
      expiryDate: cert.expiryDate || "",
      credentialUrl: cert.credentialUrl || "",
      description: cert.description || "",
      images: cert.images || [],
      imageFiles: cert.imageFiles || [],
    });
    setEditingId(cert.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    setBusy(true);
    try {
      // Delete certificate from Firestore
      await adminDeleteCertificate(id);
      setToast({ open: true, type: "success", message: "Certificate deleted." });
      await loadCertificates();
    } catch (e) {
      console.error(e);
      setToast({ open: true, type: "error", message: "Failed to delete." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Certificates & Badges
        </h2>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:brightness-110 transition"
        >
          {showForm ? "Cancel" : "+ Add Certificate"}
        </button>
      </div>

      {showForm && (
        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Certificate" : "Add New Certificate"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-white/70">Title *</label>
                <input
                  type="text"
                  placeholder="e.g., AWS Solutions Architect"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Issuer */}
              <div>
                <label className="text-sm font-medium text-white/70">Issuer *</label>
                <input
                  type="text"
                  placeholder="e.g., Amazon Web Services"
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/70">Issue Date *</label>
                <input
                  type="month"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/70">Expiry Date</label>
                <input
                  type="month"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-white/70">Credential URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.credentialUrl}
                  onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-white/70">Description (optional)</label>
                <textarea
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-white/70">Certificate Images (optional)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white file:text-white file:bg-amber-600 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer hover:file:bg-amber-700"
                />
                <p className="text-xs text-white/50 mt-1">You can upload multiple images. They will be displayed as a carousel.</p>
              </div>

              {/* Image Preview Grid */}
              {form.images.length > 0 && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-white/70 block mb-2">Selected Images ({form.images.length})</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img} 
                          alt={`preview-${idx}`}
                          className="w-full h-24 object-cover rounded-lg border border-white/10"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={busy}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:brightness-110 transition disabled:opacity-50"
              >
                {busy ? "Saving..." : editingId ? "Update" : "Add"} Certificate
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Certificates List */}
      <div className="space-y-3">
        {certificates.length > 0 ? (
          certificates.map((cert) => {
            return (
              <div key={cert.id} className="glass p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition">
                <div className="flex gap-4 items-start justify-between">
                  {/* Details */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{cert.title}</h4>
                    <div className="text-sm text-white/60 mt-1">{cert.issuer}</div>
                    <div className="text-xs text-white/50 mt-1">
                      📅 Issued: {cert.issueDate}
                      {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                    </div>
                    {cert.description && <div className="text-sm text-white/70 mt-2">{cert.description}</div>}
                    {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-amber-400 hover:text-amber-300 mt-2 inline-block"
                          >
                            View Credential →
                          </a>
                        )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="px-3 py-1 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="px-3 py-1 rounded-lg border border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-500/60 transition text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass p-8 rounded-xl border border-white/10 text-center">
            <div className="text-white/50">No certificates yet. Add your first one!</div>
          </div>
        )}
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </section>
  );
}
