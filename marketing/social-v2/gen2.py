#!/usr/bin/env python3
"""Social graphics for OTC Learn and Cornerstone — v2, September 2026.

Every colour, font, number and content string is taken from the two repos, so
the posters cannot drift away from the apps. Every poster carries a scannable
Play Store QR code and the install line.

    python3 gen2.py            # writes out2/
"""
import os
import qrcode

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "out2")
os.makedirs(OUT, exist_ok=True)

OTC_URL = "https://play.google.com/store/apps/details?id=com.otclearn.app"
CS_URL = "https://play.google.com/store/apps/details?id=io.cornerstone.study"

_f, _q = {}, {}


def F(name, size, variation=None):
    k = (name, size, variation)
    if k not in _f:
        f = ImageFont.truetype(os.path.join(FD, name), size)
        if variation:
            f.set_variation_by_name(variation)
        _f[k] = f
    return _f[k]


def QR(url, fg, box=4):
    k = (url, fg, box)
    if k not in _q:
        q = qrcode.QRCode(box_size=box, border=1,
                          error_correction=qrcode.constants.ERROR_CORRECT_M)
        q.add_data(url)
        q.make(fit=True)
        _q[k] = q.make_image(fill_color=fg, back_color="white").convert("RGB")
    return _q[k]


class OTC:
    bg = "#EAE8E0"; card = "#FFFFFF"; ink = "#181611"; body = "#3C3A35"
    micro = "#696761"; line = "#E4E1DA"; blue = "#4284C5"
    cat = {
        "ir": ("#2A75BA", "#D4EBFF", "INTEREST RATE"),
        "fx": ("#008856", "#D2F1DF", "FX"),
        "credit": ("#B14D51", "#FFDEDD", "CREDIT"),
        "equity": ("#7E5DB1", "#ECE2FF", "EQUITY"),
        "commodity": ("#996700", "#F6E6CB", "COMMODITY"),
        "foundations": ("#495766", "#E2E9F0", "MARKET FOUNDATIONS"),
        "exotics": ("#7E5DB1", "#ECE2FF", "EXOTICS"),
        "risk": ("#B14D51", "#FFDEDD", "RISK & THE GREEKS"),
        "cases": ("#495766", "#E2E9F0", "CASE STUDIES"),
        "alt": ("#996700", "#F6E6CB", "ALTERNATIVE UNDERLYINGS"),
    }
    sans = "PlusJakartaSans.ttf"


class CS:
    paper = "#f7f4ee"; paperAlt = "#f2eee5"; surface = "#fffdfa"
    ink = "#16233b"; inkBody = "#3d4a63"; muted = "#6f7a90"; meta = "#8c8578"
    brass = "#9a6b2f"; brassTint = "#f3ead9"; sage = "#3f6b57"; rust = "#9b3b34"
    rule = "#dcd8d0"
    serif = "SourceSerif4.ttf"; sans = "Archivo.ttf"; mono = "JetBrainsMono.ttf"


# ------------------------------------------------------------------ helpers
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


def block(d, text, font, x, y, maxw, lead, fill):
    for ln in wrap(d, text, font, maxw):
        d.text((x, y), ln, font=font, fill=fill)
        y += lead
    return y


def tracked(d, text, font, x, y, fill, tr=3):
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tr
    return x


def trackw(d, text, font, tr=3):
    return sum(d.textlength(c, font=font) + tr for c in text)


def save(img, name):
    img.save(os.path.join(OUT, name), "PNG", optimize=True)
    print("wrote", name, img.size)


def footer(img, d, theme, url, line1, line2, W, H, M=72, dark=False):
    """The install block every poster carries: QR right, two lines left."""
    if theme == "otc":
        ink = "#FFFFFF" if dark else OTC.ink
        sub = "#9B9791" if dark else OTC.micro
        f1 = F(OTC.sans, 34, "Bold"); f2 = F(OTC.sans, 26, "Medium")
        fq = F(OTC.sans, 19, "ExtraBold")
    else:
        ink = "#f4f1ea" if dark else CS.ink
        sub = "#8c95a6" if dark else CS.meta
        f1 = F(CS.serif, 36, "SemiBold"); f2 = F(CS.sans, 25, "Medium")
        fq = F(CS.sans, 18, "SemiBold")

    qs = 150
    q = QR(url, "#181611" if theme == "otc" else "#16233b").resize((qs, qs), Image.NEAREST)
    qx, qy = W - M - qs - 12, H - M - qs - 24
    d.rounded_rectangle([qx - 12, qy - 12, qx + qs + 12, qy + qs + 12], 8,
                        fill="#FFFFFF", outline=None)
    img.paste(q, (qx, qy))
    lbl = "SCAN TO INSTALL"
    tracked(d, lbl, fq, W - M - trackw(d, lbl, fq, 2.5) - 12, qy + qs + 22, sub, 2.5)

    d.text((M, qy + 16), line1, font=f1, fill=ink)
    d.text((M, qy + 64), line2, font=f2, fill=sub)


