# Social Composer

Self-contained brand assets for the current gLitCh Labs website. Serve this repository and open `/social-composer/`.

- `brands/current/*-icon.png` are unmodified copies of the root site's four current icons.
- `*-mark.png` extracts the metallic foreground: Expenses monogram, AURA symbol, Lumen's central spark, and the studio dot cluster.
- Light/dark wordmarks and icon/name lockups use the site's Manrope, Cormorant Garamond, and Outfit fonts with accented dots.
- `assets/fonts/` contains copied self-hosted fonts and their OFL licenses. The interface uses Manrope and DM Sans.
- Existing saved asset identifiers resolve to the current artwork. Browser saves, uploads, placement, tinting, and PNG export remain local.

To regenerate derived artwork after updating the local icon copies, run `node social-composer/scripts/build-assets.cjs` with Playwright available through `NODE_PATH` and Chrome installed. Start the local site at port 8088, or set `COMPOSER_URL` to the composer URL. Outputs stay in `brands/current/`. No original site images are changed.

The older files under `brands/` are no longer referenced by the composer.

## Daily horoscope posts

Select **AURA**, choose **தமிழ் · Tamil** (default) or **English**, a reading date, and a background. **Create horoscope** fetches the selected language directly from AURA and produces a 1080 × 1920 (9:16) canvas. Save and Download PNG use the normal composer controls.

All eight backgrounds are always available in either language: No tint (ivory), Sunday warm gold, Monday moon pearl, Tuesday terracotta, Wednesday sage, Thursday saffron, Friday rose, and Saturday lavender. Automatic follows the selected date in Asia/Kolkata. These are editorial tints, independent of the readings.

API: `https://aura-glitchlabs.fly.dev/api/horoscopes/daily?date=YYYY-MM-DD&lang=ta` (or `lang=en`). Summaries are used unchanged. The requested language, date, timezone, all twelve unique signs, and reading context are validated before replacing the canvas. Failed requests never fall back to invented or translated readings. Changing language or date cancels stale requests. The API disclaimer appears below the controls; the artwork has no footer text.

The shared renderer (`js/horoscope-template.js`) uses local gold-emblem artwork, Tamil Rasi names or their English transliterations, localized dates, and self-hosted Noto Sans Tamil with its OFL license. Tamil wrapping respects grapheme boundaries. Overlong summaries produce an explicit error instead of being clipped. Blank horoscope template needs no API connection.

The API must allow the site's origin through its CORS configuration. The status indicator checks the chosen language, reports a possible cold start after three seconds, and times out after sixty seconds.

With a local server on port 8088 and Playwright available through `NODE_PATH`:

- `node social-composer/scripts/test-horoscope.cjs` checks both languages, all tints, blank templates, dimensions, PNG export, overflow handling, and mobile width using mocked API responses.
- `node social-composer/scripts/render-horoscope.cjs` exports English editorial samples and blanks for all eight backgrounds. These samples are layout previews, not live forecasts. Pass `HOROSCOPE_DATA=/path/to/api-response.json` to render a saved actual Tamil or English API edition instead.

Exports are local review artifacts under `exports/daily-horoscope/` and are not committed.
