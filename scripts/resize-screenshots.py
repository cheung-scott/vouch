"""
Batch-resize + place demo screenshots into their final repo locations.

For each source PNG in SOURCE_DIR, find it by the matcher (filename
substring), resize to 1200px wide preserving aspect ratio (or apply a
custom transform), and write to the target path under public/images/.

Usage:
    python scripts/resize-screenshots.py <source-dir>

Edit the MAPPING below with the actual filenames you saved if the
auto-matchers don't catch them.
"""
import sys
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent
HOW_IT_WORKS_DIR = REPO_ROOT / "public" / "images" / "how-it-works"
DEMO_STILLS_DIR = REPO_ROOT / "docs" / "demo-stills"

HOW_IT_WORKS_DIR.mkdir(parents=True, exist_ok=True)
DEMO_STILLS_DIR.mkdir(parents=True, exist_ok=True)

# Target width — all images get resized to 1200px wide, height auto.
# Matches the <Image width={1200} height={750} /> declaration in the
# /how-it-works Step component; Next.js will scale anyway but 1200 wide
# gives us 2x density on a 600px-wide rendered card.
TARGET_WIDTH = 1200

# Each entry: (target_filename_stem, list of substring matchers, dest dir)
# The first source file whose filename contains any of the substrings
# wins. Case-insensitive matching.
MAPPING = [
    # /how-it-works — 8 stills
    ("buyer-01-ebay", ["with-button", "with_button", "withbutton", "vouch button", "pay with vouch"], HOW_IT_WORKS_DIR),
    ("buyer-02-new", ["new-page", "vch_24c484", "question 4", "arrive by"], HOW_IT_WORKS_DIR),
    ("buyer-03-signoff", ["vch_62619e", "sarah and marcus", "final agreement"], HOW_IT_WORKS_DIR),
    ("seller-01-link", ["whatsapp", "marcus chat", "8d23e6"], HOW_IT_WORKS_DIR),
    ("seller-02-intake", ["vch_8d23e6 seller", "seller intake", "set up a deal"], HOW_IT_WORKS_DIR),
    ("seller-03-onboard", ["onboard", "stripe connect", "set up your account"], HOW_IT_WORKS_DIR),
    ("seller-04-signoff", ["vch_d1805d", "money held", "is locked", "in_escrow"], HOW_IT_WORKS_DIR),
    ("dispute-replay", ["dispute-replay", "dispute replay", "scratches", "evidence"], HOW_IT_WORKS_DIR),

    # Demo stills (b1 reuses some of the same images, different filename)
    ("b1-ebay-no-button", ["no-button", "no_button", "nobutton"], DEMO_STILLS_DIR),
    ("b1-ebay-with-button", ["with-button", "with_button", "withbutton"], DEMO_STILLS_DIR),
    ("b1-button-only", ["button-only", "button_only", "buttononly", "isolated button"], DEMO_STILLS_DIR),
]


def find_source(source_dir: Path, matchers: list[str]) -> Path | None:
    for f in source_dir.iterdir():
        if not f.is_file() or f.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        name_lower = f.name.lower()
        for m in matchers:
            if m.lower() in name_lower:
                return f
    return None


def process(source: Path, target: Path) -> None:
    img = Image.open(source)
    if img.mode != "RGB":
        img = img.convert("RGB")
    # Resize preserving aspect ratio. If already <=TARGET_WIDTH, keep.
    if img.width > TARGET_WIDTH:
        new_h = round(img.height * (TARGET_WIDTH / img.width))
        img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)
    img.save(target, "PNG", optimize=True)
    print(f"  ✓ {source.name} → {target.relative_to(REPO_ROOT)} ({img.width}×{img.height})")


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python scripts/resize-screenshots.py <source-dir>")
        sys.exit(1)
    source_dir = Path(sys.argv[1]).resolve()
    if not source_dir.is_dir():
        print(f"  ✗ Not a directory: {source_dir}")
        sys.exit(1)

    print(f"Scanning {source_dir} for screenshots…\n")
    matched = 0
    unmatched = []
    for stem, matchers, dest_dir in MAPPING:
        src = find_source(source_dir, matchers)
        if src is None:
            unmatched.append((stem, matchers))
            continue
        process(src, dest_dir / f"{stem}.png")
        matched += 1

    print(f"\n  Matched: {matched} of {len(MAPPING)}")
    if unmatched:
        print("\n  ⚠ Unmatched targets (rename the source file to include any of the substrings, or edit MAPPING):")
        for stem, matchers in unmatched:
            print(f"    - {stem} (looks for: {', '.join(matchers)})")


if __name__ == "__main__":
    main()
