import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase.js";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, images: [], currentIndex: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const carouselRef = useRef(null);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        // Fetch from publicCertificates collection
        const ref = collection(db, "publicCertificates");
        const q = query(ref, orderBy("createdAt", "desc"), limit(200));
        const snaps = await getDocs(q);
        const certs = snaps.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCertificates(certs);
      } catch (e) {
        console.error("Failed to load certificates:", e.message);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  // Handle window resize to detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll carousel on mobile
  useEffect(() => {
    if (!isMobile || !carouselRef.current || certificates.length < 2) return;

    const container = carouselRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame
    const pauseDuration = 3000; // pause for 3 seconds between scrolls
    let animationId;
    let isPaused = false;

    const scroll = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(scroll);
        return;
      }

      scrollPosition += scrollSpeed;
      container.scrollLeft = scrollPosition;

      // Reset scroll when reaching end
      if (scrollPosition >= container.scrollWidth - container.clientWidth) {
        isPaused = true;
        setTimeout(() => {
          scrollPosition = 0;
          container.scrollLeft = 0;
          isPaused = false;
        }, pauseDuration);
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause on user interaction
    const handleScroll = () => {
      isPaused = true;
      setTimeout(() => {
        isPaused = false;
      }, 2000);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, certificates]);

  // Format date to: "Jan 15, 2024"
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      // Handle different date formats
      let date;
      if (typeof dateString === 'string') {
        // Try parsing the string
        date = new Date(dateString);
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString; // Return original if error
    }
  };

  const openGallery = (images) => {
    if (images && images.length > 0) {
      setModal({ open: true, images, currentIndex: 0 });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  const nextImage = () => {
    setModal((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setModal((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  if (loading) {
    return (
      <section className="min-h-screen py-20 px-6" data-aos="fade-up">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-white/50">Loading certificates...</div>
        </div>
      </section>
    );
  }

  // Always show section, even if empty - for coding competition display
  if (!certificates || certificates.length === 0) {
    return (
      <section id="certificates" className="min-h-screen py-20 px-6 relative overflow-hidden" data-aos="fade-up">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16" data-aos="fade-down">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Certifications & Achievements
              </span>
            </h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto">
              Professional certifications and badges that showcase my expertise and commitment to continuous learning.
            </p>
          </div>

          {/* Empty State */}
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <div className="text-6xl">📜</div>
              <p className="text-white/60 text-lg">No certificates yet. Coming soon!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="min-h-screen py-20 px-6 relative overflow-hidden" data-aos="fade-up">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Certifications & Achievements
            </span>
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Professional certifications and badges that showcase my expertise and commitment to continuous learning.
          </p>
        </div>

        {/* Certificates Grid (Desktop) / Carousel (Mobile) */}
        {isMobile ? (
          // MOBILE CAROUSEL - Auto-scrolling horizontal
          <div className="relative w-full">
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
              {certificates.map((cert, index) => (
                <div
                  key={cert.id || index}
                  className="flex-shrink-0 w-72 glass group p-4 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 h-full flex flex-col"
                >
                  {/* Image */}
                  {cert.images && cert.images.length > 0 ? (
                    <button
                      onClick={() => openGallery(cert.images)}
                      className="mb-3 overflow-hidden rounded-xl aspect-square bg-white/5 flex-shrink-0 cursor-pointer group/img"
                      title="Click to view full image"
                    >
                      <img
                        src={cert.images[0]}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EImage Error%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {cert.images.length > 1 && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center text-white text-sm font-semibold">
                          +{cert.images.length - 1} more image{cert.images.length - 1 === 1 ? '' : 's'}
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="mb-3 aspect-square bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-white/40 text-3xl">
                      📜
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-2 flex-1 flex flex-col">
                    <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-1">{cert.issuer}</p>

                    {/* Dates - FORMATTED */}
                    <div className="text-xs text-white/50 space-y-1 pt-2">
                      {cert.issueDate && (
                        <div>
                          <span className="text-white/60 font-medium">Issued:</span> {formatDate(cert.issueDate)}
                        </div>
                      )}
                      {cert.expiryDate && (
                        <div>
                          <span className="text-white/60 font-medium">Expires:</span> {formatDate(cert.expiryDate)}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {cert.description && (
                      <p className="text-xs text-white/60 pt-2 line-clamp-2 flex-1">{cert.description}</p>
                    )}

                    {/* Credential Link */}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                      >
                        View Credential →
                      </a>
                    )}
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition">
                    ⭐
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // DESKTOP GRID
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {certificates.map((cert, index) => (
              <div
                key={cert.id || index}
                className="glass group p-4 sm:p-5 lg:p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image */}
                {cert.images && cert.images.length > 0 ? (
                  <button
                    onClick={() => openGallery(cert.images)}
                    className="mb-3 sm:mb-4 overflow-hidden rounded-xl aspect-square bg-white/5 flex-shrink-0 cursor-pointer group/img"
                    title="Click to view full image"
                  >
                    <img
                      src={cert.images[0]}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EImage Error%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {cert.images.length > 1 && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center text-white text-sm font-semibold">
                        +{cert.images.length - 1} more image{cert.images.length - 1 === 1 ? '' : 's'}
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="mb-3 sm:mb-4 aspect-square bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-white/40">
                    📜
                  </div>
                )}

                {/* Content */}
                <div className="space-y-2 flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-amber-300 transition line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 line-clamp-1">{cert.issuer}</p>

                  {/* Dates - FORMATTED */}
                  <div className="text-xs text-white/50 space-y-1 pt-2">
                    {cert.issueDate && (
                      <div>
                        <span className="text-white/60 font-medium">Issued:</span> {formatDate(cert.issueDate)}
                      </div>
                    )}
                    {cert.expiryDate && (
                      <div>
                        <span className="text-white/60 font-medium">Expires:</span> {formatDate(cert.expiryDate)}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {cert.description && (
                    <p className="text-xs text-white/60 pt-2 line-clamp-2 flex-1">{cert.description}</p>
                  )}

                  {/* Credential Link */}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                    >
                      View Credential →
                    </a>
                  )}
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition">
                  ⭐
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {modal.open && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gray-300 transition z-10"
              title="Close"
            >
              ✕
            </button>

            {/* Image Container */}
            <div className="bg-black rounded-xl overflow-hidden aspect-square sm:aspect-auto max-h-[80vh]">
              <img
                src={modal.images[modal.currentIndex]}
                alt={`Certificate ${modal.currentIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Navigation */}
            {modal.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-lg transition"
                  title="Previous"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-lg transition"
                  title="Next"
                >
                  ▶
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {modal.currentIndex + 1} / {modal.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
