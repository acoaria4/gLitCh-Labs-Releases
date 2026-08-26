import { useEffect, useRef } from "react";
import { revealSection } from "../motion/reveals";
import "./About.css";

export function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) revealSection(ref.current, { y: 30 });
  }, []);

  return (
    <section className="about" id="about" ref={ref} aria-labelledby="about-title">
      <div className="rail about__grid">
        <p className="tech-label" data-reveal>
          STUDIO / ABOUT
        </p>

        <div className="about__content">
          <h2 id="about-title" className="about__title display" data-reveal>
            WE OPERATE BETWEEN
            <br />
            ENGINEERING AND EXPRESSION.
          </h2>

          <div className="about__copy" data-reveal>
            <p className="body-copy">
              gLitCh Labs is a small studio for unusual digital products —
              systems that feel machined rather than assembled, editorial rather
              than ornamental.
            </p>
            <p className="body-copy">
              We build tools and experiences where structure is visible, motion
              has weight, and every interaction respects the person using it.
            </p>
          </div>

          <dl className="about__facts" data-reveal>
            <div>
              <dt className="tech-label">FOCUS</dt>
              <dd>Local-first products · research systems · digital instruments</dd>
            </div>
            <div>
              <dt className="tech-label">METHOD</dt>
              <dd>Prototype → refine → ship with material discipline</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
