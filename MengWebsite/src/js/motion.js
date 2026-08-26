import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out", duration: 0.85 });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis;

function splitText(el, mode) {
  const source = el.getAttribute("data-unsplit") || el.textContent.trim();
  el.setAttribute("data-unsplit", source);
  el.setAttribute("aria-label", source);

  const parts =
    mode === "words"
      ? source.split(/(\s+)/).filter((p) => p.length)
      : source.split("\n").filter((p) => p.length) || [source];

  el.innerHTML = "";
  const nodes = [];

  if (mode === "words") {
    parts.forEach((part) => {
      if (/^\s+$/.test(part)) {
        el.appendChild(document.createTextNode(part));
        return;
      }
      const mask = document.createElement("span");
      mask.className = "motion-word-mask";
      mask.setAttribute("aria-hidden", "true");
      const word = document.createElement("span");
      word.className = "motion-word";
      word.textContent = part;
      mask.appendChild(word);
      el.appendChild(mask);
      nodes.push(word);
    });
  } else {
    const mask = document.createElement("span");
    mask.className = "motion-line-mask";
    mask.setAttribute("aria-hidden", "true");
    const line = document.createElement("span");
    line.className = "motion-line";
    line.textContent = source;
    mask.appendChild(line);
    el.appendChild(mask);
    nodes.push(line);
  }

  return nodes;
}

function initSmoothScroll() {
  if (reduceMotion) return;

  lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function initHeroIntro() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const brand = hero.querySelector("[data-hero-brand]");
  const title = hero.querySelector("[data-hero-title]");
  const lead = hero.querySelector("[data-hero-lead]");
  const cta = hero.querySelector("[data-hero-cta]");
  const media = hero.querySelector("[data-hero-media]");

  if (reduceMotion) {
    gsap.set([brand, title, lead, cta, media], { clearProps: "all", autoAlpha: 1 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (media) {
    tl.fromTo(media, { scale: 1.08, autoAlpha: 0.7 }, { scale: 1, autoAlpha: 1, duration: 1.35 }, 0);
  }
  if (brand) {
    const words = splitText(brand, "words");
    gsap.set(brand, { visibility: "visible" });
    tl.from(words, { yPercent: 110, duration: 1, stagger: 0.05 }, 0.15);
  }
  if (title) {
    const words = splitText(title, "words");
    gsap.set(title, { visibility: "visible" });
    tl.from(words, { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.04 }, 0.35);
  }
  if (lead) {
    gsap.set(lead, { visibility: "visible" });
    tl.from(lead, { y: 24, opacity: 0, duration: 0.8 }, 0.55);
  }
  if (cta) {
    gsap.set(cta, { visibility: "visible" });
    tl.from(cta, { y: 18, opacity: 0, duration: 0.7 }, 0.7);
  }
}

function initTextReveals() {
  document.querySelectorAll("[data-motion-text]").forEach((el) => {
    if (el.closest("[data-hero]")) return;

    const mode = el.getAttribute("data-motion-text") || "words";
    if (reduceMotion) {
      el.style.visibility = "visible";
      return;
    }

    const nodes = splitText(el, mode === "lines" ? "lines" : "words");
    gsap.set(el, { visibility: "visible" });
    gsap.from(nodes, {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      stagger: mode === "words" ? 0.045 : 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        once: true,
      },
    });
  });
}

function initReveals() {
  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    const items = group.querySelectorAll("[data-reveal-item], [data-reveal]");
    if (!items.length) return;

    if (reduceMotion) {
      gsap.set(items, { clearProps: "all", autoAlpha: 1 });
      return;
    }

    gsap.set(items, { visibility: "visible", y: 28, opacity: 0 });
    gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.08,
      scrollTrigger: {
        trigger: group,
        start: "top 80%",
        once: true,
      },
    });
  });

  document.querySelectorAll("[data-reveal]:not([data-reveal-item])").forEach((el) => {
    if (el.closest("[data-reveal-group]")) return;
    if (reduceMotion) {
      el.style.visibility = "visible";
      return;
    }
    gsap.set(el, { visibility: "visible" });
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.9,
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        once: true,
      },
    });
  });
}

function initImageReveals() {
  document.querySelectorAll("[data-image-reveal]").forEach((figure) => {
    const img = figure.querySelector("img");
    if (!img) return;

    if (reduceMotion) {
      figure.style.visibility = "visible";
      return;
    }

    const mask = document.createElement("div");
    mask.className = "image-reveal-mask";
    img.parentNode.insertBefore(mask, img);
    mask.appendChild(img);

    gsap.set(figure, { visibility: "visible" });
    gsap.from(mask, {
      clipPath: "inset(8% 8% 8% 8%)",
      duration: 1.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: figure,
        start: "top 78%",
        once: true,
      },
    });
    gsap.from(img, {
      scale: 1.04,
      duration: 1.25,
      ease: "power3.out",
      transformOrigin: "center center",
      scrollTrigger: {
        trigger: figure,
        start: "top 78%",
        once: true,
      },
    });
  });
}

export function initMotion() {
  document.documentElement.classList.add("has-motion");
  initSmoothScroll();
  initHeroIntro();
  initTextReveals();
  initReveals();
  initImageReveals();

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  document.fonts?.ready?.then(() => {
    ScrollTrigger.refresh();
  });
}

export function destroyMotion() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (lenis) {
    lenis.destroy();
    lenis = undefined;
  }
}
