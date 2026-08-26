import { useEffect, useRef } from "react";
import { projects } from "../data/projects";
import { revealSection } from "../motion/reveals";
import "./Work.css";

type Props = {
  onProjectHover?: (name: string | null) => void;
};

export function Work({ onProjectHover }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) revealSection(ref.current, { y: 24, stagger: 0.06 });
  }, []);

  return (
    <section className="work" id="work" ref={ref} aria-labelledby="work-title">
      <div className="rail">
        <div className="work__head" data-reveal>
          <p className="tech-label">INDEX / WORK</p>
          <h2 id="work-title" className="work__title display">
            PROJECT SYSTEM
          </h2>
        </div>

        <ul className="work__index">
          {projects.map((project) => (
            <li key={project.id}>
              <article
                className="work__row"
                data-reveal
                onMouseEnter={() => onProjectHover?.(project.name)}
                onMouseLeave={() => onProjectHover?.(null)}
                onFocus={() => onProjectHover?.(project.name)}
                onBlur={() => onProjectHover?.(null)}
                tabIndex={0}
              >
                <div className="work__num tech-label">{project.index}</div>
                <div className="work__main">
                  <h3 className="work__name">{project.name}</h3>
                  <p className="work__category tech-label">{project.category}</p>
                </div>
                <div className="work__year tech-label">{project.year}</div>
                <div className="work__status tech-label">{project.status}</div>
                <p className="work__summary">{project.summary}</p>
                <span className="work__rule" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
