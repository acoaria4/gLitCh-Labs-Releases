# gLitCh Labs — NewWebsite Design System

## Thesis

A precision-engineered digital laboratory built inside black metal.
Architectural typography, tactile graphite materials, sparse technical metadata, heavy slow motion.

## Provenance

Official brand marks copied from repository root into `public/brand/`:

- `glitchlabs-icon.png`, `glitchlabs-wordmark.png` — studio identity
- `expenses-icon.png`, `expenses-wordmark.png` — Expenses product mark
- `aura-icon.png` — AURA product mark

No product screenshots, heroes, or marketing artwork imported.
Social Composer uses the studio mark (no dedicated product icon exists).

## Palette

| Token | Hex |
|-------|-----|
| near-black | `#050505` |
| graphite | `#0B0C0D` |
| dark-graphite | `#111214` |
| gunmetal | `#181A1C` |
| brushed | `#24272A` |
| soft-silver | `#7D8287` |
| cool-silver | `#A7ADB2` |
| near-white | `#E8E9E7` |
| pure-white | `#F5F5F2` |
| accent (rare) | `#C5CCD3` cold white |

## Typography

- Display / UI: Geist Sans
- Micro / system: Geist Mono
- Display tracking softened (`~-0.018em`); line-height ~1.02 for readable word space
- Split display words use explicit `margin-right` gaps — never animate letter-spacing negative

## Motion

- Lenis + GSAP ScrollTrigger only
- UI: 180–350ms · Structural: 600–1200ms · Cinematic: 1200–2200ms
- `prefers-reduced-motion`: no smooth scroll, no scrubbed timelines

## WebGL

- Hero: graphite procedural machined field
- Material / 001: interactive surface playground
- Pause offscreen; cap DPR; static fallback on reduced motion / failure
