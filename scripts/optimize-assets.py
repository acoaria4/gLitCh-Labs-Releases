"""Generate verified lossless assets and wire only the public marketing pages.
Run with the dependencies in requirements-performance.txt. Originals are read-only.
"""
from pathlib import Path
from io import BytesIO
from urllib.parse import urlsplit, unquote
import hashlib, json, os, re, shutil
from PIL import Image
from fontTools.ttLib import TTFont
from rcssmin import cssmin
from rjsmin import jsmin

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/optimized'
MANIFEST = OUT / 'manifest.json'
ICONS = ['glitchlabs', 'expenses', 'aura', 'lumen']

def digest(data):
    return hashlib.sha256(data).hexdigest()

def pages():
    return sorted(list(ROOT.glob('*.html')) + [p for name in ICONS[1:] for p in (ROOT/name).rglob('*.html')])

def original_references(text, page, manifest):
    """Resolve prior generated URLs, making repeated builds safe and idempotent."""
    reverse = {}
    for source, item in manifest.get('assets', {}).items():
        for output in [item['output'], item.get('fallback')]:
            if output:
                reverse[output] = source
    text = re.sub(r'<link\b[^>]*data-optimized-preload[^>]*>\s*', '', text)
    def restore(m):
        url = urlsplit(m[2])
        if url.scheme or url.netloc:
            return m[0]
        path = (page.parent / unquote(url.path)).resolve()
        try:
            source = reverse.get(path.relative_to(ROOT).as_posix())
        except ValueError:
            return m[0]
        return f'{m[1]}="{os.path.relpath(ROOT/source, page.parent)}"' if source else m[0]
    return re.sub(r'\b(src|href)="([^"]+)"', restore, text)

