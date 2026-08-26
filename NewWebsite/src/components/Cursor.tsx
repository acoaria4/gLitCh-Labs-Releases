import { useEffect, useRef, useState } from "react";
import type { CursorMode } from "../hooks/useCursor";
import "./Cursor.css";

type Props = {
  mode: CursorMode;
  label: string;
};

export function Cursor({ mode, label }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    // 1:1 with OS pointer — no lerp lag
    const onMove = (e: PointerEvent) => {
      if (!el.current) return;
      el.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={el}
      className={`cursor cursor--${mode}`}
      aria-hidden="true"
    >
      <span className="cursor__dot" />
      <span className="cursor__ring" />
      {label ? <span className="cursor__label">{label}</span> : null}
    </div>
  );
}
