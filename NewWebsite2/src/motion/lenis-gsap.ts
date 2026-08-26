import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out", duration: 0.85 });

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type MotionSystem = {
  lenis: Lenis | null;
  destroy: () => void;
};

export function createMotionSystem(): MotionSystem {
  const reduce = prefersReducedMotion();
  let lenis: Lenis | null = null;
  let tickerFn: ((time: number) => void) | null = null;

  if (!reduce) {
    lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.05,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    tickerFn = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
  }

  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);

  return {
    lenis,
    destroy: () => {
      window.removeEventListener("load", onLoad);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    },
  };
}

export { gsap, ScrollTrigger };
