# MengWebsite

From-scratch gLitCh Labs studio marketing site (Home, About, Contact, Expenses). Visual identity is independent of the repository root.

## Run

```bash
cd MengWebsite
bun install
bun run dev
```

If `bun` is unavailable, use `npm install` / `npm run dev` (this environment needed `strict-ssl=false` in local `.npmrc` due to TLS interception).

Production build:

```bash
bun run build
bun run preview
```

## Stack

- Vite (multi-page)
- GSAP + ScrollTrigger
- Lenis (sole smooth-scroll engine)
- Iconify Solar icons (UI glyphs)

## Art direction

See [DESIGN.md](DESIGN.md). Skills applied: build-awwwards-quality-sites, editorial-tech, cinematic-gsap-lenis-motion-system, landing-page (Expenses), impeccable craft floor.

## Asset provenance

All rasters below were generated for this project (Cursor GenerateImage) and live only under `public/assets/`. They are not copied from the repository root.

| File | Role |
|------|------|
| `glitchlabs-mark.png` | Studio mark |
| `expenses-mark.png` | Expenses product mark |
| `studio-hero.png` | Studio hero / editorial band |
| `expenses-hero.png` | Expenses hero / product still |

## Pages

| Path | Purpose |
|------|---------|
| `/` | Studio home |
| `/about.html` | Principles |
| `/contact.html` | Mailto contact form |
| `/expenses/` | Expenses product landing (Play + TestFlight beta) |

## Notes

- Do not claim awards or invented social proof.
- Root store policy URLs are intentionally omitted from this marketing-only scope; support points to email / contact.
