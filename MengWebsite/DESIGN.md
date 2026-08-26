# MengWebsite — Design System

Local visual system for the gLitCh Labs marketing redesign in this folder. Independent of the repository root styles.

## Thesis

**Precision ledger editorial** — cool stone paper, deep ink type, one mineral teal accent. The studio feels engineered and calm. Anti-reference: root night / gold / glass.

## Mode

Persuade (studio + product marketing).

## Color

| Token | Value | Role |
|-------|-------|------|
| `--paper` | `#E9EEEA` | Page field (cool stone, not warm cream) |
| `--paper-deep` | `#DDE4DF` | Depth / gradient end |
| `--ink` | `#0E1412` | Primary text |
| `--ink-soft` | `#24302B` | Nav / secondary emphasis |
| `--muted` | `#5A6560` | Supporting copy |
| `--accent` | `#0F6E63` | Mineral teal — CTAs, indices, focus |
| `--accent-hover` | `#0B574F` | Hover |
| `--surface` | `#F3F6F3` | Panels / inputs |
| `--line` | ink @ 12% | Rules and frames |

Strategy: **Restrained** — neutrals plus one accent.

## Typography

| Role | Face |
|------|------|
| Display | Literata (opsz), weight 500–600 |
| Body | Satoshi |
| Mono / kickers | JetBrains Mono |

No Inter, Roboto, Arial, or Instrument Serif (root).

## Layout

- Asymmetrical editorial splits, thin structural rules, full-bleed media bands.
- Hero: brand at hero scale, one headline, one lead, one CTA group over a full-bleed authored image.
- Cards avoided except where a bordered panel holds a distinct interaction or product entry.

## Motion

- **Smooth scroll:** Lenis only (never Locomotive).
- **Animation:** GSAP + ScrollTrigger.
- Hero intro timeline; word reveals on section titles; staggered group reveals; image clip reveals.
- `prefers-reduced-motion: reduce` → no Lenis; final states immediately; content readable without JS.

## Three.js

None. Depth comes from photography, typography, and GSAP.

## Assets

Original generated imagery in `public/assets/` — see README provenance. Solar icons via Iconify for UI glyphs only. No fake testimonials or logo walls.

## Voice

Calm, precise, unhurried. Brand: `gLitCh Labs`. Product: `Expenses`. Privacy and local-first as facts. Beta labels on store CTAs.
