"""Stage and verify tracked public website files, excluding standalone archives."""
import argparse
import hashlib
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIRS = {'assets', 'expenses', 'aura', 'lumen'}
PUBLIC_ROOT_FILES = {'CNAME', '.nojekyll'}


def public_file(relative):
    return (len(relative.parts) == 1 and
            (relative.name in PUBLIC_ROOT_FILES or relative.suffix in {'.html', '.css', '.js'})) or (
                len(relative.parts) > 1 and relative.parts[0] in PUBLIC_DIRS)


def tracked_public_files():
    output = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT)
    return sorted(Path(name.decode()) for name in output.split(b'\0') if name and public_file(Path(name.decode())))


class References(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.ids = [], set()
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        for key in ('href', 'src', 'poster'):
            if attrs.get(key):
                self.links.append(attrs[key])


def verify(output, relatives):
    actual = {p.relative_to(output) for p in output.rglob('*') if p.is_file()}
    if actual != set(relatives):
        raise RuntimeError(f'Staged file set differs: {actual.symmetric_difference(relatives)}')
    for relative in relatives:
        source, target = ROOT/relative, output/relative
        if hashlib.sha256(source.read_bytes()).digest() != hashlib.sha256(target.read_bytes()).digest():
            raise RuntimeError(f'Staged content changed: {relative}')
    pages = {p: References(p.read_text()) for p in output.rglob('*.html')}
    for page, parsed in pages.items():
        for link in parsed.links:
            check_reference(output, page, link, pages)
    for css in output.rglob('*.css'):
        for link in re.findall(r'url\(\s*[\'"]?([^\)\'"\s]+)', css.read_text()):
            check_reference(output, css, link, pages)
    for name in ('index.html', 'CNAME', '.nojekyll'):
        if not (output/name).is_file():
            raise RuntimeError(f'Missing required public file: {name}')
    print(f'PASS: {len(relatives)} staged files identical to source; {len(pages)} HTML pages '
          'and CSS references valid; only allowed public paths included.')


def check_reference(output, referring, link, pages):
    url = urlsplit(link)
    if url.scheme or url.netloc:
        return
    path = unquote(url.path)
    target = ((output/path.lstrip('/')) if path.startswith('/') else
              (referring.parent/path if path else referring)).resolve()
    if not target.is_relative_to(output):
        raise RuntimeError(f'Reference escapes staged site: {referring}: {link}')
    if target.is_dir():
        target /= 'index.html'
    if not target.is_file():
        raise RuntimeError(f'Missing staged reference: {referring}: {link}')
    if url.fragment and target in pages and url.fragment not in pages[target].ids:
        raise RuntimeError(f'Missing staged anchor: {referring}: {link}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True, help='Empty directory outside the source repository')
    args = parser.parse_args()
    output = args.output.resolve()
    if output == ROOT or output.is_relative_to(ROOT) or ROOT.is_relative_to(output):
        parser.error('Output must be outside the repository and cannot contain the repository.')
    if output.exists() and any(output.iterdir()):
        parser.error('Output directory must be empty; existing files will not be removed.')
    relatives = tracked_public_files()
    for relative in relatives:
        source = ROOT/relative
        if source.is_symlink() or not source.resolve().is_relative_to(ROOT) or not source.is_file():
            raise RuntimeError(f'Not a regular tracked source file: {relative}')
    output.mkdir(parents=True, exist_ok=True)
    for relative in relatives:
        target = output/relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT/relative, target)
    verify(output, relatives)


if __name__ == '__main__':
    main()
