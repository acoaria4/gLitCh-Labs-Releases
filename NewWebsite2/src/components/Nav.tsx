import { useEffect, useState } from "react";
import "./Nav.css";

const links = [
  { href: "#work", label: "WORK" },
  { href: "#lab", label: "LAB" },
  { href: "#about", label: "ABOUT" },
  { href: "#contact", label: "CONTACT" },
] as const;

type Props = {
  onInteract?: (active: boolean) => void;
};

export function Nav({ onInteract }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const ids = ["work", "lab", "about", "contact"];
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.4) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <a
        className="nav__brand"
        href="#top"
        aria-label="gLitCh Labs — home"
        onMouseEnter={() => onInteract?.(true)}
        onMouseLeave={() => onInteract?.(false)}
        onFocus={() => onInteract?.(true)}
        onBlur={() => onInteract?.(false)}
      >
        <img
          src="/brand/glitchlabs-icon.png"
          alt=""
          width={28}
          height={28}
          className="nav__mark"
        />
        <span className="nav__word">gLitCh Labs</span>
      </a>

      <div className="nav__meta tech-label" aria-hidden="true">
        <span>SYSTEM / ACTIVE</span>
        <span className="nav__dot" />
        <span>BUILD / 2026</span>
      </div>

      <nav className="nav__links" aria-label="Primary">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={active === link.href.slice(1) ? "is-active" : ""}
            onMouseEnter={() => onInteract?.(true)}
            onMouseLeave={() => onInteract?.(false)}
            onFocus={() => onInteract?.(true)}
            onBlur={() => onInteract?.(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
