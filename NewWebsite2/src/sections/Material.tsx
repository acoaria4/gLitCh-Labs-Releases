import { useEffect, useRef, useState } from "react";
import { GraphiteSurface } from "../webgl/GraphiteSurface";
import { prefersReducedMotion } from "../motion/lenis-gsap";
import "./Material.css";

type Props = {
  onEnter?: () => void;
  onLeave?: () => void;
};

export function Material({ onEnter, onLeave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [velocity, setVelocity] = useState(0);
  const [light, setLight] = useState({ x: 0.55, y: 0.35 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const surface = new GraphiteSurface(canvas, prefersReducedMotion());
    surface.onReadout = (data) => {
      setVelocity(data.velocity);
      setLight({ x: data.lx, y: data.ly });
    };
    return () => surface.dispose();
  }, []);

  return (
    <section
      className="material"
      id="lab"
      aria-labelledby="material-title"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="rail material__layout">
        <header className="material__head">
          <p className="tech-label">MATERIAL / 001</p>
          <h2 id="material-title" className="material__title display">
            GRAPHITE SURFACE
          </h2>
          <p className="body-copy">
            Interaction as material. Move across the plate — light, reflection,
            and depth respond with mass.
          </p>
        </header>

        <div className="material__stage">
          <canvas
            ref={canvasRef}
            className="material__canvas"
            aria-label="Interactive graphite surface"
          />

          <aside className="material__readout" aria-live="polite">
            <div>
              <p className="tech-label">SURFACE</p>
              <p className="material__value">GRAPHITE / 01</p>
            </div>
            <div>
              <p className="tech-label">INPUT</p>
              <p className="material__value">
                POINTER / {velocity.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="tech-label">LIGHT</p>
              <p className="material__value">
                {light.x.toFixed(2)} , {light.y.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="tech-label">RENDER</p>
              <p className="material__value">REALTIME</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
