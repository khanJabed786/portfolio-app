import React, { useEffect, useState } from "react";
import Toast from "../../../components/common/Toast.jsx";
import Lightbox from "../../../components/common/Lightbox.jsx";
import { adminAddProject, adminDeleteProject, adminListProjects, adminUpdateProject } from "../../../config/adminFirestore.js";

export default function ProjectsTab() {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [items, setItems] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploadCarouselIdx, setUploadCarouselIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [projectCarousels, setProjectCarousels] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    tech: "React, Tailwind",
    tags: "React, UI/UX",
    github: "",
    live: "",
    video: "",
    images: [], // Store as array directly, NOT comma-separated string
    caseStudy: {
      problem: "",
      solution: "",
      result: ""
    }
  });

  const load = async () => {
    setBusy(true);
    try {
      const data = await adminListProjects();
      // Ensure images are always arrays (already normalized in Firebase utils)
      const normalizedData = data.map((project) => {
        const imagesArray = Array.isArray(project.images)
          ? project.images.filter(Boolean)
          : project.images
          ? [project.images]
          : [];
        

        
        return {
          ...project,
          images: imagesArray
        };
      });
      setItems(normalizedData);
    } catch (e) {
      setToast({ open: true, type: "error", message: "Failed to load projects." });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Auto-play carousel for uploaded images
  useEffect(() => {
    if (uploadedImages.length <= 1) return;
    const interval = setInterval(() => {
      setUploadCarouselIdx((prev) => (prev + 1) % uploadedImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [uploadedImages.length]);

  // Auto-play carousels for each project
  useEffect(() => {
    const projectsWithMultipleImages = items.filter((p) => (Array.isArray(p.images) ? p.images.length > 1 : false));
    
    const intervals = projectsWithMultipleImages.map((p) => {
      return setInterval(() => {
        setProjectCarousels((prev) => {
          const newIdx = ((prev[p.id] ?? 0) + 1) % (Array.isArray(p.images) ? p.images.length : 1);
          return {
            ...prev,
            [p.id]: newIdx
          };
        });
      }, 4000);
    });
    
    return () => {
      intervals.forEach((i) => clearInterval(i));
    };
  }, [items]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    
    let successCount = 0;
    let errorCount = 0;
    
    files.forEach((file, fileIndex) => {
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setToast({ open: true, type: "error", message: `Image ${file.name} is too large (max 5MB)` });
        errorCount++;
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const base64String = event.target?.result;
          if (!base64String) {
            throw new Error("No data from FileReader");
          }
          
          // Compress image using canvas
          const img = new Image();
          let loadTimeout;
          
          img.onerror = (err) => {
            clearTimeout(loadTimeout);
            setToast({ open: true, type: "error", message: `Failed to load image ${file.name}` });
            errorCount++;
          };
          
          img.onload = () => {
            try {
              clearTimeout(loadTimeout);
              
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              
              if (!ctx) {
                throw new Error("Canvas context failed");
              }
              
              // Calculate new dimensions (max 800px)
              let width = img.width;
              let height = img.height;
              const maxDim = 800;
              
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
              
              // Compress to JPEG with 0.75 quality
              const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
              
              // Validate base64 format
              if (!compressedBase64 || !compressedBase64.startsWith("data:image/jpeg;base64,")) {
                throw new Error("Invalid base64 format generated");
              }
              
              // Extract just the base64 part to validate it
              const base64Part = compressedBase64.substring("data:image/jpeg;base64,".length);
              if (!base64Part || base64Part.length === 0) {
                throw new Error("Base64 data is empty");
              }
              
              // Validate the base64 format
              if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Part)) {
                throw new Error("Base64 contains invalid characters");
              }
              
              // Create a test image to verify the data URL is valid
              const testImg = new Image();
              let testTimeout;
              
              testImg.onload = () => {
                clearTimeout(testTimeout);
                
                // Add ONLY to uploadedImages
                setUploadedImages((prev) => {
                  const updated = [...prev, compressedBase64];
                  return updated;
                });
                
                successCount++;
              };
              
              testImg.onerror = (err) => {
                clearTimeout(testTimeout);
                throw new Error("Generated base64 data URL is invalid");
              };
              
              testTimeout = setTimeout(() => {
                throw new Error("Base64 test image timeout");
              }, 3000);
              
              testImg.src = compressedBase64;
              
            } catch (err) {
              setToast({ open: true, type: "error", message: `Failed to process image ${file.name}: ${err.message}` });
              errorCount++;
            }
          };
          
          // Timeout if image takes too long
          loadTimeout = setTimeout(() => {
            setToast({ open: true, type: "error", message: `Image load timeout: ${file.name}` });
            errorCount++;
          }, 5000);
          
          img.src = base64String;
          
        } catch (err) {
          setToast({ open: true, type: "error", message: `Error reading file: ${file.name}` });
          errorCount++;
        }
      };
      
      reader.onerror = (err) => {
        setToast({ open: true, type: "error", message: `Failed to read file ${file.name}` });
        errorCount++;
      };
      
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    
    // Update form images as array
    setForm((f) => {
      const updatedImages = Array.isArray(f.images) 
        ? f.images.filter((_, i) => i !== index)
        : [];
      return { ...f, images: updatedImages };
    });
    
    // Adjust carousel index if needed
    if (newImages.length === 0) {
      setUploadCarouselIdx(0);
    } else if (uploadCarouselIdx >= newImages.length) {
      setUploadCarouselIdx(newImages.length - 1);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      tech: "React, Tailwind",
      tags: "React, UI/UX",
      github: "",
      live: "",
      video: "",
      images: [], // Array, not string
      caseStudy: {
        problem: "",
        solution: "",
        result: ""
      }
    });
    setUploadedImages([]);
    setUploadCarouselIdx(0); // RESET carousel index
    setEditingId(null);
  };

  const onEdit = (project) => {
    setEditingId(project.id);
    
    // Ensure images is an array for proper handling
    const imagesArray = Array.isArray(project.images)
      ? project.images
      : project.images
      ? [project.images]
      : [];

    setForm({
      title: project.title,
      description: project.description,
      tech: Array.isArray(project.tech) ? project.tech.join(", ") : project.tech,
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags,
      github: project.github || "",
      live: project.live || "",
      video: project.video || "",
      images: [], // Don't store in form - use uploadedImages only
      caseStudy: project.caseStudy || {
        problem: "",
        solution: "",
        result: ""
      }
    });
    
    // Set uploadedImages as our single source of truth
    setUploadedImages(imagesArray);
    setUploadCarouselIdx(0);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setToast({ open: true, type: "error", message: "Title is required." });
      return;
    }

    // Validate images before saving
    if (uploadedImages.length === 0) {
      setToast({ open: true, type: "warning", message: "No images uploaded" });
    }

    setBusy(true);
    try {
      // Use uploadedImages as source of truth (not form.images)
      const imagesArray = uploadedImages.filter(Boolean);
      
      // Validate each image
      let validImages = 0;
      imagesArray.forEach((img, idx) => {
        if (img && img.startsWith("data:image")) {
          validImages++;
        }
      });
      
      if (validImages !== imagesArray.length) {
        throw new Error(`${imagesArray.length - validImages} image(s) have invalid data format`);
      }

      const projectData = {
        title: form.title.trim(),
        description: form.description.trim(),
        tech: form.tech.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        github: form.github.trim(),
        live: form.live.trim(),
        video: form.video.trim(),
        images: imagesArray, // Array directly
        caseStudy: {
          problem: form.caseStudy.problem.trim(),
          solution: form.caseStudy.solution.trim(),
          result: form.caseStudy.result.trim()
        }
      };

      // Calculate total document size
      const docSize = JSON.stringify(projectData).length;
      if (docSize > 1000000) {
        setToast({ open: true, type: "error", message: "Images too large! Please use fewer/smaller images." });
        setBusy(false);
        return;
      }

      if (editingId) {
        await adminUpdateProject(editingId, projectData);
        setToast({ open: true, type: "success", message: "Project updated!" });
      } else {
        await adminAddProject(projectData);
        setToast({ open: true, type: "success", message: "Project added!" });
      }

      resetForm();
      await load();
    } catch (err) {
      setToast({ open: true, type: "error", message: err.message || (editingId ? "Failed to update project." : "Failed to add project.") });
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    setBusy(true);
    try {
      await adminDeleteProject(id);
      setToast({ open: true, type: "success", message: "Deleted." });
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      setToast({ open: true, type: "error", message: "Delete failed." });
    } finally {
      setBusy(false);
    }
  };

  const openImageViewer = (images) => {
    if (!images || images.length === 0) return;
    const imgArray = Array.isArray(images) ? images : [images];
    setLightboxImages(imgArray);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
    setLightboxIndex(0);
  };

  // Auto-play lightbox when open
  useEffect(() => {
    if (!lightboxOpen || !lightboxImages || lightboxImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
    }, 4000);
    
    return () => {
      clearInterval(interval);
    };
  }, [lightboxOpen, lightboxImages]);

  return (
    <section className="grid lg:grid-cols-2 gap-4">
      <div className="glass p-6 overflow-y-auto max-h-96">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold">{editingId ? "Edit Project" : "Add Project"}</h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="px-3 py-1 text-sm rounded-lg bg-gray-500/50 hover:bg-gray-500 transition"
            >
              New
            </button>
          )}
        </div>

        <form onSubmit={onSubmit} className="grid gap-3">
          <input className="glass px-4 py-3 outline-none" placeholder="Title"
            value={form.title} disabled={busy}
            onChange={(e)=>setForm(f=>({...f,title:e.target.value}))}/>
          <textarea className="glass px-4 py-3 outline-none resize-none" rows={3} placeholder="Description"
            value={form.description} disabled={busy}
            onChange={(e)=>setForm(f=>({...f,description:e.target.value}))}/>
          <input className="glass px-4 py-3 outline-none text-xs" placeholder="Tech (comma separated)"
            value={form.tech} disabled={busy}
            onChange={(e)=>setForm(f=>({...f,tech:e.target.value}))}/>
          <input className="glass px-4 py-3 outline-none text-xs" placeholder="Tags (comma separated)"
            value={form.tags} disabled={busy}
            onChange={(e)=>setForm(f=>({...f,tags:e.target.value}))}/>
          <input className="glass px-4 py-3 outline-none text-xs" placeholder="GitHub link"
            value={form.github} disabled={busy}
            onChange={(e)=>setForm(f=>({...f,github:e.target.value}))}/>
          <input className="glass px-4 py-3 outline-none text-xs" placeholder="Live demo link"
            value={form.live} disabled={busy}
            onChange={(e)=>setForm(f=>({...f,live:e.target.value}))}/>
          <input className="glass px-4 py-3 outline-none text-xs" placeholder="YouTube embed link (optional)"
            value={form.video} disabled={busy}
            onChange={(e)=>setForm(f=>({...f,video:e.target.value}))}/>

          <div className="border-t border-white/10 pt-3 mt-3">
            <label className="text-xs text-white/70 mb-2 block font-semibold">📋 Case Study</label>
            <textarea className="glass px-4 py-3 outline-none resize-none w-full text-xs" rows={2} placeholder="Problem"
              value={form.caseStudy.problem} disabled={busy}
              onChange={(e)=>setForm(f=>({...f,caseStudy:{...f.caseStudy,problem:e.target.value}}))}/>
            <textarea className="glass px-4 py-3 outline-none resize-none w-full text-xs mt-2" rows={2} placeholder="Solution"
              value={form.caseStudy.solution} disabled={busy}
              onChange={(e)=>setForm(f=>({...f,caseStudy:{...f.caseStudy,solution:e.target.value}}))}/>
            <textarea className="glass px-4 py-3 outline-none resize-none w-full text-xs mt-2" rows={2} placeholder="Result"
              value={form.caseStudy.result} disabled={busy}
              onChange={(e)=>setForm(f=>({...f,caseStudy:{...f.caseStudy,result:e.target.value}}))}/>
          </div>

          <div>
            <label className="text-xs text-white/70 mb-2 block">Upload Images (PNG/JPG)</label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleImageUpload}
              disabled={busy}
              className="glass px-4 py-3 outline-none w-full text-xs"
            />
          </div>

          {uploadedImages.length > 0 && (
            <div>
              <p className="text-xs text-white/70 mb-2">Uploaded Images ({uploadedImages.length})</p>
              {uploadedImages.length === 1 ? (
                <div className="relative group mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      openImageViewer(uploadedImages);
                    }}
                    className="w-full h-40 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer border border-white/10 bg-gray-900"
                  >
                    {uploadedImages[0] && uploadedImages[0].startsWith("data:image") ? (
                      <img 
                        key={`preview-0-${uploadedImages[0]?.substring(0, 20)}`}
                        src={uploadedImages[0]} 
                        alt="Upload"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onLoad={() => {}}
                        onError={(e) => {
                          const img = e.target;
                          img.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        Invalid image data
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(0)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition font-semibold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      openImageViewer(uploadedImages);
                    }}
                    className="w-full h-40 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer border border-white/10 bg-gray-900 flex items-center justify-center"
                  >
                    {uploadedImages[uploadCarouselIdx] && uploadedImages[uploadCarouselIdx].startsWith("data:image") ? (
                      <img 
                        key={`carousel-${uploadCarouselIdx}-${uploadedImages[uploadCarouselIdx]?.substring(0, 20)}`}
                        src={uploadedImages[uploadCarouselIdx]} 
                        alt={`Upload ${uploadCarouselIdx}`}
                        className="w-full h-full object-cover"
                        onLoad={() => {}}
                        onError={(e) => {
                          const img = e.target;
                        }}
                      />
                    ) : (
                      <div className="text-white/50 text-center">
                        <div>No valid image</div>
                        <div className="text-xs">{uploadedImages[uploadCarouselIdx]?.substring(0, 30)}...</div>
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(uploadCarouselIdx)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-600 transition shadow-lg"
                  >
                    ✕ Remove
                  </button>
                  <div className="absolute bottom-2 left-0 right-0 flex gap-1 justify-center">
                    {uploadedImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUploadCarouselIdx(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition cursor-pointer hover:opacity-100 ${
                          idx === uploadCarouselIdx ? "bg-white" : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-semibold">
                    {uploadCarouselIdx + 1}/{uploadedImages.length}
                  </span>
                </div>
              )}
            </div>
          )}

          <button className="ripple-btn px-5 py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 transition disabled:opacity-60 text-sm" disabled={busy}>
            {busy ? "Working..." : editingId ? "Update Project" : "Add Project"}
          </button>
        </form>
      </div>

      <div className="glass p-6 overflow-y-auto max-h-96">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold">Projects ({items.length})</h2>
          <button
            onClick={load}
            className="px-3 py-1 text-sm rounded-lg border border-white/15 hover:bg-white/10 transition"
            disabled={busy}
          >
            Refresh
          </button>
        </div>

        <div className="grid gap-3">
          {items.map((p) => {
            const images = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
            const currentIdx = projectCarousels[p.id] ?? 0;
            const displayImg = images[currentIdx] || null;
            return (
            <div key={p.id} className="glass p-3 rounded-lg">
              <div className="flex gap-3">
                <div className="relative group flex-shrink-0 overflow-hidden rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      if (images.length > 0) openImageViewer(images);
                    }}
                    className="w-16 h-16 hover:opacity-80 transition cursor-pointer flex items-center justify-center bg-gray-600"
                  >
                    {displayImg ? (
                      <img 
                        key={`${p.id}-${currentIdx}-${displayImg?.substring(0, 20)}`}
                        src={displayImg} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        onLoad={() => {}}
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    {!displayImg && (
                      <span className="text-white/70 text-xs">📸</span>
                    )}
                  </button>
                  {images.length > 1 && (
                    <div className="absolute bottom-1 left-0 right-0 flex gap-0.5 justify-center px-1">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProjectCarousels((prev) => ({ ...prev, [p.id]: idx }))}
                          className={`w-1.5 h-1.5 rounded-full transition cursor-pointer hover:opacity-100 ${
                            idx === currentIdx ? "bg-white" : "bg-white/50 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {images.length > 1 && (
                    <div className="absolute top-0.5 right-0.5 bg-black/70 text-white text-xs px-1 py-0.5 rounded font-semibold">
                      {currentIdx + 1}/{images.length}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm line-clamp-1">{p.title}</div>
                  <div className="text-white/60 text-xs mt-1 line-clamp-1 break-words">{p.description}</div>
                  <div className="text-white/50 text-xs mt-1 flex items-center gap-2">
                    <span>{images.length ? `📸 ${images.length}` : "📸 0"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-2 py-1 text-xs rounded bg-blue-500/60 hover:bg-blue-500 transition"
                    disabled={busy}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="px-2 py-1 text-xs rounded bg-red-500/60 hover:bg-red-500 transition"
                    disabled={busy}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            );
          })}
          {!items.length && <div className="text-white/70 text-sm">No projects yet.</div>}
        </div>
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          images={lightboxImages}
          index={lightboxIndex}
          onClose={handleLightboxClose}
          onNext={handleLightboxNext}
          onPrev={handleLightboxPrev}
        />
      )}
    </section>
  );
}