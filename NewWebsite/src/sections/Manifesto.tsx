import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../motion/lenis-gsap";
import { SectionFrame } from "../components/SectionFrame";
import "./Manifesto.css";

const LINE_A = ["THE", "INTERNET", "DOESN'T", "NEED"];
const LINE_B = ["MORE", "SOFTWARE."];
const LINE_C = ["IT", "NEEDS", "BETTER", "OBJECTS."];

export function Manifesto() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const words = el.querySelectorAll<HTMLElement>(".manifesto__word");
    const ctx = gsap.context(() => {
      words.forEach((word) => {
        gsap.fromTo(
          word,
          { opacity: 0.22, filter: "blur(5px)", y: 20 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: word,
              start: "top 90%",
              end: "top 40%",
              scrub: 0.9,
            },
          },
        );
      });

      gsap.fromTo(
        ".manifesto__copy",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          scrollTrigger: {
            trigger: ".manifesto__copy",
            start: "top 85%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const renderLine = (words: string[], lineKey: string) => (
    <span className="manifesto__line">
      {words.map((w, i) => (
        <span key={`${lineKey}-${i}`} className="manifesto__word">
          {w}
        </span>
      ))}
    </span>
  );

  return (
    <SectionFrame number="002 / MANIFESTO" label="PHILOSOPHY">
      <div className="manifesto container" ref={root}>
        <h2
          className="manifesto__title display display--xl"
          aria-label="The internet doesn't need more software. It needs better objects."
        >
          {renderLine(LINE_A, "a")}
          {renderLine(LINE_B, "b")}
          {renderLine(LINE_C, "c")}
        </h2>
        <p className="manifesto__copy body-copy">
          gLitCh Labs designs and builds products, systems, and interfaces where
          engineering and aesthetics are treated as one discipline. Fewer
          surfaces. Stronger objects. Software that feels inevitable.
        </p>
      </div>
    </SectionFrame>
  );
}
