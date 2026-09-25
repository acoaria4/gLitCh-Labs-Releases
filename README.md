# gLitCh Labs — Website

A standalone static website. All implementation and assets are contained in this folder. No build or install required. Product links open the individual pages in `expenses/`, `aura/`, and `lumen/`. About, support, and privacy pages are hosted locally within this site. Store links and availability were copied from the previous site’s `/get` pages. Product colors live in `product-themes.css`.

Preview: open `index.html` directly, or run `python3 -m http.server 8088` from this folder and visit http://localhost:8088.

## Hero video

The cinematic logo treatment works without video. To add your exported background:

1. Save the video as `assets/hero.mp4`.
2. In `index.html`, change the video element's `data-src=""` to `data-src="assets/hero.mp4"`.

The video is decorative, muted, looping, and covered to fill the hero. The existing logo and text remain overlaid; generate a background without a second logo. Playback pauses offscreen, in a hidden tab, and when the visitor pauses motion. Reduced-motion preferences default to paused. If the video fails, the original background remains. Export a short, compressed H.264 MP4; a landscape composition with a clear central area also accommodates mobile cropping.

See `RUNWAY-PROMPT.md` for the creative brief.

## Shared product identity

`typography.css` owns font families, product-name scale, heading styles, and accented dots for **both** homepage sections and individual product pages. `product-themes.css` owns the matching palettes and buttons. Change these shared files to update an identity everywhere; avoid page-specific identity overrides.

- Expenses: Manrope, champagne on charcoal.
- AURA: Cormorant Garamond headings, DM Sans body, bronze on ivory.
- Lumen: Outfit, dark plum text on pale blush (#F8E7ED), icon-pink (#FC4177) action buttons with white text, and gold product-name dots.

Fonts are self-hosted in `assets/fonts/`, with open-source licenses included. No font-provider request is needed at runtime.

## Supporting pages

Each product has local privacy, support, and `/get/` pages. Expenses also has account deletion and group invitations. AURA and Lumen have data-control pages. Studio About and Contact are local too.

Edit supporting-page copy in `content/<product>/`, then run `python3 scripts/build-pages.py` from this folder. The builder reuses the shared shell and regenerates `/get/` pages from each product landing page's download controls. It never writes outside this folder. Privacy wording and original dates were preserved from the reference files; support and data-control copy follows those policies. No new legal terms or data-processing promises were added.

Run `python3 scripts/check-pages.py` to check local destinations, anchors, assets, page headings, and that generated policies preserve their content source.

Invite links accept `?t=...` or `?token=...` and open the Expenses deep link only when the visitor selects Open in Expenses. Missing-token links show an explanation without an active app link.

## Navigation and scrolling

`navigation.css` shares readable header/footer typography and 44px touch targets across the site. Mobile navigation uses two rows so all main links remain visible. On the main site, Arrow Up/Down and Page Up/Down move one section per press; Home/End select the first/last section. Held-key repeats are ignored. Previous/Next buttons offer the same behavior on touchscreens. Native touch and wheel scrolling are handled by the browser, including within taller sections. The scrolling runtime is restored exactly from a7bd58a (2.1.0-titaniumBookends). Reduced-motion users receive immediate section jumps. Supporting pages retain normal document scrolling.

## GitHub Pages and local archives

The repository root is the live website source. GitHub Pages is configured to deploy the `main` branch at `/` (root). `.nojekyll` serves this as plain static files. Publish by committing the root changes and merging/pushing them to `main`.

- `old_main_website/` preserves the previous root website and its supporting files.
- `glitch-labs-website/` preserves the pre-promotion copy of the new site.

Both directories are local, ignored backups and must remain untracked. Make ongoing changes at root; the backups are snapshots, not synchronized copies. Repository metadata and editor configuration remain at root. The Google verification file retains its original root URL.

## Social Composer

Social Composer now lives in its own repository. `social-composer-old.zip` at the repo root is a local archive of the copy that shipped here. It is gitignored and is not part of the published site.

## Lossless performance build

The published pages load content-hashed files from `assets/optimized/`. Original icons and font files remain read-only inputs. No files in icon archives (including `finalized icons`) or store listings are processed. No runtime packages or hosting changes are required.

To rebuild after editing the readable root CSS/JavaScript or replacing a source asset:

```sh
python3 -m venv .cache/performance-venv
.cache/performance-venv/bin/pip install -r scripts/requirements-performance.txt
.cache/performance-venv/bin/python scripts/optimize-assets.py
.cache/performance-venv/bin/python scripts/check-optimized.py
python3 scripts/check-pages.py
```

Use the same Python environment for `scripts/build-pages.py`; it restores source references before regenerating pages, then automatically optimizes the results. Generated files are committed alongside the HTML, so GitHub Pages continues serving the repository root. Never edit generated minified files directly.

The optimizer compares original/optimized PNG and lossless WebP sizes and verifies exact decoded RGBA pixels, dimensions, and ICC profiles. PNG favicon copies retain compatibility; page images use the smaller verified format. Fonts retain character coverage, outlines, and metrics in WOFF2. CSS and ancillary JavaScript are conservatively minified. The homepage scrolling script is deliberately copied without minification or any other transformation; its hashed output must be byte-identical to the restored source. The manifest records source/output hashes, sizes, savings, and PNG fallbacks. Stale hashed outputs owned by the optimizer are removed on rebuild.

For browser checks, install Playwright in a local tool environment and make it available through `NODE_PATH` (Chrome must be installed). Serve the site on port 8088:

```sh
node scripts/test-performance.cjs
node scripts/measure-performance.cjs http://127.0.0.1:8088 .cache/performance-results.json
```

`SITE_URL` overrides the interaction-test address. The measurement script runs three fresh-cache Chrome loads at 390 × 844, 2× pixel density, 80 ms network latency, 8 Mbps download, and 4× CPU slowdown. It records resource transfer bytes, request counts, FCP, LCP, CLS, and load time. Resource Timing totals exclude HTML and browser-internal favicon requests; these are local comparisons, not production field measurements.

For visual comparison, serve a baseline snapshot on port 8089 and the working site on 8088, then run `node scripts/capture-performance-visuals.cjs`. Captures go to `.cache/performance-visuals/` or `CAPTURE_DIR`. See `performance-report.md` for this optimization's measured results.

### Scrolling restoration checks

The homepage runtime and base CSS were restored from `a7bd58a`, before the performance upgrade. There are no application-level wheel/touch interceptors or new resize realignment handlers. The optimizer keeps an unminified, content-hashed runtime copy, and `check-optimized.py` verifies it matches the source exactly.

To compare against the reference, serve a checkout or snapshot of that revision on port 8090 and this site on port 8088. Install Python Playwright and its test browsers, then run:

```sh
python -m pip install playwright==1.60.0
python -m playwright install webkit firefox
BROWSERS=chromium,webkit python scripts/test-snap-scroll.py
python scripts/test-snap-touch.py
BROWSERS=firefox python scripts/test-snap-scroll.py
```

`SITE_URL` and `REFERENCE_URL` override those addresses. These tests compare native scrolling outcomes with the reference; they do not impose a custom one-gesture-per-section rule. Browser simulations cannot establish that scrolling feels correct on every physical device. Firefox startup was previously blocked by this host's sandbox/graphics environment; a failed launch is not a passing browser check.

Restoration verification: all six reference-comparison viewports passed in Chrome and WebKit, and all four native Chromium touch comparisons passed. The separately attempted Firefox launch failed with a local sandbox/graphics startup error; Firefox behavior remains unverified here. Source and served runtime bytes match `a7bd58a`, as do the source scrolling/layout stylesheets.
