# Social Composer

Self-contained brand assets for the current gLitCh Labs website. Serve this repository and open `/social-composer/`.

- `brands/current/*-icon.png` are unmodified copies of the root site's four current icons.
- `*-mark.png` extracts the metallic foreground: Expenses monogram, AURA symbol, Lumen's central spark, and the studio dot cluster.
- Light/dark wordmarks and icon/name lockups use the site's Manrope, Cormorant Garamond, and Outfit fonts with accented dots.
- `assets/fonts/` contains copied self-hosted fonts and their OFL licenses. The interface uses Manrope and DM Sans.
- Existing saved asset identifiers resolve to the current artwork. Browser saves, uploads, placement, tinting, and PNG export remain local.

To regenerate derived artwork after updating the local icon copies, run `node social-composer/scripts/build-assets.cjs` with Playwright available through `NODE_PATH` and Chrome installed. Start the local site at port 8088, or set `COMPOSER_URL` to the composer URL. Outputs stay in `brands/current/`. No original site images are changed.

The older files under `brands/` are no longer referenced by the composer.
