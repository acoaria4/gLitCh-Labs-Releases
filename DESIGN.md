# gLitCh Labs — Design Language

Reference for extending the studio site. Source of truth for tokens lives in `css/styles.css` and `js/theme.js`; keep this file aligned when those change.

## Brand

- **Name:** `gLitCh Labs` (exact casing)
- **Voice:** calm, precise, unhurried — product-first, not hype
- **Positioning:** a small studio shipping focused, privacy-minded software
- **Hero idea:** brand and product marks lead; headlines support, never overpower

### Brand hierarchy (first viewport)

1. Brand or product mark (icon / wordmark)
2. One headline
3. One short supporting sentence
4. One CTA group
5. Optional dominant product visual

Avoid stuffing stats, schedules, promo chips, or secondary marketing into the first viewport.

---

## Visual direction

| Principle | Practice |
|-----------|----------|
| Atmosphere over flat fill | Soft accent glows + grain over solid `#000` |
| Glass, not cards-for-cards’ sake | Use `.glass` when a surface holds interaction or a distinct content block |
| One job per section | One kicker, one headline, one short lead |
| Real product imagery | Wordmarks / icons / heroes; avoid decorative stock collages |
| Dark by default | `color-scheme: dark`; cream text on near-black |

**Avoid:** purple-on-white gradients, generic Inter/Roboto stacks, dense newspaper layouts, floating badge stickers on heroes, multi-layer neon glow.

---

## Color

### Base palette (`:root` in `css/styles.css`)

| Token | Default | Role |
|-------|---------|------|
| `--bg` | `#0b0b12` | Page background |
| `--bg-deep` | `#07070c` | Depth / gradient end |
| `--text` | `#f5f3ee` | Primary cream text |
| `--muted` | `#a8a6b3` | Secondary / body prose |
| `--accent` | `#d8c4a0` | Soft gold (Morning default) |
| `--accent-hover` | `#e4d2b2` | Accent hover |
| `--accent-soft` | mix 18% accent | Soft fills / pills |
| `--line` | `rgba(255,255,255,0.1)` | Hairlines |
| `--glass` | `rgba(255,255,255,0.045)` | Glass fill |
| `--glass-strong` | `rgba(255,255,255,0.07)` | Stronger glass |
| `--glass-border` | `rgba(255,255,255,0.14)` | Glass edge |

Inline policy pages should **not** invent a parallel palette — use studio tokens via `styles.css`.

### Accent themes (`js/theme.js`)

Stored in `localStorage` under `glitchlabs-accent` (`auto` or an id).

| Id | Hex | Hover | Time window (auto) |
|----|-----|-------|--------------------|
| `midnight` | `#9bb0c9` | `#b4c4d8` | 00–03 |
| `dawn` | `#e2b39a` | `#ebc4b0` | 04–07 |
| `morning` | `#d8c4a0` | `#e4d2b2` | 08–11 |
| `day` | `#8fbfb0` | `#a6cec2` | 12–15 |
| `dusk` | `#c9a48a` | `#d7b69f` | 16–19 |
| `night` | `#b8a9c9` | `#cbbfd8` | 20–23 |

Accent drives CTAs, links in docs, soft glows, and atmospheric radials. Do not hard-code gold into new components — use `var(--accent)`. The accent swatch lives in the nav (not a floating viewport control).

---

## Typography

| Role | Family | Usage |
|------|--------|--------|
| UI / body | **Satoshi** (`--font-sans`) | Nav, buttons, prose, meta |
| Display | **Instrument Serif** (`--font-display`) | Heroes, page titles, product headlines |

**Load:** Google Fonts (Instrument Serif) + Fontshare (Satoshi 400–700).

### Scale habits

- Home hero: large display (`clamp` ~2.8–4.8rem range in CSS)
- Product / page hero: slightly smaller display
- Doc titles (`.doc-page h1`): display, ~2.2–3rem
- Section titles: sans, ~1.5–1.8rem feel
- Nav brand / product: sans **700**, ~1.15rem
- Body: `line-height: 1.55`, muted for long copy
- Kickers: small caps-ish uppercase tracking (`.section-kicker`)

Prefer italic *emphasis* in display headlines via `<em>` (accent-colored), not all-caps shouting.

---

## Layout & structure

### Shell (every studio page)

1. `.wrap` — `min(1120px, calc(100% - 40px))`, centered  
2. Sticky `.nav` (glass pill)  
3. Page content  
4. `.footer`  
5. Scripts: `theme.js` (head), `main.js` (end of body)

Path depth:

- Root pages → `./css/`, `./js/`, `./assets/`
- Product / policy pages under `expenses/` or `aura/` → `../css/`, `../js/`, `../assets/`
- Instagram bio under `expenses/get/` → `../../css/`, `../../assets/` (no `js/`; no nav or footer)

### Page types

| Type | Pattern | Examples |
|------|---------|----------|
| Studio home | `.hero` + wordmark + products grid | `index.html` |
| Studio subpage | `.page-hero` + section(s) | `about.html`, `contact.html` |
| Product marketing | `.product-page-hero` + resources | `expenses/index.html`, `aura/index.html` |
| Policy / support | `.doc-page` inside shell | `privacy.html`, `support.html`, … |
| Invite landing | `.invite-panel.glass` + deep-link JS | `expenses/invite.html` |
| Instagram bio (mark-as-page) | No studio shell. `body.get-page` + `.get` column; wordmark, one line, stacked store buttons. Inherits tokens; stays unlinked from studio and product nav. | `expenses/get/` |

