import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase.js";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Failed to load certificates:", e);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen py-20 px-6" data-aos="fade-up">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-white/50">Loading certificates...</div>
        </div>
      </section>
    );
  }

  if (!certificates || certificates.length === 0) {
    return null;
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

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="glass group p-4 sm:p-5 lg:p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full flex flex-col"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Image */}
              {cert.images && cert.images.length > 0 && (
                <div className="mb-3 sm:mb-4 overflow-hidden rounded-xl aspect-square bg-white/5 flex-shrink-0">
                  <img
                    src={cert.images[0]}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {cert.images.length > 1 && (
                    <div className="text-xs text-white/40 text-center py-1">
                      +{cert.images.length - 1} more {cert.images.length - 1 === 1 ? 'image' : 'images'}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="space-y-2 flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-amber-300 transition line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 line-clamp-1">{cert.issuer}</p>

                {/* Dates */}
                <div className="text-xs text-white/50 space-y-1 pt-2">
                  {cert.issueDate && (
                    <div>
                      <span className="text-white/60">Issued:</span> {cert.issueDate}
                    </div>
                  )}
                  {cert.expiryDate && (
                    <div>
                      <span className="text-white/60">Expires:</span> {cert.expiryDate}
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
    </section>
  );
}
