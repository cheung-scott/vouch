"""
Generate Chrome extension icons for Vouch.

Produces four PNG sizes (16, 32, 48, 128) using the brand colors:
- Background: indigo gradient (#5266eb -> #4658de)
- Mark: white checkmark on cream-ish background tile

Output: extension/icons/icon-{size}.png
"""

from PIL import Image, ImageDraw
import os
import math

SIZES = [16, 32, 48, 128]

# Brand colors
INDIGO_TOP = (82, 102, 235)       # #5266eb
INDIGO_BOTTOM = (70, 88, 222)     # #4658de
CHECK_COLOR = (251, 250, 246)     # #fbfaf6 (cream)
HIGHLIGHT = (255, 255, 255, 38)   # subtle top-edge highlight


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")

    # Rounded-square corner radius — match brand 6px-on-button look, scaled
    radius = max(2, int(size * 0.18))

    # Background: vertical gradient
    for y in range(size):
        t = y / max(1, size - 1)
        c = lerp(INDIGO_TOP, INDIGO_BOTTOM, t)
        draw.line([(0, y), (size, y)], fill=c)

    # Mask the gradient to a rounded rectangle
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)

    # Apply mask
    bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg.paste(img, (0, 0), mask)

    # Draw the checkmark
    cd = ImageDraw.Draw(bg)
    # Stroke width scales with size
    stroke = max(2, int(size * 0.13))
    # Checkmark anchored to a centered ~62% box
    pad = int(size * 0.22)
    p1 = (pad + int(size * 0.04), int(size * 0.55))
    p2 = (int(size * 0.43), size - pad - int(size * 0.04))
    p3 = (size - pad - int(size * 0.02), int(size * 0.32))
    cd.line([p1, p2], fill=CHECK_COLOR, width=stroke)
    cd.line([p2, p3], fill=CHECK_COLOR, width=stroke)

    # Subtle highlight along the top edge for depth
    hl_h = max(1, int(size * 0.20))
    hl = Image.new("RGBA", (size, hl_h), (0, 0, 0, 0))
    hl_draw = ImageDraw.Draw(hl)
    for y in range(hl_h):
        a = int(38 * (1 - y / hl_h))
        hl_draw.line([(0, y), (size, y)], fill=(255, 255, 255, a))
    hl_mask = Image.new("L", (size, hl_h), 0)
    hl_mask_draw = ImageDraw.Draw(hl_mask)
    hl_mask_draw.rounded_rectangle(
        [0, 0, size - 1, hl_h - 1], radius=radius, fill=255
    )
    bg.paste(hl, (0, 0), hl_mask)

    return bg


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(script_dir, "..", "icons")
    os.makedirs(icons_dir, exist_ok=True)

    for size in SIZES:
        img = make_icon(size)
        out = os.path.join(icons_dir, f"icon-{size}.png")
        img.save(out, "PNG", optimize=True)
        kb = os.path.getsize(out) / 1024
        print(f"  wrote {out} ({size}x{size}, {kb:.1f} KB)")


if __name__ == "__main__":
    main()
