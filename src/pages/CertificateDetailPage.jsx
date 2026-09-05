import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

export default function CertificateDetailPage() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getDoc(doc(db, "publicCertificates", id))
      .then((snapshot) => {
        if (mounted && snapshot.exists()) {
          setCertificate({ id: snapshot.id, ...snapshot.data() });
        }
      })
      .catch((error) => console.error("Failed to load certificate:", error))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;

  if (!certificate) {
    return (
      <main className="min-h-screen px-6 pb-20 pt-32">
        <div className="glass mx-auto max-w-3xl rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Certificate not found</h1>
          <Link to="/#certificates" className="mt-6 inline-block text-amber-400 hover:text-amber-300">
            Back to certificates
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-20 pt-28 sm:px-6">
      <article className="glass mx-auto max-w-4xl rounded-3xl border border-amber-500/20 p-5 sm:p-8">
        <Link to="/#certificates" className="text-sm text-amber-400 hover:text-amber-300">
          Back to certificates
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {certificate.images?.length ? (
              <img
                src={certificate.images[0]}
                alt={certificate.title}
                className="max-h-[520px] w-full object-contain"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center text-7xl text-white/30">📜</div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">Certificate</p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{certificate.title}</h1>
            <p className="mt-4 text-lg text-white/75">{certificate.issuer}</p>

            <div className="mt-6 space-y-2 text-sm text-white/60">
              {certificate.issueDate && <p><strong className="text-white/80">Issued:</strong> {certificate.issueDate}</p>}
              {certificate.expiryDate && <p><strong className="text-white/80">Expires:</strong> {certificate.expiryDate}</p>}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h2 className="text-lg font-semibold text-white">Description</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-8 text-white/75">{certificate.description || "No description provided."}</p>
            </div>

            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex rounded-xl bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                View Credential ↗
              </a>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}