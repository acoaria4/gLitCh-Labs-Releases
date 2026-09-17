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

Select **AURA** in the brand picker, then choose a reading date and **Day-specific** or **General · AURA ivory**, then select **Create horoscope**. This produces a 1080 × 1350 PNG-ready canvas with all 12 Moon-sign summaries from AURA. Existing canvas content is replaced only after a complete, date-matched edition renders successfully. The usual Save and Download PNG controls work; horoscope filenames include the reading date.

The date defaults to today in Asia/Kolkata. Day-specific colors follow the selected date: Sunday gold, Monday pearl, Tuesday terracotta, Wednesday sage, Thursday saffron, Friday rose, Saturday indigo. General always uses the original ivory/bronze palette. These are editorial color choices, not API predictions.

API: `https://aura-glitchlabs.fly.dev/api/horoscopes/daily?date=YYYY-MM-DD&lang=en`. The composer uses each reading's `summary` verbatim, preserves the Moon-sign context and API disclaimer, and checks that all 12 unique signs and the requested date are present. No generated/sample fallback is used on errors. Longer summaries cause an explicit layout error rather than silent text truncation.

The AURA server must allow the hosting origin through `CORS_ORIGINS`, including `https://acoaria4.github.io` for GitHub Pages and the chosen local preview origin (for example `http://127.0.0.1:8088`). No API secrets are stored in this static website.

The AURA panel checks the daily endpoint when selected. Its small status indicator shows Checking API, Working after a validated response, Waiting for API to cold start after 3 seconds without a response, and API not working after a failure or 60-second timeout. The waiting label indicates a possible cold start, not a server-confirmed diagnosis. Selecting AURA again or creating a horoscope retries the check.
