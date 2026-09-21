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

Select **AURA** and choose **Manual entry** (default) or **Fetch from AURA API**. Manual entry provides twelve labelled reading fields; paste one reading per sign, then select **Create horoscope**. All fields are required. Manual mode makes no API requests, and drafts survive source, brand, date, language, and color changes during the current page session (not a reload). API results never overwrite these drafts.

Choose **தமிழ் · Tamil** (default) or **English**, a reading date, and a background. API mode fetches the selected language directly from AURA. Both modes produce one 1080 × 1920 (9:16) canvas. Save and Download PNG use the normal composer controls.

All eight backgrounds are always available in either language: No tint (ivory), Sunday warm gold, Monday moon pearl, Tuesday terracotta, Wednesday sage, Thursday saffron, Friday rose, and Saturday lavender. Automatic follows the selected date in Asia/Kolkata. These are editorial tints, independent of the readings.

API: `https://aura-glitchlabs.fly.dev/api/horoscopes/daily?date=YYYY-MM-DD&lang=ta` (or `lang=en`). Summaries are used unchanged. The requested language, date, timezone, all twelve unique signs, and reading context are validated before replacing the canvas. Failed requests never fall back to invented or translated readings. Changing source, language, date, or color cancels stale requests and prevents late results from replacing the canvas. The API disclaimer appears below the controls; the artwork has no footer text.

The shared renderer (`js/horoscope-template.js`) uses local gold-emblem artwork, Tamil Rasi names or their English transliterations, localized dates, and self-hosted Noto Sans Tamil with its OFL license. Compact emblems sit beside sign names, leaving a full-width reading area below. Tamil wrapping respects grapheme boundaries and text never shrinks below 20 px. Overlong summaries produce an explicit error instead of being clipped. Blank horoscope template needs no API connection.

The API must allow the site's origin through its CORS configuration. In API mode, the status indicator checks the chosen language, reports a possible cold start after three seconds, and times out after sixty seconds.

With a local server on port 8088 and Playwright available through `NODE_PATH`:

- `node social-composer/scripts/test-horoscope.cjs` checks the manual default, Tamil sample, empty and overlong readings, draft retention, API failures and cancellation, both languages, all tints, blank templates, dimensions, PNG export, overflow handling, and mobile width using mocked API responses.
- `node social-composer/scripts/render-horoscope.cjs` exports English editorial samples and blanks for all eight backgrounds. These samples are layout previews, not live forecasts. Pass `HOROSCOPE_DATA=/path/to/api-response.json` to render a saved actual Tamil or English API edition instead.

Exports are local review artifacts under `exports/daily-horoscope/` and are not committed.
