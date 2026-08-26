import { gsap, ScrollTrigger, prefersReducedMotion } from "./lenis-gsap";

export function splitLines(el: HTMLElement): HTMLElement[] {
  const text = el.textContent?.trim() ?? "";
  el.setAttribute("aria-label", text);
  el.textContent = "";

  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const wrappers: HTMLElement[] = [];

  lines.forEach((line) => {
    const outer = document.createElement("span");
    outer.className = "line-mask";
    outer.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span");
    inner.className = "line-inner";
    inner.textContent = line;
    outer.appendChild(inner);
    el.appendChild(outer);
    wrappers.push(inner);
  });

  return wrappers;
}

export function revealSection(
  root: HTMLElement,
  options?: { y?: number; stagger?: number },
) {
  if (prefersReducedMotion()) return;

  const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!items.length) return;

  gsap.set(items, { opacity: 0, y: options?.y ?? 28 });

  ScrollTrigger.create({
    trigger: root,
    start: "top 78%",
    once: true,
    onEnter: () => {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        stagger: options?.stagger ?? 0.08,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
  });
}
