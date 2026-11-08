"""Regenerate the responsive WebP copies used by src/lib/responsive-image.ts.

For every JPEG given (or every JPEG under src/assets when none are given),
writes `name.w<width>.webp` beside it:
  - 1920px-wide photos: 640, 960, 1280, 1920
  - smaller photos (e.g. 1024 squares): 480, 800 and the original width
Old variants of that image are removed first, so a replaced photo never keeps
stale copies.

Usage (needs Pillow):  python3 scripts/make_webp.py [path/to/photo.jpg ...]
"""
import sys
from pathlib import Path

from PIL import Image


def variants(path: Path) -> None:
    for old in path.parent.glob(f"{path.stem}.w*.webp"):
        old.unlink()
    im = Image.open(path).convert("RGB")
    w, h = im.size
    widths = [640, 960, 1280, 1920] if w >= 1920 else [480, 800, w]
    for tw in widths:
        if tw > w:
            continue
        out = im if tw == w else im.resize((tw, round(h * tw / w)), Image.LANCZOS)
        out.save(path.parent / f"{path.stem}.w{tw}.webp", "WEBP", quality=76, method=6)
    print("ok", path)


def main() -> None:
    files = [Path(a) for a in sys.argv[1:]] or sorted(Path("src/assets").rglob("*.jpg"))
    for f in files:
        variants(f)


if __name__ == "__main__":
    main()
