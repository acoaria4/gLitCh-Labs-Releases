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

The shared renderer (`js/horoscope-template.js`) uses the approved centered layout: equal 180 px side margins, two columns of 350 × 196 px cards, and six rows from y=400 to y=1636. Clean local celestial backgrounds match each day; gold emblems, ivory cards, Tamil Rasi names or English transliterations, and localized dates are rendered separately. Name accents are muted bronze, slate blue, clay, forest sage, ochre, dusty rose, or plum, with at least 4.5:1 contrast against the cards. These margins were checked against a simulated Reel view based on the supplied screenshot; Instagram displays and overlays can vary.

**Reading text size** (18–36 px, default 30) and **Reading text weight** (Regular 400, Semibold 600, Bold 700; default Semibold) affect all twelve reading paragraphs together. Select **Create horoscope** to apply. Sign names, title, and date retain their own styling. Controls and manual drafts survive source, date, language, brand, and color changes during the current page session. Existing saved flattened images are unchanged.

Text uses self-hosted Noto Sans Tamil or DM Sans; fonts are loaded at the requested weight before measurement. Tamil wrapping respects grapheme boundaries. There is no per-sign shrinking or automatic rewriting. A reading that exceeds its card produces an error naming the Rasi and suggesting a smaller shared size or shorter reading; the existing canvas is preserved. Blank horoscope templates need no API connection.

The API must allow the site's origin through its CORS configuration. In API mode, the status indicator checks the chosen language, reports a possible cold start after three seconds, and times out after sixty seconds.

With a local server on port 8088 and Playwright available through `NODE_PATH`:

- `node social-composer/scripts/test-horoscope.cjs` checks shared size and weight across all signs, input validation, accessible name contrast, long Tamil readings at 18 px, manual defaults, draft retention, API failures/cancellation, both languages, all backgrounds, blanks, dimensions, PNG export, overflow handling, and mobile width using mocked API responses.
- `node social-composer/scripts/render-horoscope.cjs` exports Tamil editorial samples and blanks for all eight backgrounds, with a comparison sheet and phone-sized/simulated Reels previews. Set `HOROSCOPE_LANGUAGE=en` for English. These samples are illustrative layout previews, not live forecasts. Pass `HOROSCOPE_DATA=/path/to/api-response.json` to render a saved actual Tamil or English API edition instead; optional `readingFontSize` and `readingFontWeight` fields set the shared typography for that export.

Exports are local review artifacts under `exports/daily-horoscope/` and are not committed.
