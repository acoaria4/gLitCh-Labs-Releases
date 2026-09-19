# Performance verification — 19 September 2026

The public homepage, product pages, get pages, and supporting pages now use verified lossless assets in `assets/optimized/`. Source artwork and Social Composer are unchanged. The site remains plain static files served from the repository root.

## Asset savings

| Unique primary assets | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Four full-resolution icons | 7,379,488 B | 4,899,824 B | 33.6% |
| Fifteen font faces | 1,636,688 B | 463,504 B | 71.7% |

Generated CSS and JavaScript also receive conservative minification. These totals measure unique primary assets, not the whole repository: originals and PNG favicon fallbacks remain on disk. Original and optimized icons decode to exactly the same RGBA pixels and preserve their dimensions and color profiles. WOFF2 conversion preserves glyphs, character maps, outlines, and metrics.

## Controlled homepage comparison

Three fresh-cache Chrome runs per version, 390 × 844 at 2× density, 80 ms latency, 8 Mbps download, and 4× CPU slowdown. Both versions were served with the same local Python HTTP server, without HTTP compression.

| Metric | Baseline median | Optimized median |
| --- | ---: | ---: |
| Resource transfer bytes | 8,352,933 B | 5,620,587 B |
| Resource requests | 23 | 23 |
| Largest Contentful Paint | 6.720 s | 4.156 s |
| First Contentful Paint | 0.360 s | 0.452 s |
| Load event | 6.735 s | 4.099 s |
| Cumulative Layout Shift | 0.000573 | 0.000045 |

Resource bytes fell 32.7%; median LCP improved 38.2%. FCP was 92 ms slower in this sample, while the main content finished substantially earlier. These are local lab measurements, not a Lighthouse score or a promise about production devices. Resource Timing totals exclude HTML and browser-internal favicon requests.

## Appearance and behavior

- Compared 56 before/after screenshots: every public page at desktop and high-density mobile sizes, plus every homepage scene at 320 × 568 and high-density 768 × 1024.
- Layout and typography remain unchanged. Chrome's PNG/WebP rendering and compositing produced small rasterization differences; the worst screenshot's mean channel difference was below 0.15 on a 0–255 scale. This is not a claim of byte-identical screenshots.
- No horizontal overflow, missing assets, or JavaScript errors in the capture pass.
- Verified arrow-key navigation, Home/End, rapid section-button presses, decoded artwork at section arrival, reduced motion, user pause persistence, and hidden/offscreen animation suspension.
- The existing page check validates all 20 HTML pages, local links and anchors, and unchanged privacy wording.
- Rebuilding pages in an isolated copy reproduced the optimized HTML exactly. All 147 original asset and Social Composer files matched their pre-change hashes; public text and navigation/store links matched the baseline.

No deployment was performed. Rebuild commands and browser-check instructions are in README.md.
