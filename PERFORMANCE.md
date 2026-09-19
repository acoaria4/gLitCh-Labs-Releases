# gLitCh Labs load and responsiveness

Homepage first-view payload is about **4.8 MB**. Nearly all of it is 1254×1254 PNGs and uncompressed TTF fonts. JavaScript is 5 KB and is not the bottleneck.

Measured 18 Sep 2026 against the local static site at `http://127.0.0.1:8088/`.

| Metric | Value |
| --- | --- |
| Homepage first-view transfer | 4.8 MB |
| Four source PNGs on disk | 7.2 MB |
| 15 self-hosted TTF files | 1.6 MB |
| Realistic first-view target | ~0.4 MB |

## Homepage first view by category

Local decoded / transferred total: **4.8 MB**.

| Category | Size | Share of first view |
| --- | ---: | ---: |
| Product and hero PNGs | 3.6 MB | 75% |
| 12 font files requested immediately | 1.1 MB | 24% |
| HTML, CSS, JS | ~50 KB | 1% |

## Current vs after the work below

Values are kilobytes for a cold homepage view before scrolling to AURA and Lumen. After-work numbers assume WebP at display size, WOFF2 Latin files, and lazy-loading the Expenses art.

| Category | Current first view (KB) | After recommended work (KB) |
| --- | ---: | ---: |
| Images | 3,573 | 150 |
| Fonts | 1,137 | 180 |
| CSS / JS / HTML | 49 | 40 |

Source: resource timing on the local homepage, 18 Sep 2026. Target is an estimate from typical WebP and WOFF2 sizes at the sizes this layout actually paints (32–470 px), not a Lighthouse run.

> **The 19-second local `loadEvent` is inflated.** Python’s single-threaded `http.server` serialized 21 requests and stalled on Manrope 400 (`font-8.ttf`) for ~19 s. GitHub Pages will multiplex those files, but it still has to send ~4.8 MB on first view, then another ~3.6 MB when AURA and Lumen images lazy-load. Bytes, not the preview server, are the production problem.

## What to change, in order

| Priority | Change | Why it matters | Expected effect |
| ---: | --- | --- | --- |
| 1 | Ship display-sized WebP/AVIF plus a tiny favicon | `glitchlabs`, `expenses`, `aura`, and `lumen` are 1254×1254 PNGs (1.6–2.1 MB each) painted at 32–470 px | Image payload ~7.2 MB → ~200–400 KB; much cheaper decode and scroll |
| 2 | Re-fetch fonts as WOFF2; drop unused weights | `fetch-fonts.py` uses `User-Agent: Mozilla/5.0`, so Google returns TTF. Homepage requested 12 faces at once | Font payload ~1.6 MB → ~150–250 KB; fewer connections |
| 3 | Lazy-load Expenses art; stop using app icons as favicons | `expenses.png` is eager on the homepage. Every product page uses the 1.8 MB PNG as a 32 px icon | Saves ~1.8 MB on first homepage paint and on every product/document page |
| 4 | Make offscreen work cheap | Hero `float` animates a drop-shadowed full-res bitmap. Product scenes still layout and may download fonts while offscreen | Smoother section snaps; later typefaces load only when their scene is near |
| 5 | One CSS file and one heading preload | Homepage has six render-blocking stylesheets. No font is preloaded, so the title swaps late | Faster first paint; less heading flash with `font-display: swap` |

## Evidence from this homepage

### Images are decoded far larger than they appear

| Use | Painted size | File |
| --- | --- | --- |
| Favicon / nav / footer | 32×32 | `glitchlabs.png` · 1.8 MB · 1254² |
| Hero emblem (`fetchpriority=high`) | 300×300 | same file |
| Expenses art (eager) | 425×425 | `expenses.png` · 1.8 MB · 1254² |
| AURA / Lumen art (lazy) | 425×425 | 1.6 MB and 2.1 MB |
| Expenses landing icon + favicon | 470×470 and 32×32 | same 1.8 MB PNG |

Each 1254² PNG decodes to about 6.3 MB of RGBA. Two eager images already hold ~12 MB of bitmaps before the visitor leaves the hero.

### Fonts loaded on first paint

12 files downloaded for this view:

- Cormorant Garamond 500, 600 — 284 KB TTF each
- DM Sans 400–700 — four 47 KB files
- Manrope 400–600 — three ~93 KB files
- Outfit 400–600 — three 47 KB files

Unused on this view: Cormorant 400, Manrope 700, Outfit 700. Product pages only need their own family, but `fonts.css` still declares all 15 faces.

