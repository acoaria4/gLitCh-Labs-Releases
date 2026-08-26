import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../motion/lenis-gsap";
import "./Hero.css";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let field: { dispose: () => void } | null = null;

    const reduce = prefersReducedMotion();
    void import("../webgl/ArtifactField").then(({ ArtifactField }) => {
      if (disposed || !canvasRef.current) return;
      field = new ArtifactField(canvasRef.current, reduce);
    });

    return () => {
      disposed = true;
      field?.dispose();
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const lines = stage.querySelectorAll<HTMLElement>(".hero__line-inner");

      if (reduce) {
        gsap.set(
          [".hero__veil", ".hero__canvas", ".hero__meta", ".hero__support", lines],
          { opacity: 1, y: 0, yPercent: 0, clearProps: "filter" },
        );
        return;
      }

      gsap.set(lines, { yPercent: 110, opacity: 0 });
      gsap.set(".hero__support", { opacity: 0, y: 16 });
      gsap.set(".hero__meta", { opacity: 0, y: 12 });
      gsap.set(".hero__canvas", { opacity: 0, scale: 0.97, filter: "blur(10px)" });
      gsap.set(".hero__veil", { opacity: 1 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".hero__veil", { opacity: 0, duration: 1.45, delay: 0.1 })
        .to(
          ".hero__canvas",
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.35 },
          0.25,
        )
        .to(lines, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.55)
        .to(".hero__meta", { opacity: 1, y: 0, duration: 0.75 }, 1.1)
        .to(".hero__support", { opacity: 1, y: 0, duration: 0.8 }, 1.25);
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero matte-field" id="top" ref={stageRef}>
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__canvas-wrap" aria-hidden="true">
        <canvas ref={canvasRef} className="hero__canvas" />
      </div>

      <div className="hero__content rail">
        <p className="hero__meta tech-label">
          <span>GLITCH LABS / 001</span>
          <span>INTERACTION / REALTIME</span>
        </p>

        <h1 className="hero__statement display">
          <span className="sr-only">WE BUILD THINGS THAT SHOULD EXIST.</span>
          <span className="hero__line" aria-hidden="true">
            <span className="hero__line-inner">WE BUILD THINGS</span>
          </span>
          <span className="hero__line" aria-hidden="true">
            <span className="hero__line-inner">THAT SHOULD EXIST.</span>
          </span>
        </h1>

        <p className="hero__support body-copy">
          An experimental technology and product studio engineering digital
          objects with precision, materiality, and restraint.
        </p>
      </div>

      <div className="hero__scroll tech-label" aria-hidden="true">
        <span>SCROLL</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
