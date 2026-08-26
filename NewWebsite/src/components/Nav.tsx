import { useEffect, useState } from "react";
import { useCursor } from "../hooks/useCursor";
import "./Nav.css";

const links = [
  { href: "#work", label: "WORK" },
  { href: "#lab", label: "LAB" },
  { href: "#about", label: "ABOUT" },
  { href: "#contact", label: "CONTACT" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { setCursor } = useCursor();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <a
          href="#top"
          className="nav__brand"
          onMouseEnter={() => setCursor("link")}
          onMouseLeave={() => setCursor("default")}
        >
          <img
            src="/brand/glitchlabs-icon.png"
            alt=""
            width={28}
            height={28}
            className="nav__mark"
          />
          <span className="nav__name">gLitCh Labs</span>
        </a>

        <div className="nav__meta meta meta--dim" aria-hidden="true">
          <span className="status-dot" />
          SYSTEM / 001
        </div>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav__link"
              onMouseEnter={() => setCursor("link")}
              onMouseLeave={() => setCursor("default")}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