# =========================================================== OTC templates
def otc_quiz(fn, catkey, question, options, correct):
    W, H = 1080, 1350
    accent, soft, label = OTC.cat[catkey]
    img = Image.new("RGB", (W, H), OTC.bg)
    d = ImageDraw.Draw(img)
    M = 72
    tracked(d, "OTC LEARN", F(OTC.sans, 26, "ExtraBold"), M, M - 8, OTC.ink, 4)
    pf = F(OTC.sans, 22, "Bold")
    pw = d.textlength("DESK QUIZ", font=pf) + 44
    d.rounded_rectangle([W - M - pw, M - 14, W - M, M + 30], 22, fill=OTC.ink)
    d.text((W - M - pw / 2, M + 8), "DESK QUIZ", font=pf, fill="#FFFFFF", anchor="mm")

    top, bot = M + 84, H - 290
    d.rounded_rectangle([M, top, W - M, bot], 22, fill=OTC.card)
    px, pw_ = M + 52, W - 2 * M - 104
    y = top + 52

    lf = F(OTC.sans, 21, "ExtraBold")
    d.rounded_rectangle([px, y, px + trackw(d, label, lf) + 36, y + 42], 12, fill=soft)
    tracked(d, label, lf, px + 18, y + 8, accent, 3)
    y += 78

    y = block(d, question, F(OTC.sans, 46, "Bold"), px, y, pw_, 62, OTC.ink) + 34
    of = F(OTC.sans, 31, "Medium")
    for i, opt in enumerate(options):
        lines = wrap(d, opt, of, pw_ - 80)
        rh = max(70, 26 + 42 * len(lines))
        c = i == correct
        d.rounded_rectangle([px, y, px + pw_, y + rh], 13,
                            fill=soft if c else "#FFFFFF",
                            outline=accent if c else OTC.line, width=2 if c else 1)
        d.ellipse([px + 18, y + rh / 2 - 18, px + 54, y + rh / 2 + 18],
                  fill=accent if c else "#F1EFE9")
        d.text((px + 36, y + rh / 2 + 1), "ABCD"[i], font=F(OTC.sans, 26, "ExtraBold"),
               fill="#FFFFFF" if c else OTC.micro, anchor="mm")
        ty = y + (rh - 42 * len(lines)) / 2 + 1
        for ln in lines:
            d.text((px + 76, ty), ln, font=of, fill=OTC.ink if c else OTC.body)
            ty += 42
        y += rh + 14

    footer(img, d, "otc", OTC_URL, "Answer + why, in the app", "OTC Learn · free on Google Play", W, H)
    save(img, fn)


def otc_term(fn, catkey, term, definition):
    W, H = 1080, 1350
    accent, soft, label = OTC.cat[catkey]
    img = Image.new("RGB", (W, H), OTC.bg)
    d = ImageDraw.Draw(img)
    M = 72
    tracked(d, "OTC LEARN", F(OTC.sans, 26, "ExtraBold"), M, M - 8, OTC.ink, 4)
    tracked(d, "ONE TERM", F(OTC.sans, 23, "Bold"), W - M - 132, M - 6, OTC.micro, 3)

    top, bot = M + 84, H - 290
    d.rounded_rectangle([M, top, W - M, bot], 22, fill=OTC.card)
    px, pw_ = M + 52, W - 2 * M - 104
    y = top + 58
    lf = F(OTC.sans, 21, "ExtraBold")
    d.rounded_rectangle([px, y, px + trackw(d, label, lf) + 36, y + 42], 12, fill=soft)
    tracked(d, label, lf, px + 18, y + 8, accent, 3)
    y += 92
    y = block(d, term, F(OTC.sans, 76, "ExtraBold"), px, y, pw_, 90, OTC.ink) + 26
    d.rectangle([px, y, px + 92, y + 6], fill=accent)
    y += 44
    block(d, definition, F(OTC.sans, 36, "Regular"), px, y, pw_, 54, OTC.body)

    footer(img, d, "otc", OTC_URL, "396 terms in the glossary", "216 of them free, forever", W, H)
    save(img, fn)


def otc_slide(fn, kicker, headline, body, i, n, catkey="ir", dark=False, cta=None):
    W, H = 1080, 1350
    accent, soft, _ = OTC.cat[catkey]
    bg = OTC.ink if dark else OTC.bg
    fg = "#FFFFFF" if dark else OTC.ink
    sub = "#C0BDB7" if dark else OTC.body
    acc = "#7FB3E8" if dark else accent
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    M = 88
    tracked(d, "OTC LEARN", F(OTC.sans, 24, "ExtraBold"), M, M - 6, fg, 4)
    d.text((W - M, M - 8), f"{i}/{n}", font=F(OTC.sans, 26, "Bold"),
           fill="#8C8A84" if dark else OTC.micro, anchor="ra")

    last = i == n
    hf = F(OTC.sans, 80 if len(headline) < 40 else 64, "ExtraBold")
    hl = 94 if len(headline) < 40 else 80
    bf = F(OTC.sans, 38, "Regular")
    ch = (60 if kicker else 0) + hl * len(wrap(d, headline, hf, W - 2 * M)) + 36 + 7 + 50
    if body:
        ch += 56 * len(wrap(d, body, bf, W - 2 * M))
    atop, abot = M + 140, H - (300 if last else 250)
    y = max(atop, atop + (abot - atop - ch) / 2)
    if kicker:
        tracked(d, kicker.upper(), F(OTC.sans, 25, "ExtraBold"), M, y, acc, 4)
        y += 60
    y = block(d, headline, hf, M, y, W - 2 * M, hl, fg) + 36
    d.rectangle([M, y, M + 106, y + 7], fill=acc)
    y += 50
    if body:
        block(d, body, bf, M, y, W - 2 * M, 56, sub)

    if last and cta:
        footer(img, d, "otc", OTC_URL, cta, "Search “OTC Learn” on Google Play", W, H, 88, dark)
    else:
        footer(img, d, "otc", OTC_URL, "Free. Offline. No account.",
               "OTC Learn on Google Play", W, H, 88, dark)
    save(img, fn)


