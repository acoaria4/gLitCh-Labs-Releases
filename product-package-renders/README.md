# Product package renders

Standalone, versioned design archive in the gLitCh Labs Releases project. These
TRAYN files are not website assets and are excluded from the filtered Pages artifact.

## Browse the concepts

- [Current revised gallery](trayn/package-concepts/index.html)
- [Original six concepts](trayn/package-concepts/previous-gallery.html)
- [Pouch explorations](trayn/package-concepts/pouch-explorations/index.html)
- [Revised gallery](trayn/package-concepts/revised/index.html)
- [Original revised-pouch ZIP](trayn/package-concepts/revised-pouches.zip)

Open a gallery directly in your browser or use a local HTTP server. Galleries,
prompts, the supplied approved logo and the original ZIP retain their source bytes
and relative paths. This archive does not establish production approval; see the
copied revised-design README for the original concept notes.

## Folder structure

```text
trayn/
  package-concepts/              original gallery and six concepts
    pouch-explorations/          four earlier directions and prompts
    revised/                    supplied-logo revisions and prompts
  flavour-pouches/
    website-main/               main-site flavour pouches, PNG and WebP
    website-v3/                 new_website_3 flavour pouches, PNG and WebP
  website-packaging/             hero pouch and packaging-v4, PNG and WebP
```

Source: the sibling `traynnutrition-website-v2` project. Identical Shopify copies
are represented by their canonical image here, with all source locations recorded
in [manifest.json](manifest.json). Distinct formats and designs are retained.
Files were copied without resizing, recompression or editing. Original files stay
in their source folders. `.DS_Store` and unrelated website imagery are excluded.

The v3 Belgian Chocolate PNG is identical to
`trayn/package-concepts/a-website.png`; that existing copy represents both source
locations instead of storing the same image twice.

The manifest records 45 copied files from 62 source locations, totalling
72,591,624 bytes. It includes destination, SHA-256, bytes and original source paths.

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
