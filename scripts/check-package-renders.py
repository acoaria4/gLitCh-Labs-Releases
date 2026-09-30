"""Verify the standalone archive independently of website pages."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT/'product-package-renders'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.ids = [], set()
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        self.links.extend(attrs[k] for k in ('href', 'src') if attrs.get(k))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--verify-sources', action='store_true', help='Also verify the original TRAYN files locally')
    args = parser.parse_args()
    manifest = json.loads((ARCHIVE/'manifest.json').read_text())
    sources = Path(manifest['source_project'])
    represented = []
    for entry in manifest['assets']:
        target = ARCHIVE/entry['destination']
        assert target.resolve().is_relative_to(ARCHIVE.resolve()), target
        assert target.stat().st_size == entry['bytes'], target
        assert hashlib.sha256(target.read_bytes()).hexdigest() == entry['sha256'], target
        represented.extend(entry['sources'])
        if args.verify_sources:
            for original in entry['sources']:
                assert hashlib.sha256((sources/original).read_bytes()).hexdigest() == entry['sha256'], original
    assert len(represented) == len(set(represented)) == manifest['source_file_count']
    assert len(manifest['assets']) == manifest['archived_file_count']
    assert not list(ARCHIVE.rglob('.DS_Store'))
    pages = {p: Page(p.read_text()) for p in ARCHIVE.rglob('*.html')}
    for p, page in pages.items():
        for link in page.links:
            if '${' in link:  # These are checked against the gallery's design data below.
                continue
            u = urlsplit(link)
            if u.scheme or u.netloc:
                continue
            target = (p.parent/unquote(u.path)).resolve() if u.path else p
            assert target.is_relative_to(ARCHIVE.resolve()) and target.is_file(), (p, link)
            if u.fragment and target in pages:
                assert u.fragment in pages[target].ids, (p, link)
        text = p.read_text()
        ids = re.findall(r'[\'"]?id[\'"]?\s*:\s*[\'"]([^\'"]+)', text)
        image_prefix = 'revised/' if 'src="revised/${d.id}.png"' in text else ''
        for ident in ids:
            assert (p.parent/(image_prefix+ident+'.png')).is_file(), (p, ident)
    for archive in ARCHIVE.rglob('*.zip'):
        with zipfile.ZipFile(archive) as zipped:
            assert zipped.testzip() is None, archive
            for member in zipped.namelist():
                target = archive.parent/'revised'/member
                assert target.is_file() and target.read_bytes() == zipped.read(member), (archive, member)
    print(f'PASS: {len(manifest["assets"])} archive file hashes, {len(represented)} source records, '
          f'{len(pages)} galleries, dynamic image paths and ZIP contents'
          + ('; original source hashes unchanged.' if args.verify_sources else '.'))


if __name__ == '__main__':
    main()