## How to implement without a build step

The site is static HTML on GitHub Pages. Keep that. Add a couple of asset scripts next to `scripts/fetch-fonts.py` instead of introducing a bundler.

### 1. Images

Export each mark at 512 and **768–940 px** as high-quality WebP (keep a PNG fallback). Use a 32 px PNG or SVG for favicons — never the 1254 px art. 256 px is too small for 2× screens; see overshooting below.

On the homepage:

- Hero and in-view Expenses art get `srcset` / `sizes`.
- `fetchpriority="high"` only on the hero.
- AURA, Lumen, and Expenses below the fold get `loading="lazy"` and `decoding="async"`.
- Product landings can use the 768 px WebP for the large icon and the 32 px file for the header and favicon.

### 2. Fonts

Change `scripts/fetch-fonts.py` to send a Chrome user-agent so Google Fonts returns WOFF2, keep the Latin `unicode-range` filter, and write `format("woff2")`. Drop unused faces only. Keep 700 where the UI uses it (the header brand is `font-weight: 700` in `navigation.css`).

Split `fonts.css` into family sheets (`fonts-manrope.css`, and so on) so Expenses does not download Cormorant or Outfit. Preload only Manrope 500 on the homepage and the product display face on each landing.

### 3. Responsiveness after bytes shrink

Two CSS animations were running on the hero (`float` on the emblem, `light` on a blurred beam). That is fine once the bitmap is small. Keep motion, but make it cheap:

- Put the drop-shadow on a static wrapper and animate `transform` only — only if the wrapper matches the mark’s silhouette.
- Add `content-visibility: auto` plus `contain-intrinsic-size` on `.scene` so offscreen product sections skip layout and delay their typefaces. Size the intrinsic box to the real scene height or scroll-snap will jump.
- Pause hero motion when `#home` is offscreen (the video already pauses). This does not change what visitors see.
- Leave `background-attachment: fixed` on product pages unless you explicitly want the wash to scroll with the copy. That is a look change, not a load-time must.

## Where overshooting changes the look

Done carefully, the work above should not change visual appeal. These are the places it can, if pushed too far.

| Marker | Safe | Overshoot |
| --- | --- | --- |
| Image size | 768–940 px WebP at high quality for marks painted up to ~470 px CSS (2× screens need ~850 px) | 256 px, or a crushed WebP — hero and product marks go soft |
| Font weight 700 | Drop unused faces (Cormorant 400, Outfit 700, unused 400s). Keep 700 for families the header brand uses | Removing all 700 files — the browser fakes bold from 600 and the wordmark looks muddy |
| Product-page wash | Leave `background-attachment: fixed` | Removing it — the gradient scrolls with the page instead of staying pinned |
| `content-visibility` on `.scene` | Set `contain-intrinsic-size` to the real section height | Wrong guess — scroll-snap jumps when a scene enters view |
| Drop-shadow on a wrapper | Wrapper follows the icon silhouette, then animate `transform` only | A rectangular wrapper — the glow becomes a box instead of a mark-shaped shadow |
| Motion | Pause hero `float` / `light` only while `#home` is offscreen | Stripping beams, float, or glows — that is atmosphere, not payload |

Keep the beams, float, glows, and type. Compress and size assets; do not strip the atmosphere. The only recommendation that is optional for look is dropping `background-attachment: fixed`.

### 4. CSS delivery

Concatenate `styles.css`, `product-themes.css`, `typography.css`, `navigation.css`, `mobile.css`, and the needed font sheet into one file, or inline the hero-critical rules in `index.html` and load the rest with `media="print"` then swap to `all`. Six stylesheets are not huge (~36 KB) but they still block first paint as six round trips.

## What not to chase first

**script.js.** 5 KB, deferred. The IntersectionObserver work is cheap next to image decode. Tighten thresholds later if you want, not first.

**Hero video.** `data-src` is empty, so nothing downloads. When you add `assets/hero.mp4`, keep it a short compressed H.264 file with `preload` unset. The current lazy path is already the right shape.

**A framework or CDN.** GitHub Pages plus smaller files is enough. A React/Vite rewrite would not beat resizing four PNGs and serving WOFF2.

---

First-view current: 4,759 KB measured (`glitchlabs` + `expenses` PNGs, 12 TTF files, CSS/JS/HTML). Image source total 7,207 KB. Font source total 1,598 KB. Target ~370 KB is 768–940 px WebP plus Latin WOFF2 plus lazy Expenses art. Social Composer was not profiled.
