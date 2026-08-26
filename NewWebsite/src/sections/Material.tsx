import { useEffect, useRef, useState } from "react";
import { MaterialSurface } from "../webgl/MaterialSurface";
import { prefersReducedMotion } from "../motion/lenis-gsap";
import { useCursor } from "../hooks/useCursor";
import { SectionFrame } from "../components/SectionFrame";
import "./Material.css";

export function Material() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCursor } = useCursor();
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = prefersReducedMotion();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    let surface: MaterialSurface | null = null;

    try {
      surface = new MaterialSurface(
        { canvas, reducedMotion: reduce, isMobile },
        ({ velocity: v }) => setVelocity(v),
      );
    } catch {
      canvas.style.display = "none";
    }

    return () => surface?.dispose();
  }, []);

  return (
    <SectionFrame number="005 / MATERIAL" label="PLAYGROUND">
      <div className="material container">
        <header className="material__header">
          <h2 className="display display--sm">MATERIAL / 001</h2>
          <p className="lede">
            Interaction as a physical substance — light, grain, and mass under
            the pointer.
          </p>
        </header>

        <div
          className="material__stage edge-highlight"
          data-cursor="material"
          onMouseEnter={() => setCursor("material")}
          onMouseLeave={() => setCursor("default")}
        >
          <div className="corner-marks" aria-hidden="true">
            <span />
          </div>
          <canvas ref={canvasRef} className="material__canvas" />
          <div className="material__fallback material-surface--matte" />
        </div>

        <dl className="material__readout">
          <div>
            <dt className="meta meta--dim">SURFACE</dt>
            <dd className="meta">GRAPHITE / 01</dd>
          </div>
          <div>
            <dt className="meta meta--dim">INPUT</dt>
            <dd className="meta">
              POINTER / VELOCITY {(velocity * 100).toFixed(0).padStart(3, "0")}
            </dd>
          </div>
          <div>
            <dt className="meta meta--dim">RENDER</dt>
            <dd className="meta">WEBGL / REALTIME</dd>
          </div>
        </dl>
      </div>
    </SectionFrame>
  );
}
