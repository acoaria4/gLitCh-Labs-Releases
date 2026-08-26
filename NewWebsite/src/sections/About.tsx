import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../motion/lenis-gsap";
import { SectionFrame } from "../components/SectionFrame";
import "./About.css";

export function About() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about__title .about__word",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.05,
          ease: "power4.out",
          scrollTrigger: { trigger: ".about__title", start: "top 80%", once: true },
        },
      );
      gsap.fromTo(
        ".about__copy",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: { trigger: ".about__copy", start: "top 85%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const title =
    "WE ARE INTERESTED IN THE SPACE BETWEEN ENGINEERING AND EXPRESSION.";

  return (
    <SectionFrame id="about" number="006 / ABOUT" label="STUDIO">
      <div className="about container" ref={root}>
        <h2
          className="about__title display display--xl"
          aria-label={title}
        >
          {title.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} className="about__word-wrap">
              <span className="about__word">{word}</span>
            </span>
          ))}
        </h2>
        <p className="about__copy body-copy">
          gLitCh Labs is an independent studio exploring the intersection of
          software, product design, interaction, visual systems, and
          computation. We ship focused, privacy-minded objects — local-first
          when it matters, calm by default.
        </p>
        <div className="about__coords meta meta--dim" aria-hidden="true">
          <span>INDEPENDENT STUDIO</span>
          <span>BUILD MODE</span>
          <span>2026</span>
        </div>
      </div>
    </SectionFrame>
  );
}