def otc_cases(fn, rows, i, n):
    """A case-study slide: three failures, each a name, a year and the mechanism."""
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), OTC.ink)
    d = ImageDraw.Draw(img)
    M = 88
    tracked(d, "OTC LEARN · CASE STUDIES", F(OTC.sans, 22, "ExtraBold"), M, M - 6, "#FFFFFF", 4)
    d.text((W - M, M - 8), f"{i}/{n}", font=F(OTC.sans, 26, "Bold"), fill="#8C8A84", anchor="ra")

    y = M + 150
    for name, hook in rows:
        d.text((M, y), name, font=F(OTC.sans, 52, "ExtraBold"), fill="#FFFFFF")
        y += 66
        y = block(d, hook, F(OTC.sans, 34, "Regular"), M, y, W - 2 * M - 40, 48, "#B8B4AE")
        y += 26
        d.rectangle([M, y, W - M, y + 1], fill="#33302B")
        y += 44

    footer(img, d, "otc", OTC_URL, "Twelve, in full, in the app",
           "OTC Learn · Case Studies", W, H, M, dark=True)
    save(img, fn)


def otc_tiers(fn):
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), OTC.bg)
    d = ImageDraw.Draw(img)
    M = 72
    tracked(d, "OTC LEARN", F(OTC.sans, 26, "ExtraBold"), M, M - 8, OTC.ink, 4)
    tracked(d, "WHAT IS FREE", F(OTC.sans, 23, "Bold"), W - M - 180, M - 6, OTC.micro, 3)

    y = M + 96
    d.rounded_rectangle([M, y, W - M, y + 400], 22, fill=OTC.card)
    px = M + 48
    ty = y + 42
    d.rounded_rectangle([px, ty, px + 210, ty + 42], 12, fill="#D9F0E3")
    tracked(d, "FREE, FOREVER", F(OTC.sans, 21, "ExtraBold"), px + 18, ty + 8, "#0B6B45", 3)
    ty += 78
    ty = block(d, "36 products. 180 lesson steps. 432 questions. 216 terms.",
               F(OTC.sans, 44, "Bold"), px, ty, W - 2 * M - 96, 58, OTC.ink) + 16
    block(d, "Interest Rate, FX, Credit, Equity, Commodity and Market Foundations — "
             "everything the app shipped with, and nothing was moved behind the paywall later.",
          F(OTC.sans, 30, "Regular"), px, ty, W - 2 * M - 96, 44, OTC.body)

    y += 430
    d.rounded_rectangle([M, y, W - M, y + 370], 22, fill=OTC.ink)
    ty = y + 42
    d.rounded_rectangle([px, ty, px + 262, ty + 42], 12, fill="#33302B")
    tracked(d, "WHAT A SUB ADDS", F(OTC.sans, 21, "ExtraBold"), px + 18, ty + 8, "#D9CFA8", 3)
    ty += 78
    ty = block(d, "30 more products. A second question bank on every free one.",
               F(OTC.sans, 42, "Bold"), px, ty, W - 2 * M - 96, 56, "#FFFFFF") + 14
    block(d, "Exotics · Risk & the Greeks · twelve Case Studies · Alternative Underlyings. "
             "From ₹29 a month.",
          F(OTC.sans, 30, "Regular"), px, ty, W - 2 * M - 96, 44, "#B8B4AE")

    footer(img, d, "otc", OTC_URL, "Read it all without ever seeing a paywall",
           "OTC Learn · free on Google Play", W, H)
    save(img, fn)


