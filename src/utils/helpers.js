export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function initClarity() {
  const id = import.meta.env.VITE_CLARITY_PROJECT_ID;
  if (!id) return;
  if (document.getElementById("clarity-script")) return;

  const s = document.createElement("script");
  s.id = "clarity-script";
  s.type = "text/javascript";
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${id}`;
  document.head.appendChild(s);
}

export function initHotjar() {
  const hjid = import.meta.env.VITE_HOTJAR_ID;
  if (!hjid) return;
  if (document.getElementById("hotjar-script")) return;

  const s = document.createElement("script");
  s.id = "hotjar-script";
  s.async = true;
  s.innerHTML = `
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${JSON.stringify(Number(hjid))},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `;
  document.head.appendChild(s);
}