import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out", duration: 0.85 });

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createMotionSystem(): () => void {
  const reduce = prefersReducedMotion();
  let lenis: Lenis | null = null;
  let tickerCb: ((time: number) => void) | null = null;

  if (!reduce) {
    lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.05,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    tickerCb = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);
  }

  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    window.removeEventListener("load", onLoad);
    if (tickerCb) gsap.ticker.remove(tickerCb);
    lenis?.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}

export { gsap, ScrollTrigger };
