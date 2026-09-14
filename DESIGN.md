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

Inline policy pages should **not** invent a parallel palette — use studio tokens via `styles.css`. Instagram bios may retint the same variable names on `body.get-page` (product ink/gold), then keep using `var(--accent)` / `var(--bg)` in components.

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

Accent drives CTAs, links in docs, soft glows, and atmospheric radials. Do not hard-code gold into new **studio** components — use `var(--accent)`. The accent swatch lives in the nav (not a floating viewport control).

### Instagram bio retints (`body.get-page` in each `get.css`)

Same token names as the studio sheet; values are product-scoped so champagne Morning gold never leaks onto a bio, and AURA ivory bronze never leaks onto studio chrome.

| Surface | `--bg` / `--bg-deep` | `--accent` / `--accent-hover` | `--text` / `--muted` | Display face |
|---------|----------------------|-------------------------------|----------------------|--------------|
| `expenses/get/` | studio `#0b0b12` / `#07070c` | `#d9b793` / `#f7e0bd` (champagne-on-obsidian) | `#f7f1e8` / `#c9b8a4` | none — finalized squircle is the mark |
| `aura/get/` | `#f2ede5` / `#eae3d6` (ivory plate trial) | `#ba7f46` / `#e7bb85` (solar-embrace bronze) | `#3d2a18` / `#7a5a38` (bronze ink) | none — Satoshi `.get-brand-name` under the squircle |
| `lumen/get/` | `#fc4177` / `#e22a5f` (magenta plate) | `#edbb55` / `#f7e08a` (star/border enamel gold) | `#f7f1e8` / `#f5c9d6` (cream on magenta); store label ink `#f1eadc` | none — Satoshi `.get-brand-name` under the squircle |

AURA’s bio is currently an **ivory-field trial**: plate cream field with bronze metal accents matching `aura-solar-embrace-ivory.png`. `theme-color` is `#f2ede5`. Revert to dark bronze-on-black at commit `8592488` if the trial fails.

Lumen’s bio uses the same **plate-field** pattern: page field matches the metallic-enamel magenta plate (`#fc4177` → `#e22a5f`), enamel-gold accents, soft gold atmosphere on the plate. `theme-color` is `#fc4177`.

---

## Typography

| Role | Family | Usage |
|------|--------|--------|
| UI / body | **Satoshi** (`--font-sans`) | Nav, buttons, prose, meta, bio lead + store plates + bio brand names |
| Display | **Instrument Serif** (`--font-display`) | Studio heroes, page titles, product headlines |

**Load:** Google Fonts (Instrument Serif) + Fontshare (Satoshi 400–700). Instagram bios load Satoshi only.

Bio brand name (`.get-brand-name`): Satoshi, `1.8rem`, weight 500, `letter-spacing: 0.08em`, under the finalized squircle on Expenses, AURA, and Lumen bios.

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
- Product / policy pages under `expenses/`, `aura/`, or `lumen/` → `../css/`, `../js/`, `../assets/`
- Instagram bio under `expenses/get/`, `aura/get/`, or `lumen/get/` → `../../css/`, `../../assets/` (no `js/`; no nav or footer)

### Page types

| Type | Pattern | Examples |
|------|---------|----------|
| Studio home | `.hero` + wordmark + products grid | `index.html` |
| Studio subpage | `.page-hero` + section(s) | `about.html`, `contact.html` |
| Product marketing | `.product-page-hero` + resources | `expenses/index.html`, `aura/index.html` |
| Policy / support | `.doc-page` inside shell | `privacy.html`, `support.html`, … |
| Invite landing | `.invite-panel.glass` + deep-link JS | `expenses/invite.html` |
| Instagram bio (mark-as-page) | No studio shell. `body.get-page` + `.get` column; wordmark, one line, stacked store buttons. Inherits tokens; product pages may retint accent/ink. Stays unlinked from studio and product nav. | `expenses/get/`, `aura/get/`, `lumen/get/` |

Studio-shell pages (home, subpage, product, policy, invite) use the wrap / nav / footer pattern above. Instagram bios are the exception: Satoshi + `css/styles.css` + local `get.css` only — no Instrument Serif, no `theme.js`, no `main.js`. AURA’s bio is an **ivory-field trial**: plate cream `#f2ede5`, bronze `#ba7f46` / `#e7bb85`, bronze ink text; mark `assets/finalized-icons/aura-solar-embrace-ivory.png`. Store stack on AURA: Play **blocked / Soon** (`.btn-secondary.btn-soon`, CSS `pointer-events: none`, swap the `<span>` for an `<a>` when Open testing has a URL) then App Store **bronze / Beta** (live TestFlight). Expenses stays dark champagne-on-obsidian. Lumen uses the same plate-field pattern as AURA: magenta plate `#fc4177` / `#e22a5f`, richer enamel gold `#edbb55` / `#f7e08a` (star/border) with cream store label ink `#f1eadc`; mark `assets/finalized-icons/lumen-metallic-enamel.png`; both Play and App Store **blocked / Soon**. Do not add these URLs to studio or product navigation.

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
| `.btn-soon` | Disabled look. Studio/product pages: clicks blocked in `main.js`. Bios with no JS — CSS `pointer-events: none` on `body.get-page .btn-soon`. Avoid for live links. |
| `.soon-label` / Beta label | Small muted suffix inside the button (`Soon` on blocked taps; `Beta` on live taps) |