def promo_card(fn, theme, code, days, headline, sub, until, path):
    W, H = 1080, 1350
    if theme == "otc":
        bg, ink, body, acc, url = OTC.bg, OTC.ink, OTC.body, OTC.blue, OTC_URL
        brand = "OTC LEARN"
        hf = F(OTC.sans, 62, "ExtraBold"); bf = F(OTC.sans, 34, "Regular")
        cf = F(OTC.sans, 96, "ExtraBold"); ef = F(OTC.sans, 22, "ExtraBold")
        card = OTC.card
    else:
        bg, ink, body, acc, url = CS.paper, CS.ink, CS.inkBody, CS.brass, CS_URL
        brand = "CORNERSTONE"
        hf = F(CS.serif, 64, "SemiBold"); bf = F(CS.sans, 33, "Regular")
        cf = F(CS.mono, 86, "Bold"); ef = F(CS.sans, 21, "SemiBold")
        card = CS.surface
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    M = 72
    tracked(d, brand, ef, M, M - 4, ink, 4)
    tracked(d, f"{days} DAYS FREE", ef, W - M - trackw(d, f"{days} DAYS FREE", ef, 3), M - 4, acc, 3)

    hh = 78 * len(wrap(d, headline, hf, W - 2 * M))
    sh = 48 * len(wrap(d, sub, bf, W - 2 * M - 40))
    total = hh + 28 + sh + 54 + 250
    y = (M + 130) + max(0, ((H - 300) - (M + 130) - total) / 2)
    y = block(d, headline, hf, M, y, W - 2 * M, 78, ink) + 28
    y = block(d, sub, bf, M, y, W - 2 * M - 40, 48, body) + 54

    ch = 250
    d.rounded_rectangle([M, y, W - M, y + ch], 14, fill=card, outline=acc, width=2)
    tracked(d, path.upper(), ef, M + 44, y + 40,
            CS.meta if theme == "cs" else OTC.micro, 3)
    d.text((W / 2, y + 138), code, font=cf, fill=acc, anchor="mm")
    d.text((W / 2, y + 208), f"Valid until {until}. No card, no account, nothing renews.",
           font=F(OTC.sans if theme == "otc" else CS.sans, 25, "Medium"),
           fill=CS.meta if theme == "cs" else OTC.micro, anchor="mm")

    footer(img, d, theme, url, "Install first, then redeem",
           "Free on Google Play", W, H)
    save(img, fn)


def otc_hero(fn):
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), OTC.bg)
    d = ImageDraw.Draw(img)
    M = 90
    tracked(d, "OTC LEARN", F(OTC.sans, 24, "ExtraBold"), M, M - 6, OTC.ink, 4)
    y = M + 116
    y = block(d, "The derivatives everyone in the room pretends to understand.",
              F(OTC.sans, 76, "ExtraBold"), M, y, W - 2 * M - 300, 92, OTC.ink) + 28
    d.rectangle([M, y, M + 116, y + 7], fill=OTC.blue)
    y += 44
    block(d, "66 products. A five-step lesson, a worked example and a question bank on every one. "
             "36 products free forever.",
          F(OTC.sans, 34, "Regular"), M, y, W - 2 * M - 320, 50, OTC.body)

    x = M
    for num, lab in [("66", "PRODUCTS"), ("1,224", "QUESTIONS"), ("0", "ADS OR TRACKERS")]:
        d.text((x, H - M - 104), num, font=F(OTC.sans, 54, "ExtraBold"), fill=OTC.ink)
        d.text((x, H - M - 34), lab, font=F(OTC.sans, 23, "Medium"), fill=OTC.micro)
        x += max(d.textlength(num, font=F(OTC.sans, 54, "ExtraBold")),
                 d.textlength(lab, font=F(OTC.sans, 23, "Medium"))) + 84

    qs = 190
    q = QR(OTC_URL, "#181611").resize((qs, qs), Image.NEAREST)
    d.rounded_rectangle([W - M - qs - 14, M - 14 + 40, W - M + 14, M + qs + 14 + 40], 10, fill="#FFFFFF")
    img.paste(q, (W - M - qs, M + 40))
    lbl = "SCAN TO INSTALL"
    fq = F(OTC.sans, 19, "ExtraBold")
    tracked(d, lbl, fq, W - M - qs + (qs - trackw(d, lbl, fq, 2.5)) / 2, M + qs + 66, OTC.micro, 2.5)
    save(img, fn)


# ==================================================== Cornerstone templates
def cs_snapshot(fn, topic, eyebrow, title, body, formula=None):
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), CS.paper)
    d = ImageDraw.Draw(img)
    M = 72
    px, pw_ = M + 50, W - 2 * M - 100
    tf = F(CS.serif, 58, "SemiBold"); bf = F(CS.sans, 32, "Regular")

    d.text((M, M - 6), topic, font=F(CS.serif, 42, "SemiBold"), fill=CS.ink)
    tracked(d, "CORNERSTONE", F(CS.sans, 21, "SemiBold"), W - M - 186, M + 6, CS.meta, 3)
    d.rectangle([M, M + 70, M + 190, M + 75], fill=CS.ink)
    d.rectangle([M + 206, M + 72, W - M, M + 75], fill=CS.rule)

    ch = 50 + 62 + 74 * len(wrap(d, title, tf, pw_)) + 32 + 50 * len(wrap(d, body, bf, pw_)) + 34
    if formula:
        ch += 112 + 40
    ch += 40 + 76
    top = M + 122
    bot = min(top + ch, H - 300)
    d.rounded_rectangle([M, top, W - M, bot], 8, fill=CS.surface, outline=CS.rule)

    y = top + 50
    tracked(d, eyebrow.upper(), F(CS.mono, 21, "Bold"), px, y, CS.brass, 4)
    d.text((W - M - 50, y - 22), "1", font=F(CS.serif, 80, "Regular"), fill="#e4dfd4", anchor="ra")
    y += 62
    y = block(d, title, tf, px, y, pw_, 74, CS.ink) + 32
    y = block(d, body, bf, px, y, pw_, 50, CS.inkBody) + 34
    if formula:
        d.rounded_rectangle([px, y, px + pw_, y + 112], 6, fill=CS.brassTint)
        tracked(d, "FORMULA", F(CS.mono, 19, "Bold"), px + 26, y + 20, CS.meta, 3)
        d.text((px + 26, y + 52), formula, font=F(CS.mono, 32, "Regular"), fill=CS.ink)
        y += 152
    else:
        y += 8
    d.text((px, y), "Tap the card for the exam angle", font=F(CS.sans, 25, "SemiBold"), fill=CS.muted)

    footer(img, d, "cs", CS_URL, "Fifteen honest minutes.", "Cornerstone · free on Google Play", W, H)
    save(img, fn)


