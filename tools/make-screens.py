"""Turns the simulator's screenshots and the portal's sample shots into the site's pictures, img/<role>.webp.

    python3 -I tools/make-screens.py <shots-folder> [<portal-shots-folder>]

The app shots are from the iPhone 17 Pro simulator (1206 x 2622), taken with the app's own script and a full
status bar (see the README, "Making them again"); 1320 x 2868 shots from an iPhone 17 Pro Max work too. The
portal shots are what tools/shoot-portal.mjs writes. The roles and the files they come from are in ROLES and
PORTAL below. After a reshoot, put the new PNGs in a folder under the same names (or change ROLES) and run
this again; the pages need no change unless a picture's size or contents do.

For each app screen it:
  * paints over the Dynamic Island with the background around it (the page shows the screen on its own,
    not a phone), and
  * on a shot with the simulator's four "no service" dots (no status bar override), draws full signal bars
    there (Apple asks for a full status bar). The time, Wi-Fi and battery are left as they were shot.
Then it scales the screen to SCREEN_WIDTH and saves it as WebP. Rounded corners and the shadow are CSS.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

SITE = Path(__file__).resolve().parent.parent
OUT = SITE / "img"

# role: (file in the shots folder, crop box at full size or None)
ROLES = {
    "screen-calendar": ("calendar.png", None),  # the Week tab
    "screen-lookover": ("review.png", None),  # Check posts, card 1
    "screen-handoff": ("handoff-w1.png", None),  # Share
}
# role: (file in the portal shots folder, crop box in CSS px (the shots are 2x), width)
PORTAL = {
    # Team: the title, the three numbers, the cars line, the people who haven't shared and the first who has.
    "portal-board-dealer": ("d-week.png", (336, 26, 1360, 1047), 1200),
    "portal-board-realty": ("p-week.png", (336, 26, 1360, 876), 1200),
    # Phones: the same people, with this week and this month.
    "portal-board-dealer-phone": ("d-week.png", (340, 458, 992, 1047), 680),
    "portal-board-realty-phone": ("p-week.png", (340, 422, 992, 876), 680),
    # A person's page: the name and the four numbers; the phone file is the first two numbers.
    "portal-person-numbers": ("d-person.png", (336, 12, 1360, 386), 1200),
    "portal-person-numbers-phone": ("d-person.png", (338, 212, 850, 384), 680),
    # Posts That Went Out, with what the checks said; the phone files from the page at 560 px, so each line is whole.
    "portal-check-record": ("d-person.png", (340, 851, 1356, 1481), 1200),
    "portal-check-record-phone": ("d-person-560.png", (8, 1254, 552, 1757), 680),
    "portal-check-record-realty": ("p-person.png", (340, 879, 1356, 1302), 1200),
    "portal-check-record-realty-phone": ("p-person-560.png", (8, 1282, 552, 1867), 680),
}

SCREEN_WIDTH = 840
QUALITY = 80  # app screens
PORTAL_QUALITY = 82

# Where things sit, by screenshot size: the island (x0, y0, x1, y1, painted from the rows just above and below)
# and, on a 1320 px wide Pro Max shot without a status bar override, the "no service" dots (painted from the
# columns either side) and the right edge and baseline of the signal bars drawn there.
DEVICES = {
    (1206, 2622): {"island": (410, 37, 796, 157)},  # iPhone 17 Pro, 3x
    (1320, 2868): {"island": (452, 28, 868, 164), "dots": (924, 84, 1014, 128), "bars": (1003, 116)},  # 17 Pro Max
}


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


def draw_bars(img, right, bottom):
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
    img.alpha_composite(patch, (right - total, bottom - max(heights)))


def screen(src, crop):
    img = Image.open(src).convert("RGBA")
    device = DEVICES.get(img.size)
    if device is None:
        raise SystemExit(f"{src}: {img.size[0]} x {img.size[1]} is not a size in DEVICES")
    full_width = img.width
    if crop is None:
        fill_vertical(img, device["island"])
        if "dots" in device:
            fill_horizontal(img, device["dots"])
            draw_bars(img, *device["bars"])
    else:
        img = img.crop(crop)
    width = SCREEN_WIDTH if crop is None else round(img.width * SCREEN_WIDTH / full_width)
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)


def save(img, role, quality=QUALITY):
    path = OUT / f"{role}.webp"
    img.convert("RGB").save(path, "WEBP", quality=quality, method=6)
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
            img = Image.open(portal / name).convert("RGB").crop(tuple(2 * v for v in crop))
            save(img.resize((width, round(img.height * width / img.width)), Image.LANCZOS), role, PORTAL_QUALITY)


if __name__ == "__main__":
    main()
