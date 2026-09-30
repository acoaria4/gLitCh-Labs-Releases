# TRAYN Slipstream — CorelDRAW printer handoff

Status: reference/source handoff for artwork preparation, NOT a print-ready CDR.
Selected direction: Batch 04 Slipstream with silver typography.

## Included assets

- references/slipstream-silver-type.png: selected full 1024 × 1536 concept render.
- references/slipstream-original-white-type.png: earlier lettering comparison.
- references/approved-logo.png: approved raster identity reference.
- logo/trayn-stacked-silver.svg: existing editable outlined vector reconstruction
  with RGB metallic simulation. Compare its geometry with approved-logo.png;
  this is not an exact recovered original or newly approved production logo.
- logo/trayn-stacked-black.svg and .pdf: existing outlined flat black masters.
  The PDF uses K-only black; it is not PDF/X-certified or a packaging dieline.
- logo/SOURCE-NOTES.md: original kit notes, provenance and print limitations.
- front-label-copy.txt: editable transcription of visible front copy.
- manifest.json: SHA-256 hashes and original source paths of unchanged copies.

## CorelDRAW preparation brief

Import the logo SVG as artwork, or import the PDF as curves. Rebuild the label
as flat vector artwork on the printer-supplied dieline at 1:1 physical size.
Save the native .cdr in the CorelDRAW version requested by the printer. Keep an
editable source and provide a separate outlined-text production copy/proof.

The pouch render is a photographic reference with perspective, folds, lighting
and shadows. Do not stretch it onto a dieline or use it as the final print face.
There are no isolated ribbon vectors, exact typeface files or flat package panels
for this AI-generated concept. The red/silver Slipstream ribbons and typography
must be redrawn and proofed; do not assume the render can become editable merely
by importing it into CorelDRAW. WHEY is tall condensed bold; the descriptor and
other text are sans-serif. Exact font names cannot be recovered from this render.

Suggested layer separation: locked dieline / black background / red ribbons /
silver ribbons / approved logo / WHEY / descriptor / flavour / quantity and
allergen / approved back and side content / finishing separations.

## Color and finishing intent — not final ink specifications

Black matte laminate, rich red ribbons, brushed silver logo and typography.
The existing logo kit lists accent red #E84938; this is an RGB design reference,
not a sampled match for every ribbon in the render or an approved CMYK formula.
Silver is a tonal metallic simulation in the files. Agree with the printer
whether to use metallic ink, foil, exposed metallized substrate or a process-gray
simulation. Do not silently replace it with a flat gray or assume a digital
silver gradient specifies an actual metallic finish. Obtain their substrate,
ink/profile and white-underprint requirements and a physical proof.

## Required before final CDR/production

1. Printer-issued dieline: dimensions, front/back/gusset panels, zipper, seals,
   tear notches, bleed and safe zones. No millimeter sizes are assumed here.
2. Approval of vector logo geometry against the approved raster identity.
3. Final font/outline artwork and flat ribbon geometry approved by the owner.
4. Complete owner-approved ingredients, nutrition, allergen and other required
   label copy; business/manufacturer details; batch/date/price fields and barcode
   data where applicable. This handoff does not invent them or certify compliance.
5. Printer's color, silver finish, trapping, minimum-line, overprint, white layer,
   proof and CorelDRAW-version requirements.
6. Signed-off front/back proof; remove the concept-only footer after approval.

## Reference documentation

CorelDRAW SVG import:
https://help.coreldraw.com/CorelDRAW/540111192/Documentation-Windows/CorelDRAW-en/CorelDRAW-Scalable-Vector-Graphics-SVG.html
CorelDRAW PDF import and text-as-curves:
https://help.coreldraw.com/CorelDRAW/540111192/Documentation-Windows/CorelDRAW-en/CorelDRAW-Adobe-Portable-Document-Format-PDF.html

Original assets are unchanged. This package stays outside the published website.
