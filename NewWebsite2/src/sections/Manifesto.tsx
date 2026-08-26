import { useEffect, useRef } from "react";
import { revealSection } from "../motion/reveals";
import "./Manifesto.css";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) revealSection(ref.current, { y: 36, stagger: 0.1 });
  }, []);

  return (
    <section className="manifesto" ref={ref} aria-labelledby="manifesto-title">
      <div className="rail manifesto__grid">
        <p className="tech-label" data-reveal>
          MANIFESTO / 00
        </p>

        <h2 id="manifesto-title" className="manifesto__title display" data-reveal>
          THE INTERNET DOESN&apos;T NEED
          <br />
          MORE SOFTWARE.
          <br />
          IT NEEDS BETTER OBJECTS.
        </h2>

        <div className="manifesto__copy" data-reveal>
          <p className="body-copy">
            Most digital products are assembled from patterns. We design them as
            instruments — with weight, hierarchy, and a reason to exist beyond
            the next release cycle.
          </p>
          <p className="body-copy">
            gLitCh Labs sits between engineering and expression. We prototype
            systems that feel inevitable once they are in your hands.
          </p>
        </div>
      </div>
    </section>
  );
}
