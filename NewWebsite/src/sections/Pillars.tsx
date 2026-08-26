import { useEffect, useRef, useState, type CSSProperties } from "react";
import { pillars } from "../data/projects";
import { gsap, prefersReducedMotion } from "../motion/lenis-gsap";
import { SectionFrame } from "../components/SectionFrame";
import "./Pillars.css";

export function Pillars() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setActive(0);
      return;
    }

    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>(".pillars__node");
      nodes.forEach((node, i) => {
        ScrollTriggerLike(node, i);
      });

      gsap.to(".pillars__crosshair", {
        rotate: 18,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, el);

    function ScrollTriggerLike(node: HTMLElement, i: number) {
      gsap.fromTo(
        node,
        { opacity: 0.35 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: node,
            start: "top 70%",
            end: "top 35%",
            scrub: true,
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          },
        },
      );
    }

    return () => ctx.revert();
  }, []);

  const current = pillars[active] ?? pillars[0];

  return (
    <SectionFrame id="lab" number="004 / LAB" label="ENGINEERING PILLARS">
      <div className="pillars container" ref={root}>
        <header className="pillars__header">
          <h2 className="display display--sm">FOUR INSTRUMENTS</h2>
          <p className="lede">
            Principles treated as coordinates — not slogans.
          </p>
        </header>

        <div className="pillars__stage material-surface--matte edge-highlight">
          <div className="corner-marks" aria-hidden="true">
            <span />
          </div>
          <div className="pillars__crosshair" aria-hidden="true">
            <span />
            <span />
            <span className="pillars__ring" />
            <span className="pillars__ring pillars__ring--outer" />
          </div>

          <div className="pillars__readout">
            <p className="meta meta--dim">ACTIVE NODE</p>
            <p className="pillars__active-id meta">{current.id}</p>
            <h3 className="pillars__active-title display display--sm">
              {current.title}
            </h3>
            <p className="body-copy">{current.copy}</p>
          </div>

          <ul className="pillars__nodes">
            {pillars.map((p, i) => (
              <li
                key={p.id}
                className={`pillars__node ${i === active ? "is-active" : ""}`}
                style={{ "--i": i } as CSSProperties}
              >
                <button
                  type="button"
                  className="pillars__node-btn"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                >
                  <span className="meta">{p.id}</span>
                  <span className="pillars__node-title">{p.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionFrame>
  );
}
