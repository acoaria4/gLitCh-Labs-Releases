import { useEffect, useRef } from "react";
import { revealSection } from "../motion/reveals";
import "./Contact.css";

type Props = {
  onInteract?: (active: boolean) => void;
};

export function Contact({ onInteract }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) revealSection(ref.current, { y: 24 });
  }, []);

  return (
    <section
      className="contact"
      id="contact"
      ref={ref}
      aria-labelledby="contact-title"
    >
      <div className="rail contact__inner">
        <p className="tech-label" data-reveal>
          CONTACT / END
        </p>

        <h2 id="contact-title" className="contact__title display" data-reveal>
          HAVE SOMETHING
          <br />
          WORTH BUILDING?
        </h2>

        <a
          className="contact__cta"
          href="mailto:hello@glitchlabs.com"
          data-reveal
          onMouseEnter={() => onInteract?.(true)}
          onMouseLeave={() => onInteract?.(false)}
          onFocus={() => onInteract?.(true)}
          onBlur={() => onInteract?.(false)}
        >
          LET&apos;S TALK
          <span aria-hidden="true"> →</span>
        </a>
      </div>
    </section>
  );
}
