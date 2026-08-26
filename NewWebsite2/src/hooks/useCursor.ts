import { useEffect, useRef, useState } from "react";

export type CursorMode = "default" | "link" | "project" | "material";

export function useCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.28;
      pos.current.y += (target.current.y - pos.current.y) * 0.28;
      document.documentElement.style.setProperty("--cx", `${pos.current.x}px`);
      document.documentElement.style.setProperty("--cy", `${pos.current.y}px`);
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return { enabled, mode, setMode, label, setLabel };
}
