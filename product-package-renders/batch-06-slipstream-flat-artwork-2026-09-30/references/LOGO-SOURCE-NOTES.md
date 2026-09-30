# TRAYN Nutrition logo kit

A clean vector reconstruction of the existing website identity: angular T, custom TRAYN lettering and NUTRITION descriptor. This is a refined redraw from the website raster, not a recovered original vector file. The descriptor uses solid Montserrat Bold converted to vector paths.

## Choose a file

- **SVG:** scalable, editable path masters for websites, packaging and design software. No installed fonts needed. Import into Illustrator, Figma or Inkscape.
- **PNG:** transparent exports at 1024 and 4096 pixels wide for presentations, social graphics and software that cannot accept SVG.
- **PDF:** four single-page, K-only black vector masters for print workflows. The separate proof PDF is a presentation sheet.
- **Icons:** square white-on-dark symbol in common app-icon sizes; red SVG favicon and multi-size ICO.

Every SVG/PNG layout comes in black, white, red and silver: stacked, horizontal, wordmark and symbol. Use stacked as the primary identity, horizontal where height is limited, and symbol for avatars and small placements.

## Use consistently

- Keep the original proportions. Do not stretch, rotate or add shadows.
- Maintain clear space at least half the height of the TRAYN capital letters around full logos; for the symbol alone, allow at least one fifth of its height.
- Starting minimum screen widths: stacked 180 px, horizontal 280 px, wordmark 180 px. Check the NUTRITION descriptor at actual size. Use the standalone symbol when the descriptor becomes unreadable.
- Black: #111111. White: #FFFFFF. Accent red: #E84938. Silver is the primary hero finish: individual metallic reflections, irregular fine vector brush texture, highlighted edges and a solid bold NUTRITION descriptor. Use it on dark backgrounds. It is a digital metallic simulation, not metallic ink.
- Use flat black or white for one-colour printing, engraving or embroidery. Have the fabricator check minimum line and gap widths for their process.
- SVG and PNG use RGB colours. Print PDFs use 100% process black. PDF files are not PDF/X-certified; obtain the printer's required colour profile and production proof before a print run. Physical PDF page size is an artwork canvas, not a prescribed logo size.

## Files and rebuild

`svg/` contains 16 masters; `png/` contains 32 transparent exports; `pdf/` contains four masters and one proof; `preview/` contains the visual proof. `icons/` contains square exports and favicons.

`source/geometry.json` stores the outlined geometry. `source/build_logo.py` rebuilds SVG and PDF with Python, fontTools and reportlab. `source/build_silver.py` applies the silver hero finish after the shared geometry is rebuilt. `source/export_png.cjs` exports PNGs and square icons with Node.js and sharp. The descriptor font and its SIL Open Font License are included in `source/`. All delivered logo masters already contain paths and require no fonts.

No existing website logo references have been replaced by this kit.

## Silver revision

The silver masters have been revised against the original website artwork. The original 655 × 365 website PNG is preserved unchanged in `reference/website-original-silver.png` for exact visual reference; it is not a high-resolution master. `preview/silver-hero.png` shows the revised scalable treatment on black. The silver SVGs have no embedded raster images or font dependencies.

The latest revision follows the supplied comparison image: increased symbol-to-wordmark spacing, a wider and heavier solid subtitle, and distinct reflections for each letter (including the bright lower-left face of A). This remains a vector reconstruction, not an exact recovery of the original artwork.

The sharpened silver revision adds narrow inset bevels, brighter edge reflections, deeper shadows and denser fine grain. The bold subtitle is retained. `preview/silver-before-sharpening.png` preserves the previous treatment for comparison.
