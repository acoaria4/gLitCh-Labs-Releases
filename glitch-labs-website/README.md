# gLitCh Labs — glitch-labs-website

A standalone static website. All implementation and assets are contained in this folder. No build or install required. Product links open the individual pages in `expenses/`, `aura/`, and `lumen/`. About, support, and privacy links point to the existing public site. Store links and availability follow the root `/get` reference pages. Product colors live in `product-themes.css`.

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

`navigation.css` shares readable header/footer typography and 44px touch targets across the site. Mobile navigation uses two rows so all main links remain visible. On the main site, Arrow Up/Down and Page Up/Down move one section per press; Home/End select the first/last section. Held-key repeats are ignored. Previous/Next buttons offer the same behavior on touchscreens. Native touch/wheel scrolling remains available within longer sections. Reduced-motion users receive immediate section jumps. Supporting pages retain normal document scrolling.
