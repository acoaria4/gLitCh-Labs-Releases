"""Create reusable, pixel-exact icons. Requires Pillow and cwebp on PATH.

Reads finalized icons from disk, or their last archived Git revision when absent.
Never resizes images or changes website references.
"""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import shutil
import subprocess
import tempfile

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_REVISION = '07f52a5f147aa7a013453a9f75372ed6adbc6eb2'
SOURCE_DIR = 'assets/finalized-icons'
OUT = ROOT / 'assets/compressed'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)


def main():
    encoder = shutil.which('cwebp')
    if not encoder:
        raise SystemExit('Install cwebp (libwebp) before running this script.')
    local = ROOT / SOURCE_DIR
    paths = ([p.relative_to(ROOT).as_posix() for p in sorted(local.glob('*.png'))]
             if local.is_dir() else git('ls-tree', '-r', '--name-only', SOURCE_REVISION,
                                       SOURCE_DIR).decode().splitlines())
    if not paths:
        raise SystemExit('No finalized source icons found.')
    OUT.mkdir(parents=True, exist_ok=True)
    records = []
    with tempfile.TemporaryDirectory() as folder:
        temp = Path(folder)
        for path in paths:
            source = ((ROOT / path).read_bytes() if local.is_dir()
                      else git('show', f'{SOURCE_REVISION}:{path}'))
            original = Image.open(BytesIO(source))
            original.load()
            original_pixels = original.convert('RGBA').tobytes()
            input_path = temp / 'source.png'
            input_path.write_bytes(source)
            candidates = [(source, '.png', 'original PNG')]
            for preset in (6, 9):
                output_path = temp / f'candidate-{preset}.webp'
                subprocess.run([encoder, '-quiet', '-z', str(preset), '-exact',
                                '-metadata', 'all', '-mt', str(input_path),
                                '-o', str(output_path)], check=True)
                candidate = output_path.read_bytes()
                decoded = Image.open(BytesIO(candidate))
                if (decoded.size != original.size or
                        decoded.convert('RGBA').tobytes() != original_pixels or
                        decoded.info.get('icc_profile') != original.info.get('icc_profile')):
                    raise RuntimeError(f'Lossless verification failed for {path}')
                candidates.append((candidate, '.webp', f'cwebp -z {preset} -exact -metadata all -mt'))
            data, suffix, command = min(candidates, key=lambda item: len(item[0]))
            target = OUT / (Path(path).stem + suffix)
            target.write_bytes(data)
            if local.is_dir() and (ROOT / path).read_bytes() != source:
                raise RuntimeError(f'Source changed during compression: {path}')
            record = dict(source=path, source_revision=None if local.is_dir() else SOURCE_REVISION,
                          source_sha256=sha(source), source_bytes=len(source),
                          output=target.relative_to(ROOT).as_posix(), output_sha256=sha(data),
                          output_bytes=len(data), bytes_saved=len(source)-len(data),
                          width=original.width, height=original.height,
                          rgba_sha256=sha(original_pixels), pixels_identical=True,
                          icc_identical=True, encoder=command)
            records.append(record)
            print(f'{target.name}: {len(data):,} bytes; saved {100*(1-len(data)/len(source)):.1f}%; exact RGBA match', flush=True)
    (OUT / 'manifest.json').write_text(json.dumps(dict(assets=records), indent=2) + '\n')


if __name__ == '__main__':
    main()
