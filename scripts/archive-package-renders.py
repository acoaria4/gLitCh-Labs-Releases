"""Copy TRAYN packaging into a standalone archive; never alter the source project."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'product-package-renders'
CONCEPTS = Path('new_website_3/assets/package renders')
FLAVOURS = ('belgian-chocolate', 'vanilla-creme', 'cafe-mocha', 'cookies-cream')
IMAGE_TYPES = {'.png', '.webp', '.jpg', '.jpeg', '.avif'}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=ROOT.parent/'traynnutrition-website-v2')
    args = parser.parse_args()
    source = args.source.resolve()
    if not (source/CONCEPTS).is_dir():
        parser.error(f'Missing concept folder: {source/CONCEPTS}')
    selected = []
    for path in sorted((source/CONCEPTS).rglob('*')):
        if path.is_file() and path.name != '.DS_Store':
            selected.append((path, Path('trayn/package-concepts')/path.relative_to(source/CONCEPTS)))
    for path in sorted(source.rglob('*')):
        rel = path.relative_to(source)
        if {'.git', 'node_modules'}.intersection(rel.parts) or CONCEPTS in rel.parents:
            continue
        if not path.is_file() or path.suffix.lower() not in IMAGE_TYPES:
            continue
        if path.stem in ('hero-pouch', 'packaging-v4'):
            selected.append((path, Path('trayn/website-packaging')/path.name))
        elif any(path.stem == name or path.stem == 'flavor-'+name for name in FLAVOURS):
            version = 'website-v3' if 'new_website_3' in rel.parts else 'website-main'
            selected.append((path, Path('trayn/flavour-pouches')/version/path.name))
    records, by_hash, by_output = [], {}, {}
    for original, relative in selected:
        checksum = digest(original)
        preserve_gallery_path = CONCEPTS in original.relative_to(source).parents
        record = None if preserve_gallery_path else by_hash.get(checksum)
        if record is None:
            if relative.as_posix() in by_output:
                # A distinct version with the same filename must never overwrite another.
                relative = relative.with_name(relative.stem+'-'+checksum[:12]+relative.suffix)
            target = OUT/relative
            if target.exists() and digest(target) != checksum:
                raise RuntimeError(f'Refusing to overwrite different archive content: {target}')
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(original, target)
            if digest(target) != checksum:
                raise RuntimeError(f'Copy verification failed: {original}')
            record = {'destination': relative.as_posix(), 'sha256': checksum,
                      'bytes': original.stat().st_size, 'sources': []}
            records.append(record)
            by_hash.setdefault(checksum, record)
            by_output[relative.as_posix()] = record
        record['sources'].append(original.relative_to(source).as_posix())
        if digest(original) != checksum:
            raise RuntimeError(f'Source changed while copying: {original}')
    manifest = {'version': 1, 'source_project': str(source),
                'source_file_count': len(selected), 'archived_file_count': len(records),
                'assets': records}
    (OUT/'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
    print(f'Archived {len(records)} files from {len(selected)} source locations; '
          f'{sum(r["bytes"] for r in records):,} bytes; all copies SHA-256 verified.')


if __name__ == '__main__':
    main()
