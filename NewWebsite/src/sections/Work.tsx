import { useEffect, useRef } from "react";
import { projects } from "../data/projects";
import type { Project } from "../data/projects";
import { useCursor } from "../hooks/useCursor";
import { gsap, prefersReducedMotion } from "../motion/lenis-gsap";
import { SectionFrame } from "../components/SectionFrame";
import "./Work.css";

function ProjectRow({ project }: { project: Project }) {
  const { setCursor } = useCursor();
  const Tag = project.href ? "a" : "div";
  const linkProps = project.href
    ? { href: project.href, target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <Tag
      className="work-row"
      data-cursor="project"
      {...linkProps}
      onMouseEnter={() => setCursor("project", "OPEN")}
      onMouseLeave={() => setCursor("default")}
    >
      <div className="work-row__visual">
        <div className="work-row__plate material-surface--matte">
          <img
            className="work-row__mark"
            src={project.mark}
            alt={project.markAlt}
            width={160}
            height={160}
            loading="lazy"
            decoding="async"
          />
          {project.status === "INTERNAL" ? (
            <span className="work-row__badge meta">INTERNAL</span>
          ) : null}
        </div>
        <div className="work-row__line" />
      </div>
      <div className="work-row__body">
        <div className="work-row__head">
          <span className="meta">
            {project.number} / {project.name.toUpperCase()}
          </span>
          <span className="meta meta--dim">{project.year}</span>
        </div>
        <h3 className="work-row__title display display--sm">{project.name}</h3>
        <p className="work-row__cat meta">{project.category}</p>
        <p className="work-row__desc body-copy">{project.description}</p>
        <div className="work-row__meta">
          <span className="meta meta--dim">{project.meta}</span>
          <span className="meta">
            <span className="status-dot" />
            {project.status}
          </span>
        </div>
      </div>
    </Tag>
  );
}

export function Work() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".work-row").forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <SectionFrame id="work" number="003 / WORK" label="PROJECT INDEX">
      <div className="work container" ref={root}>
        <header className="work__header">
          <h2 className="display display--sm">Selected objects</h2>
          <p className="lede">
            Products and systems currently in the lab — indexed by mark, not
            by marketing tiles.
          </p>
        </header>
        <div className="work__list">
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} />
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
