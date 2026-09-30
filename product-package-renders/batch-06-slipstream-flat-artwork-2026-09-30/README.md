# Slipstream flat front artwork — updated printer handoff

Batch 06 adds a vector recreation of the selected silver-type Slipstream concept.
This is an editable FRONT-PANEL DRAFT, not a native CDR, a pouch dieline, or
approved production artwork. Original renders and earlier handoffs are retained.

## Files to use

- artwork/slipstream-front-outlined.svg — preferred font-independent import:
  outlined text, vector logo, red/silver ribbon paths, background and named groups.
- artwork/slipstream-front-editable-text.svg — same front with editable product
  text. Install the supplied fonts before opening. Logo lettering stays outlined.
- artwork/slipstream-ribbons.svg — isolated vector ribbon artwork, transparent
  background. Uses the same 800 × 1200 reference canvas as the complete front.
- artwork/slipstream-front-proof.pdf — single-page vector visual proof; no raster
  images, not PDF/X-certified. Import as curves when retaining letter appearance.
- artwork/slipstream-front-preview.png — 1600 × 2400 visual preview only.
- fonts/ — Big Shoulders Bold and Montserrat Bold/Regular with SIL OFL licenses.
- references/ — selected concept, approved raster logo reference, reconstructed
  vector logo, black SVG/PDF logo masters and original kit notes.
- front-label-copy.txt — editable text for owner review, with concept-only footer
  explicitly identified. This is not complete or approved consumer label copy.
- source/layout.json — text positions, type choices and ribbon Bezier geometry.
- source/build-flat-artwork.py — rebuild the three SVG files and layout JSON using
  Python with fontTools. It uses the bundled references and fonts. PDF, PNG and
  manifest require refreshing separately after any rebuild.
- manifest.json — hashes and byte sizes of every handoff file except itself/ZIP.

## What was recreated

The design retains the black/red/silver palette, curved Slipstream flow, centered
brand and WHEY hierarchy, two-line descriptor, flavour, quantity and allergen.
The ribbon geometry is a clean vector interpretation, not a pixel-exact tracing
of the generated render. Photographic pouch creases, seal, shadows and texture
are intentionally absent from this flat artwork. Typography uses identified
replacement fonts: Big Shoulders Bold for WHEY, Montserrat for other label text.
The WHEY heading is fitted to its reference box; its editable SVG has a transform.
The logo is the pre-existing vector reconstruction, not a recovered original;
verify against references/approved-logo.png before accepting it for production.

Silver gradients simulate the desired appearance in RGB. They do not specify
metallic ink or foil. Agree the actual silver process, substrate, color profile
and white-underprint requirements with the printer before creating separations.

## CorelDRAW fitting

1. Obtain the printer's actual pouch dieline and requested CorelDRAW version.
2. Import the outlined SVG into CorelDRAW, or install the included fonts and use
   the editable-text SVG. Groups are named for background, ribbons, logo and type.
3. Fit/reflow the artwork onto the front panel at real size. The canvas is 800 ×
   1200 REFERENCE UNITS, not an 800 × 1200 mm pouch and not measured production
   geometry. The PDF's approximately 211.67 × 317.50 mm page is a proof canvas
   generated from those screen units, not a specification for the pouch.
4. Apply the printer's bleed, trim, zipper/seal/gusset and safe-area requirements.
   Ribbon paths are clipped at the reference panel; extend them into actual bleed.
5. Add approved back/side content and any required label/barcode fields. None
   were invented here. Agree metallic/white layers and overprint with the printer.
6. Review a physical proof, outline final text as needed, and save a native CDR.
   Keep editable source separately. Remove the concept footer only after approval.

## Verification

The three SVGs parse successfully. Outlined front/ribbons contain no embedded
raster artwork or live text. The one-page PDF has no embedded images and was
rendered for visual review. Files and ZIP contents have been hash checked.
CorelDRAW itself has not been used here, so import compatibility and native CDR
saving must be verified in the printer's CorelDRAW version.

Corel SVG documentation:
https://help.coreldraw.com/CorelDRAW/540111192/Documentation-Windows/CorelDRAW-en/CorelDRAW-Scalable-Vector-Graphics-SVG.html
