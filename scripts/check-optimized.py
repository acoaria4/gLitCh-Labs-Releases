"""Validate generated asset integrity, lossless pixels, and local CSS references."""
from pathlib import Path
from PIL import Image
from fontTools.ttLib import TTFont
import hashlib, json, re
ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT/'assets/optimized/manifest.json').read_text())
for source, item in manifest['assets'].items():
    original, output = ROOT/source, ROOT/item['output']
    sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
    assert sha(original) == item['source_sha256'], f'Stale source: {source}'
    assert sha(output) == item['output_sha256'], f'Changed output: {output}'
    if source == 'script.js':
        assert original.read_bytes() == output.read_bytes(), 'Scrolling runtime must not be transformed'
    if original.suffix == '.png':
        a, b = Image.open(original), Image.open(output)
        assert a.size == b.size and a.convert('RGBA').tobytes() == b.convert('RGBA').tobytes(), source
        assert a.info.get('icc_profile') == b.info.get('icc_profile'), source
        if 'fallback' in item:
            fallback = ROOT/item['fallback']
            assert sha(fallback) == item['fallback_sha256']
            assert Image.open(fallback).convert('RGBA').tobytes() == a.convert('RGBA').tobytes()
    if original.suffix == '.ttf':
        a, b = TTFont(original), TTFont(output)
        assert a.getBestCmap() == b.getBestCmap() and a['hmtx'].metrics == b['hmtx'].metrics, source
    if output.suffix == '.css':
        for url in re.findall(r'url\([\'"]?([^\)\'" ]+)', output.read_text()):
            if not url.startswith(('data:', 'http:', 'https:', '#')):
                assert (output.parent/url).is_file(), (output, url)
print(f'PASS: {len(manifest["assets"])} asset hashes, lossless image pixels, font metrics, and generated CSS URLs.')
