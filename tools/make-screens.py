"""Turns the simulator's 1320 x 2868 screenshots into the home page's screen images, img/<role>.webp.

    python3 -I tools/make-screens.py <shots-folder> [<portal-shots-folder>]

The roles and the files they come from are in ROLES below. After a reshoot, put the new PNGs in a folder
under the same names (or change ROLES) and run this again; the page needs no change.

For each app screen it:
  * paints over the Dynamic Island with the background around it (the page shows the screen on its own,
    not a phone), and
  * draws full signal bars where the simulator shows four "no service" dots (Apple asks for a full status
    bar). The time, Wi-Fi and battery are left as they were shot.
Then it scales the screen to SCREEN_WIDTH and saves it as WebP. Rounded corners and the shadow are CSS.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

SITE = Path(__file__).resolve().parent.parent
OUT = SITE / "img"

# role: (file in the shots folder, crop box at full size or None)
ROLES = {
    "screen-calendar": ("calendar.png", None),
    "screen-lookover": ("review.png", None),
    "screen-handoff": ("more/handoff-w1.png", None),
}
# role: (file in the portal shots folder, crop box or None, width)
PORTAL = {
    "portal-team": ("team-1440-light.png", (0, 0, 1440, 900), 1200),
    "portal-team-phone": ("team-390-light.png", (0, 0, 780, 1300), 640),
    # A person's page: their Loops (read only) and the posts that went out.
    "portal-person": ("person-1440-light.png", (0, 0, 1440, 900), 1200),
    "portal-person-phone": ("person-390-light.png", (0, 0, 780, 1300), 640),
    # The Team page's counts and people, without the office's name (the dealership page uses it: the
    # sample office is a brokerage).
    "portal-team-table": ("team-1440-light.png", (350, 160, 1356, 900), 1000),
    "portal-team-table-phone": ("team-390-light.png", (0, 620, 780, 1688), 640),
}

SCREEN_WIDTH = 840
QUALITY = 80

# Where things sit on a 1320 px wide screenshot (iPhone 17 Pro Max, 3x).
ISLAND = (452, 28, 868, 164)  # x0, y0, x1, y1: painted from the rows just above and below
DOTS = (924, 84, 1014, 128)  # the "no service" dots: painted from the columns either side
BARS_RIGHT = 1003  # right edge of the signal bars
BARS_BOTTOM = 116  # their baseline, level with the Wi-Fi glyph's bottom


def fill_vertical(img, box):
    """Paints box with a top-to-bottom blend, per column, of the row above it and the row below it."""
    x0, y0, x1, y1 = box
    px = img.load()
    for x in range(x0, x1):
        top, bottom = px[x, y0 - 1], px[x, y1]
        for y in range(y0, y1):
            t = (y - y0 + 1) / (y1 - y0 + 1)
            px[x, y] = tuple(round(a + (b - a) * t) for a, b in zip(top, bottom))


def fill_horizontal(img, box):
    """Paints box with a left-to-right blend, per row, of the column left of it and the column right of it."""
    x0, y0, x1, y1 = box
    px = img.load()
    for y in range(y0, y1):
        left, right = px[x0 - 1, y], px[x1, y]
        for x in range(x0, x1):
            t = (x - x0 + 1) / (x1 - x0 + 1)
            px[x, y] = tuple(round(a + (b - a) * t) for a, b in zip(left, right))


def ink_of(img):
    """The status bar's text color: the darkest or lightest pixel in the time, whichever is further from the background."""
    region = img.crop((190, 80, 310, 120)).convert("L")
    lo, hi = region.getextrema()
    bg = img.crop((150, 60, 180, 70)).convert("L").getextrema()[0]
    return (0, 0, 0) if abs(bg - lo) > abs(bg - hi) else (255, 255, 255)


def draw_bars(img):
    """Four signal bars, drawn 4x large and scaled down so their edges are smooth."""
    s = 4
    widths, gap, heights, radius = 9, 5, (12, 18, 25, 32), 2.5
    total = 4 * widths + 3 * gap
    patch = Image.new("RGBA", (total * s, max(heights) * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(patch)
    ink = ink_of(img) + (255,)
    for i, h in enumerate(heights):
        x = i * (widths + gap) * s
        d.rounded_rectangle((x, (max(heights) - h) * s, x + widths * s - 1, max(heights) * s - 1), radius=radius * s, fill=ink)
    patch = patch.resize((total, max(heights)), Image.LANCZOS)
    img.alpha_composite(patch, (BARS_RIGHT - total, BARS_BOTTOM - max(heights)))


def screen(src, crop):
    img = Image.open(src).convert("RGBA")
    if img.size != (1320, 2868):
        raise SystemExit(f"{src}: expected 1320 x 2868, got {img.size[0]} x {img.size[1]}")
    if crop is None:
        fill_vertical(img, ISLAND)
        fill_horizontal(img, DOTS)
        draw_bars(img)
    else:
        img = img.crop(crop)
    width = SCREEN_WIDTH if crop is None else round(img.width * SCREEN_WIDTH / 1320)
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)


def save(img, role):
    path = OUT / f"{role}.webp"
    img.convert("RGB").save(path, "WEBP", quality=QUALITY, method=6)
    print(f"img/{role}.webp  {img.width} x {img.height}  {path.stat().st_size // 1024} KB")


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    shots = Path(sys.argv[1])
    OUT.mkdir(exist_ok=True)
    for role, (name, crop) in ROLES.items():
        save(screen(shots / name, crop), role)
    if len(sys.argv) > 2:
        portal = Path(sys.argv[2])
        for role, (name, crop, width) in PORTAL.items():
            img = Image.open(portal / name).convert("RGB")
            if crop:
                img = img.crop(crop)
            save(img.resize((width, round(img.height * width / img.width)), Image.LANCZOS), role)


if __name__ == "__main__":
    main()
