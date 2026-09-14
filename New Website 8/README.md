# gLitCh Labs — New Website 8

A standalone static website. All implementation and assets are contained in this folder. No build or install required. Product links open the individual pages in `expenses/`, `aura/`, and `lumen/`. About, support, and privacy links point to the existing public site. Store links and availability follow the root `/get` reference pages. Product colors live in `product-themes.css`.

Preview: open `index.html` directly, or run `python3 -m http.server 8088` from this folder and visit http://localhost:8088.

## Hero video

The cinematic logo treatment works without video. To add your exported background:

1. Save the video as `assets/hero.mp4`.
2. In `index.html`, change the video element's `data-src=""` to `data-src="assets/hero.mp4"`.

The video is decorative, muted, looping, and covered to fill the hero. The existing logo and text remain overlaid; generate a background without a second logo. Playback pauses offscreen, in a hidden tab, and when the visitor pauses motion. Reduced-motion preferences default to paused. If the video fails, the original background remains. Export a short, compressed H.264 MP4; a landscape composition with a clear central area also accommodates mobile cropping.

See `RUNWAY-PROMPT.md` for the creative brief.
