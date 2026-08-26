import { useEffect, useMemo, useState } from "react";
import { Cursor } from "./components/Cursor";
import { Nav } from "./components/Nav";
import { CursorContext, type CursorMode } from "./hooks/useCursor";
import { createMotionSystem } from "./motion/lenis-gsap";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Manifesto } from "./sections/Manifesto";
import { Material } from "./sections/Material";
import { Pillars } from "./sections/Pillars";
import { Work } from "./sections/Work";

export default function App() {
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");

  const cursorApi = useMemo(
    () => ({
      mode,
      label,
      setCursor: (next: CursorMode, nextLabel = "") => {
        setMode(next);
        setLabel(nextLabel);
      },
    }),
    [mode, label],
  );

  useEffect(() => {
    document.documentElement.classList.add("js");
    return createMotionSystem();
  }, []);

  return (
    <CursorContext.Provider value={cursorApi}>
      <div className="site">
        <div className="grain" aria-hidden="true" />
        <Cursor mode={mode} label={label} />
        <Nav />
        <main className="site-main">
          <Hero />
          <Manifesto />
          <Work />
          <Pillars />
          <Material />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </CursorContext.Provider>
  );
}
