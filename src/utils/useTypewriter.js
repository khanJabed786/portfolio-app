import { useEffect, useMemo, useState } from "react";

export default function useTypewriter({
  words,
  typeSpeed = 55,
  deleteSpeed = 32,
  delayBetween = 900
}) {
  const list = useMemo(() => words?.filter(Boolean) ?? [], [words]);
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (!list.length) return;

    const current = list[idx % list.length];
    const next = del ? current.slice(0, Math.max(0, txt.length - 1)) : current.slice(0, txt.length + 1);
    const doneTyping = !del && next === current;
    const doneDeleting = del && next === "";

    const t = setTimeout(() => {
      setTxt(next);

      if (doneTyping) {
        setTimeout(() => setDel(true), delayBetween);
      } else if (doneDeleting) {
        setDel(false);
        setIdx((v) => (v + 1) % list.length);
      }
    }, del ? deleteSpeed : typeSpeed);

    return () => clearTimeout(t);
  }, [txt, del, idx, list, typeSpeed, deleteSpeed, delayBetween]);

  return txt;
}