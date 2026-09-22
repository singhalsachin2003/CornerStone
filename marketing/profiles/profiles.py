#!/usr/bin/env python3
"""Social profile assets for OTC Learn and Cornerstone.

Avatars are the shipped app icons, resized — the icon a person taps on their
home screen and the avatar they see in a feed should be the same mark.

Banners are built from each app's own palette and typeface. Every platform gets
its exact spec, and YouTube's is drawn against its safe area rather than its
canvas, because only the middle 1546x423 of a 2560x1440 banner is visible on
every device.
"""
import os

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(HERE, "fonts")
UP = "/mnt/user-data/uploads"
OUT = os.path.join(HERE, "profiles")
os.makedirs(OUT, exist_ok=True)

ICONS = {
    "otc": f"{UP}/otc-learning-app/assets/icon-play-512.png",
    "cs": f"{UP}/CornerStone/store/icon-512.png",
}

BRAND = {
    "otc": dict(
        bg="#EAE8E0", ink="#181611", body="#3C3A35", micro="#696761",
        accent="#2A75BA", sans="PlusJakartaSans.ttf", display="PlusJakartaSans.ttf",
        name="OTC LEARN",
        head="The derivatives everyone in the room pretends to understand.",
        sub="36 products free · worked examples · offline · no ads",
    ),
    "cs": dict(
        bg="#f7f4ee", ink="#16233b", body="#3d4a63", micro="#8c8578",
        accent="#9a6b2f", sans="Archivo.ttf", display="SourceSerif4.ttf",
        name="CORNERSTONE",
        head="Fifteen honest minutes beats three distracted hours.",
        sub="Snapshot cards and five-question sessions · 260-term glossary, free",
    ),
}

_f = {}


def F(name, size, variation=None):
    k = (name, size, variation)
    if k not in _f:
        f = ImageFont.truetype(os.path.join(FD, name), size)
        if variation:
            f.set_variation_by_name(variation)
        _f[k] = f
    return _f[k]


def wrap(d, text, font, maxw):
    out, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur:
                out.append(cur)
            cur = w
    if cur:
        out.append(cur)
    return out


def tracked(d, text, font, x, y, fill, tr=3):
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tr
    return x


def save(img, name):
    p = os.path.join(OUT, name)
    img.save(p, "PNG", optimize=True)
    print(f"  {name:<34} {img.size[0]}x{img.size[1]}")


def avatar(key, size, name):
    """The app icon at a platform's avatar size. Square; platforms mask it."""
    src = Image.open(ICONS[key]).convert("RGB")
    save(src.resize((size, size), Image.LANCZOS), name)


def banner(key, W, H, name, safe=None, scale=1.0):
    """
    A banner drawn inside `safe` (w, h) centred on the canvas when given.

    YouTube shows the full 2560x1440 only on a TV; everywhere else it crops to
    the middle. Composing against the safe box is the difference between a
    headline that reads on a phone and one that is cut in half.
    """
    b = BRAND[key]
    img = Image.new("RGB", (W, H), b["bg"])
    d = ImageDraw.Draw(img)

    sw, sh = safe if safe else (W, H)
    ox, oy = (W - sw) // 2, (H - sh) // 2

    pad = int(56 * scale)
    hf = F(b["display"], int(52 * scale), "SemiBold" if key == "cs" else "ExtraBold")
    sf = F(b["sans"], int(24 * scale), "Regular")
    nf = F(b["sans"], int(19 * scale), "SemiBold" if key == "cs" else "ExtraBold")

    # Vertically centre the block inside the safe area.
    lines = wrap(d, b["head"], hf, sw - pad * 2)
    lead = int(62 * scale)
    sub_lines = wrap(d, b["sub"], sf, sw - pad * 2)
    total = int(30 * scale) + lead * len(lines) + int(22 * scale) + 5 + int(20 * scale) \
        + int(34 * scale) * len(sub_lines)
    y = oy + max(int(20 * scale), (sh - total) // 2)

    tracked(d, b["name"], nf, ox + pad, y, b["micro"], 3.5 * scale)
    y += int(46 * scale)

    for ln in lines:
        d.text((ox + pad, y), ln, font=hf, fill=b["ink"])
        y += lead
    y += int(14 * scale)

    d.rectangle([ox + pad, y, ox + pad + int(90 * scale), y + int(5 * scale)], fill=b["accent"])
    y += int(28 * scale)

    for ln in sub_lines:
        d.text((ox + pad, y), ln, font=sf, fill=b["body"])
        y += int(34 * scale)

    save(img, name)


if __name__ == "__main__":
    for key, label in (("otc", "OTC Learn"), ("cs", "Cornerstone")):
        print(f"\n{label}")
        p = "otclearn" if key == "otc" else "getcornerstone"

        # Avatars. One 400x400 covers X, Instagram, Threads and Bluesky; YouTube
        # and LinkedIn want their own larger source.
        avatar(key, 400, f"{p}-avatar-400.png")
        avatar(key, 800, f"{p}-avatar-800-youtube.png")
        avatar(key, 300, f"{p}-avatar-300-linkedin.png")

        # Banners, each at the platform's published spec.
        banner(key, 1500, 500, f"{p}-header-x-1500x500.png", scale=1.0)
        banner(key, 1128, 191, f"{p}-banner-linkedin-1128x191.png", scale=0.62)
        banner(key, 2560, 1440, f"{p}-banner-youtube-2560x1440.png",
               safe=(1546, 423), scale=1.5)
