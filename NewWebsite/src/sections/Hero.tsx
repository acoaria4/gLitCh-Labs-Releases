import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../motion/lenis-gsap";
import { HeroField } from "../webgl/HeroField";
import "./Hero.css";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const fieldRef = useRef<HeroField | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const rootEl = root.current;
    if (!canvas || !rootEl) return;

    const reduce = prefersReducedMotion();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    let field: HeroField | null = null;

    try {
      field = new HeroField({ canvas, reducedMotion: reduce, isMobile });
      fieldRef.current = field;
    } catch {
      canvas.style.display = "none";
    }

    const lastY = { y: window.scrollY };
    const onScroll = () => {
      const dy = window.scrollY - lastY.y;
      lastY.y = window.scrollY;
      field?.setScrollVelocity(dy * 0.02);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const ctx = gsap.context(() => {
      if (reduce) return;

      const words = titleRef.current?.querySelectorAll(".hero__word-inner");
      gsap.fromTo(
        words ?? [],
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.35,
          stagger: 0.08,
          ease: "power4.out",
          delay: 0.15,
        },
      );

      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.85, ease: "power3.out" },
      );

      gsap.fromTo(
        ".hero__meta-item",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, delay: 1.0 },
      );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        })
        .to(
          titleRef.current,
          {
            yPercent: -28,
            opacity: 0.15,
            filter: "blur(8px)",
            ease: "none",
          },
          0,
        )
        .to(
          subRef.current,
          { yPercent: -40, opacity: 0, ease: "none" },
          0,
        )
        .to(".hero__canvas-wrap", { yPercent: 18, scale: 1.06, ease: "none" }, 0);
    }, rootEl);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ctx.revert();
      field?.dispose();
      fieldRef.current = null;
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === rootEl)
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero__canvas-wrap material-surface" aria-hidden="true">
        <canvas ref={canvasRef} className="hero__canvas" />
        <div className="hero__poster" />
      </div>

      <div className="hero__content container">
        <div className="hero__meta">
          <span className="hero__meta-item meta">
            <span className="status-dot" />
            LAB / ONLINE
          </span>
          <span className="hero__meta-item meta meta--dim">BUILD / 2026</span>
        </div>

        <h1
          className="hero__title display display--xxl"
          ref={titleRef}
          aria-label="We build things that should exist."
        >
          <span className="hero__line">
            <span className="hero__word">
              <span className="hero__word-inner">WE</span>
            </span>
            <span className="hero__word">
              <span className="hero__word-inner">BUILD</span>
            </span>
            <span className="hero__word">
              <span className="hero__word-inner">THINGS</span>
            </span>
          </span>
          <span className="hero__line">
            <span className="hero__word">
              <span className="hero__word-inner">THAT</span>
            </span>
            <span className="hero__word">
              <span className="hero__word-inner">SHOULD</span>
            </span>
            <span className="hero__word">
              <span className="hero__word-inner">EXIST.</span>
            </span>
          </span>
        </h1>

        <p className="hero__sub meta" ref={subRef}>
          DIGITAL PRODUCTS / SYSTEMS / INTERFACES / EXPERIMENTS
        </p>
      </div>

      <div className="hero__scroll meta meta--dim" aria-hidden="true">
        <span>SCROLL</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