def cs_quiz(fn, exam, question, options, correct):
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), CS.paper)
    d = ImageDraw.Draw(img)
    M = 72
    d.text((M, M - 6), exam, font=F(CS.serif, 42, "SemiBold"), fill=CS.ink)
    tracked(d, "CORNERSTONE", F(CS.sans, 21, "SemiBold"), W - M - 186, M + 6, CS.meta, 3)
    d.rectangle([M, M + 70, W - M, M + 73], fill=CS.rule)

    top, bot = M + 116, H - 300
    d.rounded_rectangle([M, top, W - M, bot], 8, fill=CS.surface, outline=CS.rule)
    px, pw_ = M + 50, W - 2 * M - 100
    y = top + 46
    tracked(d, "PRACTICE QUESTION", F(CS.mono, 20, "Bold"), px, y, CS.brass, 4)
    y += 58
    y = block(d, question, F(CS.serif, 43, "SemiBold"), px, y, pw_, 58, CS.ink) + 30
    of = F(CS.sans, 29, "Regular")
    for i, opt in enumerate(options):
        lines = wrap(d, opt, of, pw_ - 74)
        rh = max(66, 24 + 42 * len(lines))
        c = i == correct
        d.rounded_rectangle([px, y, px + pw_, y + rh], 5,
                            fill="#f4f8f5" if c else CS.paperAlt,
                            outline=CS.sage if c else CS.rule, width=2 if c else 1)
        d.text((px + 24, y + rh / 2 + 1), "ABCD"[i], font=F(CS.mono, 25, "Bold"),
               fill=CS.sage if c else CS.meta, anchor="lm")
        ty = y + (rh - 42 * len(lines)) / 2 + 1
        for ln in lines:
            d.text((px + 74, ty), ln, font=of, fill=CS.ink if c else CS.inkBody)
            ty += 42
        y += rh + 13

    footer(img, d, "cs", CS_URL, "Explanation + curriculum reference",
           "on every answer, right or wrong", W, H)
    save(img, fn)


def cs_slide(fn, kicker, headline, body, i, n, dark=False, cta=None):
    W, H = 1080, 1350
    bg = "#131c2e" if dark else CS.paper
    fg = "#f4f1ea" if dark else CS.ink
    sub = "#c3c8d2" if dark else CS.inkBody
    acc = "#e0b26a" if dark else CS.brass
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    M = 88
    tracked(d, "CORNERSTONE", F(CS.sans, 21, "SemiBold"), M, M - 4, acc if dark else CS.meta, 4)
    d.text((W - M, M - 8), f"{i}/{n}", font=F(CS.mono, 25, "Bold"),
           fill="#8c95a6" if dark else CS.meta, anchor="ra")

    last = i == n
    hf = F(CS.serif, 82 if len(headline) < 38 else 66, "SemiBold")
    hl = 96 if len(headline) < 38 else 82
    bf = F(CS.sans, 36, "Regular")
    ch = (58 if kicker else 0) + hl * len(wrap(d, headline, hf, W - 2 * M)) + 34 + 5 + 48
    if body:
        ch += 54 * len(wrap(d, body, bf, W - 2 * M))
    atop, abot = M + 130, H - (300 if last else 250)
    y = max(atop, atop + (abot - atop - ch) / 2)
    if kicker:
        tracked(d, kicker.upper(), F(CS.mono, 23, "Bold"), M, y, acc, 4)
        y += 58
    y = block(d, headline, hf, M, y, W - 2 * M, hl, fg) + 34
    d.rectangle([M, y, M + 106, y + 5], fill=acc)
    y += 48
    if body:
        block(d, body, bf, M, y, W - 2 * M, 54, sub)

    footer(img, d, "cs", CS_URL,
           cta if (last and cta) else "Fifteen honest minutes.",
           "Search “Cornerstone Exam Study” on Play" if last else "Cornerstone on Google Play",
           W, H, M, dark)
    save(img, fn)