Store CTAs open in a new tab (`target="_blank"` + `rel="noopener noreferrer"`). Bio plates are full-width (`.get-store`, min-height 58px). Live taps keep that new-tab pair; blocked controls are non-link `<span>`s (AURA Play; both Lumen stores).

### Instagram bio column (`.get`)

Phone-width stack (`min(400px, calc(100% - 40px))`) in `100dvh` / `100svh`. Finalized squircle + Satoshi brand name, one muted sentence (`max-width: 34ch`), two full-width store plates (`gap: 12px`), gLitCh Labs credit. No nav, no footer, no theme picker.

- **Expenses:** champagne-on-obsidian squircle fills the mark wrap (`min(240px, 62vw)`); Play `.btn-primary` live; App Store `.btn-secondary` live.
- **AURA:** solar-embrace-ivory squircle same wrap; Play `.btn-secondary.btn-soon`; App Store `.btn-primary` TestFlight.
- **Lumen:** metallic-enamel squircle same wrap on magenta plate field; Play `.btn-primary.btn-soon` (enamel gold + cream ink); App Store `.btn-secondary.btn-soon` (cream glass + gold border), complementary like Expenses.

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
- Bios: mark `rise-logo` at 0.08s; lead then CTAs then credit (credit at 0.58s)
- Respect `prefers-reduced-motion: reduce` (CSS + JS skip reveals)
- Prefer 2–3 intentional motions per page over constant animation

---

## Imagery & assets

| Asset | Typical use |
|-------|-------------|
| `assets/glitchlabs-icon.png` | Favicon, nav, footer |
| `assets/glitchlabs-wordmark.png` | Home hero |
| `assets/expenses-icon.png` | Legacy Expenses mark (prefer finalized) |
| `assets/aura-icon.png` | Legacy AURA compass JPEG (prefer finalized) |
| `assets/lumen-icon.png` | Legacy Lumen mark (prefer finalized) |
| `assets/finalized-icons/expenses-champagne-on-obsidian.png` | Expenses bio + site icon |
| `assets/finalized-icons/aura-solar-embrace-ivory.png` | AURA bio + site icon (active) |
| `assets/finalized-icons/aura-solar-embrace-obsidian.png` | AURA dark alternate |
| `assets/finalized-icons/lumen-metallic-enamel.png` | Lumen bio + site icon |
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

1. Copy shell from an existing page at the same path depth (`contact.html` or `expenses/index.html`). Instagram bio copies `expenses/get/`, `aura/get/`, or `lumen/get/`, not a studio-shell page.
2. Include fonts + `styles.css` + `theme.js` + `main.js`. Instagram bio: Satoshi + `styles.css` + `get.css` only.
3. Use CSS variables — no one-off hex for accent/text/bg on studio-shell pages. Bios retint those variables on `body.get-page`, then keep using the vars.
4. Pick the right page type (hero / product / doc / invite / Instagram bio).
5. If under `expenses/`, `aura/`, or `lumen/` and using the studio shell, use brand lockup + product crumb. Skip the shell entirely for `expenses/get/`, `aura/get/`, and `lumen/get/`.
6. Do not move or rename store-linked HTML files.
7. Smoke-test mobile nav and reduced-motion (bio page: reduced-motion only; there is no nav).
8. Never link `expenses/get/`, `aura/get/`, or `lumen/get/` from studio or product navigation.

---

## File map

| Path | Role |
|------|------|
| `css/styles.css` | Tokens, components, layout |
| `js/theme.js` | Accent themes + picker |
| `js/main.js` | Nav, year, reveals, contact mailto, soon-button guard |
| `assets/` | Studio + product imagery |
| `expenses/*`, `aura/*`, `lumen/*` | Product + store-facing pages |
| `expenses/get/` | Instagram bio landing — inherits `css/styles.css` tokens; layout in `get.css`; unlinked from nav |
| `aura/get/` | AURA Instagram bio — ivory-field trial (plate `#f2ede5`, bronze `#ba7f46`); Satoshi brand name; mark `assets/finalized-icons/aura-solar-embrace-ivory.png`; Play blocked until Open testing; TestFlight live; unlinked from nav |
| `lumen/get/` | Lumen Instagram bio — magenta plate field `#fc4177` / `#e22a5f`, enamel gold `#edbb55` / `#f7e08a` with cream store ink `#f1eadc` (AURA plate-field pattern); Satoshi brand name; mark `assets/finalized-icons/lumen-metallic-enamel.png`; Play and App Store both blocked until listing URLs exist; unlinked from nav |

When the visual system changes, update **this file** and the CSS tokens together.