Studio-shell pages (home, subpage, product, policy, invite) use the wrap / nav / footer pattern above. `expenses/get/` is the exception: it loads Satoshi + `css/styles.css` + `expenses/get/get.css` only — no Instrument Serif, no `theme.js`, no `main.js`. Do not add this URL to studio or product navigation.

### Stable store URLs (do not rename)

Keep these paths intact for Play / App Store consoles:

- `expenses/privacy.html`
- `expenses/support.html`
- `expenses/delete-account.html`
- `expenses/invite.html` (+ `?t=` / `?token=`)
- `aura/privacy.html`

Assimilate chrome (nav, fonts, theme) without rewriting legal/support copy or breaking anchors such as `#account-deletion`.

---

## Components

### Glass (`.glass`)

Blurred translucent surface: soft fill, light border, inset highlight, deep shadow. Use for product panels, link cards, contact form, invite panel — not for every paragraph.

### Navigation

- **Brand:** icon 40×40 + `<span class="nav-brand-label">gLitCh Labs</span>` (bold). Links home.
- **Product crumb:** SVG chevron (`.nav-crumb`) → product link with optional product icon (Expenses: 32×32). Lockup uses `flex-wrap: nowrap` so it never stacks inside the fixed-height nav.
- **Accent picker:** in-nav trailing control (`.accent-helper`), mounted by `theme.js` into `.nav`. Desktop order: brand → links → accent. Mobile order: lockup → accent → hamburger; palette drops below the swatch.
- **Links:** Products · About · Contact (Contact uses `.nav-cta` accent fill).
- Mobile: `.nav-toggle` hamburger; `.nav.is-open` expands links. On ≤560px product pages, hide `.nav-brand-label` so the crumb stays one line (studio icon + chevron + product).

### Buttons

| Class | Look |
|-------|------|
| `.btn.btn-primary` | Solid accent fill, dark text |
| `.btn.btn-secondary` | Transparent + light border |
| `.btn-soon` | Disabled look; clicks blocked in `main.js` — avoid for live links |
| `.soon-label` / Beta label | Small muted suffix inside the button |

Store CTAs open in a new tab (`target="_blank"` + `rel="noopener noreferrer"`).

### Sections

- `.section` + `.section-head` with `.section-kicker`, `h2`, short `p`
- Reveal: add `.reveal` (+ optional `.reveal-delay-*`); `main.js` IntersectionObserver adds `.is-visible`

### Link cards (`.link-card.glass`)

Label + short description; used for policy/support grids on product pages. Prefer these over ad-hoc bordered boxes.

### Doc pages (`.doc-page`)

Long-form policy/support:

- Display `h1`, sans `h2`
- `.meta` block under title (product, app id, last updated)
- Body/list text uses `--muted`; `strong` uses `--text`
- Links use `--accent`
- Optional `.cta` for mailto actions; `.footer-nav` for related in-page links

### Invite (`.invite-panel`)

Centered glass panel; keep `#lead`, `#err`, `#open-app`, `#hint` and deep-link script (`com.glitchlabs.expenses://invite/…`) intact when restyling.

### Footer

Studio mark + © year (`#year` filled by `main.js`) + sparse product/privacy/GitHub links.

---

## Motion

- Ease: `--ease: cubic-bezier(0.22, 1, 0.36, 1)`
- Entrance: `rise` / `rise-logo` opacity + translateY
- Nav appears slightly first; hero mark, then copy, then CTAs
- Respect `prefers-reduced-motion: reduce` (CSS + JS skip reveals)
- Prefer 2–3 intentional motions per page over constant animation

---

## Imagery & assets

| Asset | Typical use |
|-------|-------------|
| `assets/glitchlabs-icon.png` | Favicon, nav, footer |
| `assets/glitchlabs-wordmark.png` | Home hero |
| `assets/expenses-icon.png` | Nav product crumb, product grid |
| `assets/aura-icon.png` | AURA favicon, nav crumb, product grid, AURA hero mark |
| `assets/expenses-wordmark.png` | Expenses hero |
| `assets/expenses-logo.png` | Legacy / invite mark under `expenses/assets/` also kept for store pages |

Icons in nav get a soft accent drop-shadow. Prefer transparent wordmarks on dark; don’t place busy photos behind policy text.

---

## Copy tone

- Short sentences; concrete product language
- Prefer “local-first”, “optional”, “calm” over “revolutionary” / “AI-powered”
- Policy pages: factual, scannable numbered sections — design may change; wording is product/legal content

---

## Implementation checklist (new page)

1. Copy shell from an existing page at the same path depth (`contact.html` or `expenses/index.html`). Instagram bio copies `expenses/get/`, not a studio-shell page.
2. Include fonts + `styles.css` + `theme.js` + `main.js`. Instagram bio: Satoshi + `styles.css` + `get.css` only.
3. Use CSS variables — no one-off hex for accent/text/bg.
4. Pick the right page type (hero / product / doc / invite / Instagram bio).
5. If under `expenses/` or `aura/` and using the studio shell, use brand lockup + product crumb. Skip the shell entirely for `expenses/get/`.
6. Do not move or rename store-linked HTML files.
7. Smoke-test mobile nav and reduced-motion (bio page: reduced-motion only; there is no nav).
8. Never link `expenses/get/` from studio or product navigation.

---

## File map

| Path | Role |
|------|------|
| `css/styles.css` | Tokens, components, layout |
| `js/theme.js` | Accent themes + picker |
| `js/main.js` | Nav, year, reveals, contact mailto, soon-button guard |
| `assets/` | Studio + product imagery |
| `expenses/*`, `aura/*` | Product + store-facing pages |
| `expenses/get/` | Instagram bio landing — inherits `css/styles.css` tokens; layout in `get.css`; unlinked from nav |

When the visual system changes, update **this file** and the CSS tokens together.
