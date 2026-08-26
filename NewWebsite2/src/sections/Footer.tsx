import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="rail footer__inner">
        <div className="footer__brand">
          <img
            src="/brand/glitchlabs-wordmark.png"
            alt="gLitCh Labs"
            className="footer__wordmark"
            width={180}
            height={72}
          />
        </div>

        <div className="footer__meta">
          <p className="tech-label">© {new Date().getFullYear()} GLITCH LABS</p>
          <p className="tech-label">DIGITAL OBJECTS / ENGINEERED</p>
        </div>
      </div>
    </footer>
  );
}
