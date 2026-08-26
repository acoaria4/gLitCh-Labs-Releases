import { useEffect, useRef, useState } from "react";
import { principles } from "../data/projects";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../motion/lenis-gsap";
import "./Principles.css";

export function Principles() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = prefersReducedMotion();

    if (reduce) return;

    const triggers: ScrollTrigger[] = [];

    principles.forEach((_, i) => {
      const el = root.querySelector<HTMLElement>(`[data-principle="${i}"]`);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        }),
      );
    });

    gsap.fromTo(
      root.querySelector(".principles__stage"),
      { opacity: 0.4 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "top 30%",
          scrub: 0.9,
        },
      },
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const current = principles[active] ?? principles[0];

  return (
    <section
      className="principles"
      id="principles"
      ref={ref}
      aria-labelledby="principles-title"
    >
      <div className="rail principles__layout">
        <div className="principles__stage graphite-plate specular">
          <p className="tech-label">OPERATING MODE / {current.id}</p>
          <div className="principles__geometry" data-mode={current.id} aria-hidden="true">
            <span className="principles__axis principles__axis--h" />
            <span className="principles__axis principles__axis--v" />
            <span className="principles__node principles__node--a" />
            <span className="principles__node principles__node--b" />
            <span className="principles__node principles__node--c" />
            <span className="principles__node principles__node--d" />
          </div>
          <h2 id="principles-title" className="principles__active display">
            {current.title}
          </h2>
          <p className="principles__body body-copy">{current.body}</p>
        </div>

        <ol className="principles__list">
          {principles.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className={`principles__item ${active === i ? "is-active" : ""}`}
                data-principle={i}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
              >
                <span className="tech-label">{item.id}</span>
                <span className="principles__item-title">{item.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
