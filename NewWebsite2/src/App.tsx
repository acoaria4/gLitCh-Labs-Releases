import { useEffect } from "react";
import { Nav } from "./components/Nav";
import { Cursor } from "./components/Cursor";
import { Hero } from "./sections/Hero";
import { Manifesto } from "./sections/Manifesto";
import { Work } from "./sections/Work";
import { Principles } from "./sections/Principles";
import { Material } from "./sections/Material";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { createMotionSystem } from "./motion/lenis-gsap";
import { useCursor } from "./hooks/useCursor";

export default function App() {
  const cursor = useCursor();

  useEffect(() => {
    const motion = createMotionSystem();
    return () => motion.destroy();
  }, []);

  return (
    <div className="app-shell">
      <div className="grain-overlay" aria-hidden="true" />
      <Cursor enabled={cursor.enabled} mode={cursor.mode} label={cursor.label} />
      <Nav
        onInteract={(active) => cursor.setMode(active ? "link" : "default")}
      />
      <main>
        <Hero />
        <Manifesto />
        <Work
          onProjectHover={(name) => {
            if (name) {
              cursor.setMode("project");
              cursor.setLabel(name);
            } else {
              cursor.setMode("default");
              cursor.setLabel("");
            }
          }}
        />
        <Principles />
        <Material
          onEnter={() => cursor.setMode("material")}
          onLeave={() => cursor.setMode("default")}
        />
        <About />
        <Contact
          onInteract={(active) => cursor.setMode(active ? "link" : "default")}
        />
      </main>
      <Footer />
    </div>
  );
}
