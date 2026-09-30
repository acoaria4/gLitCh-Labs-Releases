# Product package renders

Standalone, versioned design archive in the gLitCh Labs Releases project. These
TRAYN files are not website assets and are excluded from the filtered Pages artifact.

## Browse the concepts

- [Batch 06 — Slipstream flat vector artwork and updated printer handoff](batch-06-slipstream-flat-artwork-2026-09-30/README.md)

- [Batch 05 — Slipstream printer handoff](batch-05-slipstream-printer-handoff-2026-09-30/README.md) — reference assets, not a production CDR

- [Batch 04 — Slipstream silver typography experiment](batch-04-slipstream-silver-type-2026-09-30/index.html)

- [Batch 03 — Contour, Horizon, Apex and Slipstream](batch-03-website-performance-2026-09-30/index.html)

- [New Website and Performance variations — 30 September 2026](batch-02-website-performance-2026-09-30/index.html)
- [Current revised gallery](batch-01-imported-archive/trayn/package-concepts/index.html)
- [Original six concepts](batch-01-imported-archive/trayn/package-concepts/previous-gallery.html)
- [Pouch explorations](batch-01-imported-archive/trayn/package-concepts/pouch-explorations/index.html)
- [Revised gallery](batch-01-imported-archive/trayn/package-concepts/revised/index.html)
- [Original revised-pouch ZIP](batch-01-imported-archive/trayn/package-concepts/revised-pouches.zip)

The imported batch’s galleries, prompts, approved logo and ZIP are unchanged.
Open a gallery directly in your browser or use a local HTTP server. Its internal relative paths are preserved. This archive does not establish production approval; see the
copied revised-design README for the original concept notes.

## Folder structure

Every render belongs to a batch folder directly under this archive. Future batches
use the next batch number and a descriptive name; existing batches remain intact.

```text
batch-01-imported-archive/
  trayn/
    package-concepts/            original gallery and six concepts
      pouch-explorations/        four earlier directions and prompts
      revised/                  supplied-logo revisions and prompts
    flavour-pouches/
      website-main/             main-site flavour pouches, PNG and WebP
      website-v3/               new_website_3 flavour pouches, PNG and WebP
    website-packaging/           hero pouch and packaging-v4, PNG and WebP
batch-02-website-performance-2026-09-30/
  index.html                    gallery for this batch
  prompts.json                  exact generation prompts
  manifest.json                 image hashes and source references
  website/                      Satin arc and Precision sweep
  performance/                  Velocity and Cutline
batch-03-website-performance-2026-09-30/
  index.html                    comparison gallery with original references
  prompts.json                  exact generation prompts
  manifest.json                 image hashes and source references
  website/                      Contour and Horizon
  performance/                  Apex and Slipstream
batch-04-slipstream-silver-type-2026-09-30/
  index.html                    original versus silver typography
  slipstream-silver-type.png     separate Slipstream experiment
  prompts.json                  exact edit prompt
  manifest.json                 image hash and source reference
batch-05-slipstream-printer-handoff-2026-09-30/
  references/ and logo/         initial printer reference assets
batch-06-slipstream-flat-artwork-2026-09-30/
  artwork/                      flat SVGs, vector PDF proof and PNG preview
  fonts/                        editable typography with licenses
  references/                   concept and logo masters
  source/                       SVG builder and layout geometry
```

Source: the sibling `traynnutrition-website-v2` project. Identical Shopify copies
are represented by their canonical image here, with all source locations recorded
in [manifest.json](manifest.json). Distinct formats and designs are retained.
Files were copied without resizing, recompression or editing. Original files stay
in their source folders. `.DS_Store` and unrelated website imagery are excluded.

The v3 Belgian Chocolate PNG is identical to
`batch-01-imported-archive/trayn/package-concepts/a-website.png`; that existing copy represents both source
locations instead of storing the same image twice.

The manifest records 45 copied files from 62 source locations, totalling
72,591,624 bytes. It includes destination, SHA-256, bytes and original source paths.

Four additional renders were generated on 30 September 2026 using the approved
logo and the revised Website/Performance images. They are stored at their full
1024 × 1536 resolution in `batch-02-website-performance-2026-09-30/`, with their own
image manifest and exact generation prompts. The archive importer preserves this
separate set when refreshing copied source files.

Batch 03 adds four more full-resolution renders on 30 September 2026: Website
Contour and Horizon, plus Performance Apex and Slipstream. Each batch has its
own gallery, prompts and SHA-256 manifest; existing batches are preserved.

## Refresh and verify

Run from the repository root:

```sh
python3 scripts/archive-package-renders.py
python3 scripts/check-package-renders.py --verify-sources
```

The importer refuses to overwrite an archive file with different bytes. Its
`--source` option accepts another location for the TRAYN project. Source verification
requires that original project; CI verifies the archive without needing it.

## Publishing boundary

Switch GitHub Pages from branch publishing to GitHub Actions **before these files
reach `main`**. The workflow stages only public website files; this entire archive,
its galleries and manifest remain outside the uploaded artifact. See the project
README for activation and local staging commands.

This excludes the archive from the hosted website, not from visibility in the Git
repository itself.
