import { useCursor } from "../hooks/useCursor";
import "./Footer.css";

export function Footer() {
  const { setCursor } = useCursor();

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <a
          href="#top"
          className="footer__brand"
          onMouseEnter={() => setCursor("link")}
          onMouseLeave={() => setCursor("default")}
        >
          <img
            src="/brand/glitchlabs-icon.png"
            alt=""
            width={24}
            height={24}
          />
          <span>gLitCh Labs</span>
        </a>

        <p className="meta meta--dim">© 2026</p>
        <p className="meta">BUILT WITH INTENT.</p>
      </div>
    </footer>
  );
}
