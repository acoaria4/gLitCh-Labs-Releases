import { useEffect, useRef } from "react";
import { CONTACT_EMAIL } from "../data/projects";
import { useCursor } from "../hooks/useCursor";
import { gsap, prefersReducedMotion } from "../motion/lenis-gsap";
import { SectionFrame } from "../components/SectionFrame";
import "./Contact.css";

export function Contact() {
  const root = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const { setCursor } = useCursor();

  useEffect(() => {
    const el = root.current;
    const cta = ctaRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          ".contact__title span",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.15,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: { trigger: ".contact__title", start: "top 80%", once: true },
          },
        );
      }
    }, el);

    if (!cta || prefersReducedMotion()) {
      return () => ctx.revert();
    }

    const pos = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = cta.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      pos.x = (e.clientX - cx) * 0.12;
      pos.y = (e.clientY - cy) * 0.12;
      gsap.to(cta, { x: pos.x, y: pos.y, duration: 0.45, ease: "power3.out" });
    };
    const onLeave = () => {
      gsap.to(cta, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
    };

    cta.addEventListener("pointermove", onMove);
    cta.addEventListener("pointerleave", onLeave);

    return () => {
      cta.removeEventListener("pointermove", onMove);
      cta.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, []);

  return (
    <SectionFrame id="contact" number="007 / CONTACT" label="SIGNAL">
      <div className="contact container" ref={root}>
        <h2 className="contact__title display display--xxl">
          <span className="contact__line">
            <span>HAVE SOMETHING</span>
          </span>
          <span className="contact__line">
            <span>WORTH BUILDING?</span>
          </span>
        </h2>

        <a
          ref={ctaRef}
          className="contact__cta"
          href={`mailto:${CONTACT_EMAIL}`}
          onMouseEnter={() => setCursor("link")}
          onMouseLeave={() => setCursor("default")}
        >
          <span className="contact__cta-label">LET&apos;S TALK</span>
          <span className="contact__cta-arrow" aria-hidden="true">
            →
          </span>
        </a>

        <p className="contact__email meta">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onMouseEnter={() => setCursor("link")}
            onMouseLeave={() => setCursor("default")}
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </SectionFrame>
  );
}