def main():
    old = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    originals = {p: original_references(p.read_text(), p, old) for p in pages()}
    OUT.mkdir(parents=True, exist_ok=True)
    assets = {}
    def emit(source, data, suffix, folder, **extra):
        name = f'{source.stem}.{digest(data)[:16]}{suffix}'
        output = OUT / folder / name
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(data)
        source_bytes = source.read_bytes()
        assets[source.relative_to(ROOT).as_posix()] = {
            'source_sha256': digest(source_bytes), 'source_bytes': len(source_bytes),
            'output': output.relative_to(ROOT).as_posix(), 'output_sha256': digest(data),
            'output_bytes': len(data), 'saved_bytes': len(source_bytes)-len(data), **extra,
        }
        return output
    def identical(source, encoded):
        with Image.open(BytesIO(encoded)) as image:
            assert image.size == source.size and image.convert('RGBA').tobytes() == source.convert('RGBA').tobytes(), 'Image pixels changed'
            assert image.info.get('icc_profile') == source.info.get('icc_profile'), 'Image color profile changed'
    for name in ICONS:
        path = ROOT / 'assets' / f'{name}.png'
        with Image.open(path) as image:
            png = BytesIO()
            image.save(png, format='PNG', optimize=True, **({'icc_profile':image.info['icc_profile']} if 'icc_profile' in image.info else {}))
            png_data = min([path.read_bytes(), png.getvalue()], key=len)
            identical(image, png_data)
            webp = BytesIO()
            image.save(webp, format='WEBP', lossless=True, exact=True, method=6,
                       **({'icc_profile':image.info['icc_profile']} if 'icc_profile' in image.info else {}))
            webp_data = webp.getvalue()
            identical(image, webp_data)
            fallback = emit(path, png_data, '.png', 'images')
            if len(webp_data) < len(png_data):
                emit(path, webp_data, '.webp', 'images', fallback=fallback.relative_to(ROOT).as_posix(),
                     fallback_sha256=digest(png_data), fallback_bytes=len(png_data),
                     verified='Exact RGBA pixels, dimensions and ICC profile')
            else:
                assets[path.relative_to(ROOT).as_posix()]['verified'] = 'Exact RGBA pixels, dimensions and ICC profile'
    for path in sorted((ROOT/'assets/fonts').glob('*.ttf')):
        font = TTFont(path, recalcTimestamp=False)
        font.flavor = 'woff2'
        buf = BytesIO();font.save(buf)
        restored = TTFont(BytesIO(buf.getvalue()), recalcTimestamp=False)
        original = TTFont(path, recalcTimestamp=False)
        assert restored.getGlyphOrder() == original.getGlyphOrder()
        assert restored.getBestCmap() == original.getBestCmap()
        assert restored['hmtx'].metrics == original['hmtx'].metrics
        for name in original.getGlyphOrder():
            assert restored['glyf'][name].getCoordinates(restored['glyf']) == original['glyf'][name].getCoordinates(original['glyf'])
        emit(path, buf.getvalue(), '.woff2', 'fonts', verified='Glyph order, character map, outlines and horizontal metrics')
    for license_file in (ROOT/'assets/fonts').glob('*OFL.txt'):
        shutil.copy2(license_file, OUT/'fonts'/license_file.name)
    for path in sorted(ROOT.glob('*.css')):
        def css_url(m):
            value = m[1].strip(' \'"')
            if value.startswith(('data:', 'http:', 'https:', '#')):
                return m[0]
            target = (path.parent/value).resolve()
            key = target.relative_to(ROOT).as_posix()
            output = ROOT/assets[key]['output'] if key in assets else target
            return 'url("'+os.path.relpath(output, OUT/'css')+'")'
        text = re.sub(r'url\(([^)]+)\)', css_url, path.read_text()).replace("format('truetype')", "format('woff2')")
        emit(path, cssmin(text).encode(), '.min.css', 'css')
    for path in sorted(ROOT.glob('*.js')):
        emit(path, jsmin(path.read_text()).encode(), '.min.js', 'js')
    for page, text in originals.items():
        def tag(m):
            original = m[0]
            favicon = bool(re.search(r'rel="icon"', original))
            def attr(a):
                url = urlsplit(a[2])
                if url.scheme or url.netloc or not url.path:
                    return a[0]
                target = (page.parent / unquote(url.path)).resolve()
                try: key = target.relative_to(ROOT).as_posix()
                except ValueError: return a[0]
                item = assets.get(key)
                if not item: return a[0]
                output = item.get('fallback', item['output']) if favicon else item['output']
                return f'{a[1]}="{os.path.relpath(ROOT/output, page.parent)}"'
            return re.sub(r'\b(src|href)="([^"]+)"', attr, original)
        text = re.sub(r'<(?:link|img|script)\b[^>]*>', tag, text)
        # Fonts used by the initial screen only; remaining faces stay demand-loaded.
        if page == ROOT/'index.html': numbers = [10, 4]
        elif 'aura' in page.relative_to(ROOT).parts: numbers = [2, 4]
        elif 'lumen' in page.relative_to(ROOT).parts: numbers = [13, 12]
        elif 'expenses' in page.relative_to(ROOT).parts: numbers = [10, 8]
        else: numbers = [10, 4]
        links = ''.join(f'<link data-optimized-preload rel="preload" as="font" type="font/woff2" crossorigin href="{os.path.relpath(ROOT/assets[f"assets/fonts/font-{n}.ttf"]["output"],page.parent)}">' for n in numbers)
        if 'fonts.' in text:
            text = text.replace('</head>', links+'</head>')
        # /get artwork is above the fold, unlike later homepage product sections.
        if page.parent.name == 'get':
            text = re.sub(r'<img class="landing-icon"(?![^>]*fetchpriority)', '<img class="landing-icon" fetchpriority="high"', text)
        page.write_text(text)
    manifest = {'version': 1, 'assets': assets}
    MANIFEST.write_text(json.dumps(manifest, indent=2)+'\n')
    # Only remove hashed files owned by this generator, never source artwork.
    live = {a['output'] for a in assets.values()} | {a.get('fallback') for a in assets.values()}
    for candidate in OUT.rglob('*'):
        if candidate.is_file() and re.search(r'\.[0-9a-f]{16}\.', candidate.name) and candidate.relative_to(ROOT).as_posix() not in live:
            candidate.unlink()
    print(f'Optimized {len(assets)} assets; {sum(a["saved_bytes"] for a in assets.values()):,} bytes saved across unique primary assets.')

if __name__ == '__main__':
    main()
