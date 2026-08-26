import { gsap, ScrollTrigger, prefersReducedMotion } from "./lenis-gsap";

export function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent?.trim() ?? "";
  const words = text.split(/\s+/);
  el.setAttribute("aria-label", text);
  el.innerHTML = words
    .map(
      (w) =>
        `<span class="word-reveal__word" aria-hidden="true"><span class="word-reveal__inner">${w}</span></span>`,
    )
    .join(" ");
  return Array.from(el.querySelectorAll<HTMLElement>(".word-reveal__inner"));
}

export function revealWords(
  el: HTMLElement,
  options?: { stagger?: number; y?: number; once?: boolean },
): ScrollTrigger | null {
  if (prefersReducedMotion()) {
    el.classList.add("is-revealed");
    return null;
  }

  const inners = splitWords(el);
  gsap.set(inners, { yPercent: options?.y ?? 110, opacity: 0 });

  const tween = gsap.to(inners, {
    yPercent: 0,
    opacity: 1,
    duration: 1.05,
    ease: "power4.out",
    stagger: options?.stagger ?? 0.045,
    scrollTrigger: {
      trigger: el,
      start: "top 82%",
      once: options?.once ?? true,
    },
  });

  return tween.scrollTrigger ?? null;
}

export function fadeUp(
  elements: Element | Element[],
  trigger?: Element,
): void {
  if (prefersReducedMotion()) return;
  const targets = gsap.utils.toArray(elements);
  gsap.fromTo(
    targets,
    { y: 36, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger ?? (targets[0] as Element),
        start: "top 85%",
        once: true,
      },
    },
  );
}