def cs_glossary(fn, terms):
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), CS.paper)
    d = ImageDraw.Draw(img)
    M = 72
    d.text((M, M - 6), "Glossary", font=F(CS.serif, 42, "SemiBold"), fill=CS.ink)
    tracked(d, "ALWAYS FREE", F(CS.sans, 21, "SemiBold"), W - M - 158, M + 6, CS.brass, 3)
    d.rectangle([M, M + 70, W - M, M + 73], fill=CS.rule)

    top, bot = M + 116, H - 300
    d.rounded_rectangle([M, top, W - M, bot], 8, fill=CS.surface, outline=CS.rule)
    px, pw_ = M + 50, W - 2 * M - 100
    y = top + 46
    y = block(d, "260 terms. Type “var”, get Value at Risk.",
              F(CS.serif, 46, "SemiBold"), px, y, pw_, 58, CS.ink) + 34
    for term, aka, definition in terms:
        d.text((px, y), term, font=F(CS.serif, 34, "SemiBold"), fill=CS.ink)
        if aka:
            d.text((px + d.textlength(term, font=F(CS.serif, 34, "SemiBold")) + 14, y + 8),
                   aka, font=F(CS.mono, 21, "Bold"), fill=CS.brass)
        y += 46
        y = block(d, definition, F(CS.sans, 27, "Regular"), px, y, pw_, 40, CS.inkBody) + 14
        d.rectangle([px, y, px + pw_, y + 1], fill=CS.rule)
        y += 24

    footer(img, d, "cs", CS_URL, "Free whether you subscribe or not",
           "Cornerstone · Google Play", W, H)
    save(img, fn)


def cs_hero(fn):
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), CS.paper)
    d = ImageDraw.Draw(img)
    M = 90
    tracked(d, "CORNERSTONE", F(CS.sans, 23, "SemiBold"), M, M - 6, CS.ink, 4)
    y = M + 116
    y = block(d, "Fifteen honest minutes beats three distracted hours.",
              F(CS.serif, 80, "SemiBold"), M, y, W - 2 * M - 300, 96, CS.ink) + 26
    d.rectangle([M, y, M + 116, y + 6], fill=CS.brass)
    y += 42
    block(d, "Snapshot cards and five-question sessions for CFA® and FRM® candidates. "
             "Spaced repetition built in, and a 260-term glossary that is always free.",
          F(CS.sans, 32, "Regular"), M, y, W - 2 * M - 320, 48, CS.inkBody)

    x = M
    for num, lab in [("38", "TOPIC AREAS"), ("5", "EXAM LEVELS"), ("260", "GLOSSARY TERMS")]:
        d.text((x, H - M - 104), num, font=F(CS.serif, 56, "SemiBold"), fill=CS.ink)
        d.text((x, H - M - 34), lab, font=F(CS.sans, 22, "Medium"), fill=CS.meta)
        x += max(d.textlength(num, font=F(CS.serif, 56, "SemiBold")),
                 d.textlength(lab, font=F(CS.sans, 22, "Medium"))) + 84

    qs = 190
    q = QR(CS_URL, "#16233b").resize((qs, qs), Image.NEAREST)
    d.rounded_rectangle([W - M - qs - 14, M + 26, W - M + 14, M + qs + 54], 8, fill="#FFFFFF")
    img.paste(q, (W - M - qs, M + 40))
    lbl = "SCAN TO INSTALL"
    fq = F(CS.sans, 18, "SemiBold")
    tracked(d, lbl, fq, W - M - qs + (qs - trackw(d, lbl, fq, 2.5)) / 2, M + qs + 66, CS.meta, 2.5)
    save(img, fn)


def cs_countdown(fn, exam, date_line, days, body):
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), "#131c2e")
    d = ImageDraw.Draw(img)
    M = 88
    tracked(d, "CORNERSTONE", F(CS.sans, 21, "SemiBold"), M, M - 4, "#e0b26a", 4)
    y = M + 180
    tracked(d, exam.upper(), F(CS.mono, 24, "Bold"), M, y, "#e0b26a", 4)
    y += 76
    d.text((M, y), days, font=F(CS.serif, 200, "SemiBold"), fill="#f4f1ea")
    y += 210
    d.text((M, y), "days", font=F(CS.serif, 60, "Regular"), fill="#8c95a6")
    y += 96
    d.rectangle([M, y, M + 106, y + 5], fill="#e0b26a")
    y += 46
    y = block(d, date_line, F(CS.sans, 38, "Medium"), M, y, W - 2 * M, 54, "#f4f1ea") + 12
    block(d, body, F(CS.sans, 32, "Regular"), M, y, W - 2 * M - 40, 48, "#c3c8d2")

    footer(img, d, "cs", CS_URL, "Five questions a day.", "Cornerstone · free on Google Play",
           W, H, M, dark=True)
    save(img, fn)


