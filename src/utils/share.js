export async function shareLink({ title, text, url }) {
  const payload = { title, text, url };

  if (navigator.share) {
    try {
      await navigator.share(payload);
      return { ok: true, via: "native" };
    } catch {
      // user cancelled or unsupported
    }
  }

  // fallback: open a small share modal approach handled by caller
  return { ok: false, via: "fallback" };
}

export function whatsappShareUrl(url, text = "") {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return `https://wa.me/?text=${t}%20${u}`;
}

export function linkedInShareUrl(url) {
  const u = encodeURIComponent(url);
  return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
}