# ==================================================================== CONTENT
if __name__ == "__main__":
    # ---------------------------------------------------------- OTC Learn
    otc_hero("otc-hero-x.png")

    otc_quiz("otc-quiz-01-irs.png", "ir",
             "On a $200m swap the fixed payer pays 3% and the floating leg sets at 3.8% for a full year. What settles?",
             ["The floating payer pays $1.6m to the fixed payer",
              "The fixed payer pays $1.6m to the floating payer",
              "The fixed payer pays $6m and receives nothing",
              "Both parties pay gross: $6m and $7.6m"], 0)

    otc_quiz("otc-quiz-02-fx.png", "fx",
             "Spot EUR/USD is 1.0800. Six-month dollar rates are 4%, euro rates 2%. Roughly where is the six-month forward?",
             ["Below 1.0800 — the dollar pays the higher rate",
              "At 1.0800 — the forward forecasts spot",
              "Above 1.0800, at about 1.0907",
              "Above 1.0800, at about 1.1012"], 2)

    otc_quiz("otc-quiz-03-credit.png", "credit",
             "A name trades at 250bp but the contract carries the standard 100bp coupon. How is the difference handled?",
             ["The coupon resets to 250bp for the life of the trade",
              "The notional is scaled up until the coupons match",
              "The buyer pays an upfront amount at inception",
              "The seller rebates the difference at maturity"], 2)

    otc_quiz("otc-quiz-04-commodity.png", "commodity",
             "An airline pays $95 a barrel fixed and receives the index on 50,000 barrels. The index averages $102. What settles?",
             ["The airline pays $350,000",
              "The airline receives $350,000",
              "The airline receives $5,100,000",
              "Both sides pay gross: $4.75m and $5.10m"], 1)

    otc_term("otc-term-01-notional.png", "ir", "Notional",
             "The reference amount interest is calculated on. It is never exchanged in a standard swap.")
    otc_term("otc-term-02-vm.png", "foundations", "Variation margin",
             "Collateral that settles the change in a portfolio’s mark-to-market, so neither side carries an unpaid gain or loss.")
    otc_term("otc-term-03-points.png", "fx", "Forward points",
             "The adjustment added to or subtracted from spot to give the forward rate, driven by the interest rate differential.")

    # Interest rate swap carousel
    otc_slide("otc-swap-1.png", None, "You have nodded along in a meeting about basis risk.",
              "Six slides. No jargon left undefined.", 1, 6, "ir", dark=True)
    otc_slide("otc-swap-2.png", "What it is", "Two parties swap one interest stream for another.",
              "One side pays a rate fixed at inception. The other pays a rate that resets against a published benchmark such as SOFR.",
              2, 6, "ir")
    otc_slide("otc-swap-3.png", "The trick", "The notional is never exchanged.",
              "It is only the number the interest is calculated on. $200m notional does not mean $200m changes hands — ever.",
              3, 6, "ir")
    otc_slide("otc-swap-4.png", "Worked", "$200m. Fixed 3%. Floating sets at 3.8%.",
              "Only the difference settles: 0.8% of $200m = $1.6m, paid by the floating payer to the fixed payer.",
              4, 6, "ir")
    otc_slide("otc-swap-5.png", "Why it exists",
              "A borrower turns a floating loan into a fixed one without refinancing it.",
              "Same debt, different rate profile. That is most of what the swap market is for.",
              5, 6, "ir")
    otc_slide("otc-swap-6.png", None, "36 products free. Same five steps each.",
              "Interest rate, FX, credit, equity, commodity, and the market plumbing underneath. 432 questions. Works with no signal.",
              6, 6, "ir", dark=True, cta="Free on Google Play")

    # Case studies carousel
    otc_slide("otc-cases-1.png", None, "Twelve failures worth understanding.",
              "Each one a mechanism taken to its conclusion — and most of them a hedge that worked until it had to be funded.",
              1, 6, "cases", dark=True)
    otc_cases("otc-cases-2.png", [
        ("Barings, 1995", "One trader, both sides of his own desk"),
        ("Metallgesellschaft, 1993", "The right hedge, on the wrong clock"),
        ("Orange County, 1994", "A conservative bond portfolio, borrowed three times over"),
    ], 2, 6)
    otc_cases("otc-cases-3.png", [
        ("Long-Term Capital Management, 1998", "Convergence trades, twenty-five times over"),
        ("Ashanti Goldfields, 1999", "Seven years of production, sold forward"),
        ("Amaranth, 2006", "A spread trade too large to leave"),
    ], 3, 6)
    otc_cases("otc-cases-4.png", [
        ("Société Générale, 2008", "Fictitious hedges, and a €4.9bn exit"),
        ("The London Whale, 2012", "A hedge that grew into the market it was hedging"),
        ("The Swiss franc floor, 2015", "A guarantee withdrawn in a morning"),
    ], 4, 6)
    otc_cases("otc-cases-5.png", [
        ("Archegos, 2021", "Five banks, one position, and none of them could see it"),
        ("The LME nickel squeeze, 2022", "A hedge that could not be delivered into"),
        ("The gilt LDI crisis, 2022", "Pension hedges that worked, and could not be funded"),
    ], 5, 6)
    otc_slide("otc-cases-6.png", None, "The pattern is almost always funding.",
              "Not a wrong view. A right view held past the point the collateral call arrives. That is the thread through all twelve.",
              6, 6, "cases", dark=True, cta="Case Studies, in OTC Learn")

    otc_tiers("otc-tiers.png")

    otc_slide("otc-exotics.png", "Exotics",
              "A vanilla that switches on or off at a level.",
              "Barriers, digitals, range accruals, accumulators, target redemption forwards and cliquets — six products, one lesson each.",
              1, 1, "exotics")

    otc_slide("otc-risk.png", "Risk & the Greeks",
              "One number for tomorrow’s loss, and what it leaves out.",
              "DV01, delta and gamma, vega and the surface, CS01 and jump to default, P&L attribution, and Value at Risk.",
              1, 1, "risk")

    promo_card("otc-promo.png", "otc", "OTCLAUNCH", 60,
               "Sixty days of everything, free.",
               "Exotics, Risk & the Greeks, twelve Case Studies, Alternative Underlyings, and a second question bank on all 36 free products.",
               "31 December 2026", "Redeem: Profile → Subscription → Have a promo code?")

    # -------------------------------------------------------- Cornerstone
    cs_hero("cs-hero-x.png")

    cs_snapshot("cs-card-01-fixedincome.png", "Fixed Income", "Core idea",
                "A bond’s price is just discounted cash flow",
                "Price is the present value of every coupon plus the redemption amount, discounted at the market yield. Because the yield sits in the denominator, price and yield always move in opposite directions.",
                "P = Σ C/(1+r)^t + FV/(1+r)^n")
    cs_snapshot("cs-card-02-ethics.png", "Ethics", "Core idea",
                "When laws conflict, follow the stricter one",
                "Members must comply with the most strict of applicable law, the Code and the Standards. Less strict local law never excuses a Standards violation, and members must not knowingly assist anyone else in a violation.")
    cs_snapshot("cs-card-03-mnpi.png", "Ethics", "Test",
                "Material and non-public — both, or neither matters",
                "Information is material if a reasonable investor would want it. It is non-public until disseminated broadly. Material but public, or non-public but immaterial, carries no restriction at all.")

    cs_quiz("cs-quiz-01-frm.png", "FRM · Part I",
            "A portfolio returns 12% with a standard deviation of 18% and a beta of 1.2. The risk-free rate is 3%. Its Treynor ratio is closest to:",
            ["0.050", "0.075", "0.090", "0.500"], 1)
    cs_quiz("cs-quiz-02-frm.png", "FRM · Part I",
            "Two portfolios show identical Sharpe ratios but different Treynor ratios. This most likely indicates that:",
            ["One portfolio holds significant undiversified specific risk",
             "One portfolio is leveraged",
             "The risk-free rate was measured differently",
             "Both portfolios are fully diversified"], 0)
    cs_quiz("cs-quiz-03-cfa.png", "CFA · Level I",
            "A member works where regulation permits front-running client orders. The Code and Standards prohibit it. The member must:",
            ["Follow local law",
             "Follow the stricter Code and Standards",
             "Disclose the practice and proceed",
             "Seek written employer approval"], 1)

    cs_glossary("cs-glossary.png", [
        ("Value at Risk", "VaR",
         "The loss that will not be exceeded over a stated horizon with a stated confidence."),
        ("Expected shortfall", "ES · CVaR",
         "The average loss in the cases where the VaR threshold is breached — the size of a bad day, given that it is a bad day."),
        ("Coherent risk measure", "",
         "Monotonicity, subadditivity, positive homogeneity, translation invariance. Subadditivity is the one VaR fails."),
    ])

    cs_slide("cs-study-1.png", None, "Fifteen honest minutes beats three distracted hours.",
             "Six slides on how to study when you already have a job.", 1, 6, dark=True)
    cs_slide("cs-study-2.png", "The problem", "Re-reading feels like progress. It is not.",
             "Recognition is not recall. If you have not tried to retrieve it, you do not know whether you have it.",
             2, 6)
    cs_slide("cs-study-3.png", "One session", "Snapshot cards, then five questions.",
             "The core idea, the formula that does the work, and the angle the examiners actually test — then prove it.",
             3, 6)
    cs_slide("cs-study-4.png", "The queue", "Anything you miss comes back tomorrow.",
             "Then in four days, then in ten, then less often as it sticks. Three clean passes and it retires.",
             4, 6)
    cs_slide("cs-study-5.png", "Weighted", "Your progress bar respects the exam weights.",
             "A 15–20% topic counts for more than a 5–8% one, so the number on the home screen means something.",
             5, 6)
    cs_slide("cs-study-6.png", None, "38 topic areas, free. 260 glossary terms, free.",
             "CFA Levels I–III and FRM Parts I and II, side by side. Everything the app shipped with stays free, permanently.",
             6, 6, dark=True, cta="Free on Google Play")

    cs_countdown("cs-frm-countdown.png", "FRM Part I & Part II", "15 November 2026",
                 "58", "Eight weeks. Five questions a day is 280 questions between now and the paper.")

    promo_card("cs-promo.png", "cs", "CORNERSTONE30", 30,
               "Thirty days of every segment.",
               "The deeper segments drawn along the official learning modules, for both programmes and every level — no card, no account.",
               "30 June 2027", "Redeem: Profile → Cornerstone Plus → Have a code?")

    promo_card("cs-promo-class.png", "cs", "CFACLASS", 60,
               "Sixty days, for a study group.",
               "Made for a cohort: share it with your class or your CFA society and everyone gets the full segment bank for two months.",
               "30 June 2027", "Redeem: Profile → Cornerstone Plus → Have a code?")
