#!/usr/bin/env python3
"""Social graphics generator for OTC Learn and Cornerstone.

Every colour, font and content string below is taken from the two repos, so the
output matches what a viewer actually sees when they open the app.
"""
import os
from PIL import Image, ImageDraw, ImageFont

FD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
os.makedirs(OUT, exist_ok=True)

_cache = {}


def F(name, size, variation=None):
    key = (name, size, variation)
    if key not in _cache:
        f = ImageFont.truetype(os.path.join(FD, name), size)
        if variation:
            f.set_variation_by_name(variation)
        _cache[key] = f
    return _cache[key]


# ---------------------------------------------------------------- OTC Learn
class OTC:
    bg = "#EAE8E0"
    card = "#FFFFFF"
    ink = "#181611"
    body = "#3C3A35"
    muted = "#65635D"
    micro = "#696761"
    line = "#E4E1DA"
    blue = "#4284C5"
    cat = {
        "ir": ("#2A75BA", "#D4EBFF", "INTEREST RATE"),
        "fx": ("#008856", "#D2F1DF", "FX"),
        "credit": ("#B14D51", "#FFDEDD", "CREDIT"),
        "equity": ("#7E5DB1", "#ECE2FF", "EQUITY"),
        "commodity": ("#996700", "#F6E6CB", "COMMODITY"),
        "foundations": ("#495766", "#E2E9F0", "MARKET FOUNDATIONS"),
    }
    sans = "PlusJakartaSans.ttf"


# --------------------------------------------------------------- Cornerstone
class CS:
    paper = "#f7f4ee"
    paperAlt = "#f2eee5"
    surface = "#fffdfa"
    ink = "#16233b"
    inkBody = "#3d4a63"
    muted = "#6f7a90"
    meta = "#8c8578"
    brass = "#9a6b2f"
    brassText = "#7d5620"
    brassTint = "#f3ead9"
    sage = "#3f6b57"
    rust = "#9b3b34"
    rule = "#dcd8d0"
    serif = "SourceSerif4.ttf"
    sans = "Archivo.ttf"
    mono = "JetBrainsMono.ttf"


# ------------------------------------------------------------------- helpers
def wrap(draw, text, font, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def block(draw, text, font, x, y, maxw, leading, fill):
    for ln in wrap(draw, text, font, maxw):
        draw.text((x, y), ln, font=font, fill=fill)
        y += leading
    return y


def tracked(draw, text, font, x, y, fill, track=3):
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + track
    return x


def save(img, name):
    p = os.path.join(OUT, name)
    img.save(p, "PNG", optimize=True)
    print("wrote", name, img.size)


# =========================================================== OTC: quiz card
def otc_quiz(fn, catkey, question, options, correct, size=(1080, 1350)):
    W, H = size
    accent, soft, label = OTC.cat[catkey]
    img = Image.new("RGB", (W, H), OTC.bg)
    d = ImageDraw.Draw(img)
    M = 72

    tracked(d, "OTC LEARN", F(OTC.sans, 26, "ExtraBold"), M, M - 8, OTC.ink, 4)
    pill = "DESK QUIZ"
    pf = F(OTC.sans, 22, "Bold")
    pw = d.textlength(pill, font=pf) + 24 * len(pill) * 0 + 44
    d.rounded_rectangle([W - M - pw, M - 14, W - M, M + 30], 22, fill=OTC.ink)
    d.text((W - M - pw / 2, M + 8), pill, font=pf, fill="#FFFFFF", anchor="mm")

    top = M + 84
    bot = H - M - 92
    d.rounded_rectangle([M, top, W - M, bot], 22, fill=OTC.card)

    px = M + 56
    pw_ = W - 2 * M - 112
    y = top + 58

    lf = F(OTC.sans, 22, "ExtraBold")
    lw = tracked(d, label, lf, px + 20, y + 9, accent, 3) - px - 20
    d.rounded_rectangle([px, y, px + lw + 40, y + 44], 12, fill=soft)
    tracked(d, label, lf, px + 20, y + 9, accent, 3)
    y += 84

    qf = F(OTC.sans, 50, "Bold")
    y = block(d, question, qf, px, y, pw_, 66, OTC.ink) + 40

    of = F(OTC.sans, 34, "Medium")
    cf = F(OTC.sans, 28, "ExtraBold")
    for i, opt in enumerate(options):
        lines = wrap(d, opt, of, pw_ - 84)
        rh = max(76, 28 + 46 * len(lines))
        is_c = i == correct
        d.rounded_rectangle(
            [px, y, px + pw_, y + rh], 14,
            fill=soft if is_c else "#FFFFFF",
            outline=accent if is_c else OTC.line, width=2 if is_c else 1)
        d.ellipse([px + 20, y + rh / 2 - 20, px + 60, y + rh / 2 + 20],
                  fill=accent if is_c else "#F1EFE9")
        d.text((px + 40, y + rh / 2 + 1), "ABCD"[i], font=cf,
               fill="#FFFFFF" if is_c else OTC.micro, anchor="mm")
        ty = y + (rh - 46 * len(lines)) / 2 + 2
        for ln in lines:
            d.text((px + 84, ty), ln, font=of,
                   fill=OTC.ink if is_c else OTC.body)
            ty += 46
        y += rh + 16

    ff = F(OTC.sans, 28, "SemiBold")
    d.text((M, H - M - 44), "Answer + why, in the app", font=ff, fill=OTC.ink)
    d.text((W - M, H - M - 44), "Free on Google Play", font=F(OTC.sans, 28, "Medium"),
           fill=OTC.micro, anchor="ra")
    save(img, fn)


# =========================================================== OTC: term card
def otc_term(fn, catkey, term, definition, size=(1080, 1350)):
    W, H = size
    accent, soft, label = OTC.cat[catkey]
    img = Image.new("RGB", (W, H), OTC.bg)
    d = ImageDraw.Draw(img)
    M = 72
    tracked(d, "OTC LEARN", F(OTC.sans, 26, "ExtraBold"), M, M - 8, OTC.ink, 4)
    tracked(d, "ONE TERM", F(OTC.sans, 24, "Bold"), W - M - 138, M - 6, OTC.micro, 3)

    d.rounded_rectangle([M, M + 96, W - M, H - M - 96], 22, fill=OTC.card)
    px, pw_ = M + 56, W - 2 * M - 112
    y = M + 96 + 64

    lf = F(OTC.sans, 22, "ExtraBold")
    lw = 0
    for ch in label:
        lw += d.textlength(ch, font=lf) + 3
    d.rounded_rectangle([px, y, px + lw + 40, y + 44], 12, fill=soft)
    tracked(d, label, lf, px + 20, y + 9, accent, 3)
    y += 96

    tf = F(OTC.sans, 78, "ExtraBold")
    y = block(d, term, tf, px, y, pw_, 92, OTC.ink) + 28
    d.rectangle([px, y, px + 96, y + 6], fill=accent)
    y += 48
    block(d, definition, F(OTC.sans, 38, "Regular"), px, y, pw_, 56, OTC.body)

    d.text((M, H - M - 44), "216 terms. All offline.", font=F(OTC.sans, 28, "SemiBold"), fill=OTC.ink)
    d.text((W - M, H - M - 44), "OTC Learn · Google Play", font=F(OTC.sans, 28, "Medium"),
           fill=OTC.micro, anchor="ra")
    save(img, fn)


# ======================================================= OTC: carousel slide
def otc_slide(fn, kicker, headline, body, index, total, accentkey="ir",
              dark=False, cta=None, size=(1080, 1350)):
    W, H = size
    accent, soft, _ = OTC.cat[accentkey]
    bg = OTC.ink if dark else OTC.bg
    fg = "#FFFFFF" if dark else OTC.ink
    sub = "#C0BDB7" if dark else OTC.body
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    M = 88

    tracked(d, "OTC LEARN", F(OTC.sans, 24, "ExtraBold"), M, M - 6,
            "#FFFFFF" if dark else OTC.ink, 4)
    d.text((W - M, M - 8), f"{index}/{total}", font=F(OTC.sans, 26, "Bold"),
           fill="#8C8A84" if dark else OTC.micro, anchor="ra")

    hf = F(OTC.sans, 84 if len(headline) < 40 else 68, "ExtraBold")
    hl = 98 if len(headline) < 40 else 84
    bfo = F(OTC.sans, 40, "Regular")
    ch = (64 if kicker else 0) + hl * len(wrap(d, headline, hf, W - 2 * M)) + 40 + 7 + 56
    if body:
        ch += 60 * len(wrap(d, body, bfo, W - 2 * M))
    avail_top, avail_bot = M + 150, H - M - (150 if cta else 90)
    y = max(M + 150, avail_top + (avail_bot - avail_top - ch) / 2)
    if kicker:
        tracked(d, kicker.upper(), F(OTC.sans, 26, "ExtraBold"), M, y,
                accent if not dark else "#7FB3E8", 4)
        y += 64
    y = block(d, headline, hf, M, y, W - 2 * M, hl, fg) + 40
    d.rectangle([M, y, M + 110, y + 7], fill=accent if not dark else "#7FB3E8")
    y += 56
    if body:
        block(d, body, bfo, M, y, W - 2 * M, 60, sub)

    if cta:
        bh = 108
        d.rounded_rectangle([M, H - M - bh, W - M, H - M], 18,
                            fill="#FFFFFF" if dark else OTC.ink)
        d.text((W / 2, H - M - bh / 2 + 2), cta, font=F(OTC.sans, 38, "Bold"),
               fill=OTC.ink if dark else "#FFFFFF", anchor="mm")
    else:
        d.text((M, H - M - 34), "Free · offline · no account",
               font=F(OTC.sans, 28, "Medium"), fill="#8C8A84" if dark else OTC.micro)
    save(img, fn)


# ====================================================== Cornerstone: snapshot
def cs_snapshot(fn, topic, eyebrow, title, body, formula=None, size=(1080, 1350)):
    W, H = size
    img = Image.new("RGB", (W, H), CS.paper)
    d = ImageDraw.Draw(img)
    M = 72
    px, pw_ = M + 52, W - 2 * M - 104

    # measure first so the card hugs its content
    tf = F(CS.serif, 62, "SemiBold")
    bf = F(CS.sans, 33, "Regular")
    ch = 52 + 66
    ch += 78 * len(wrap(d, title, tf, pw_)) + 34
    ch += 52 * len(wrap(d, body, bf, pw_)) + 36
    if formula:
        ch += 116 + 44
    ch += 44 + 88

    d.text((M, M - 6), topic, font=F(CS.serif, 44, "SemiBold"), fill=CS.ink)
    tracked(d, "CORNERSTONE", F(CS.sans, 22, "SemiBold"), W - M - 196, M + 8, CS.meta, 3)
    d.rectangle([M, M + 74, M + 200, M + 79], fill=CS.ink)
    d.rectangle([M + 216, M + 76, W - M, M + 79], fill=CS.rule)

    top = M + 130
    bot = min(top + ch, H - M - 120)
    d.rounded_rectangle([M, top, W - M, bot], 8, fill=CS.surface, outline=CS.rule)

    y = top + 52
    tracked(d, eyebrow.upper(), F(CS.mono, 22, "Bold"), px, y, CS.brass, 4)
    d.text((W - M - 52, y - 22), "1", font=F(CS.serif, 84, "Regular"),
           fill="#e4dfd4", anchor="ra")
    y += 66
    y = block(d, title, tf, px, y, pw_, 78, CS.ink) + 34
    y = block(d, body, bf, px, y, pw_, 52, CS.inkBody) + 36
    if formula:
        d.rounded_rectangle([px, y, px + pw_, y + 116], 6, fill=CS.brassTint)
        tracked(d, "FORMULA", F(CS.mono, 20, "Bold"), px + 28, y + 22, CS.meta, 3)
        d.text((px + 28, y + 56), formula, font=F(CS.mono, 34, "Regular"), fill=CS.ink)
        y += 116 + 44
    else:
        y += 8
    d.text((px, y), "Tap the card for the exam angle",
           font=F(CS.sans, 26, "SemiBold"), fill=CS.muted)

    d.text((M, H - M - 56), "Fifteen honest minutes.", font=F(CS.serif, 34, "SemiBold"), fill=CS.ink)
    d.text((W - M, H - M - 52), "Free on Google Play", font=F(CS.sans, 26, "Medium"),
           fill=CS.meta, anchor="ra")
    save(img, fn)


# ========================================================= Cornerstone: quiz
def cs_quiz(fn, exam, question, options, correct, size=(1080, 1350)):
    W, H = size
    img = Image.new("RGB", (W, H), CS.paper)
    d = ImageDraw.Draw(img)
    M = 72
    d.text((M, M - 6), exam, font=F(CS.serif, 44, "SemiBold"), fill=CS.ink)
    tracked(d, "CORNERSTONE", F(CS.sans, 22, "SemiBold"), W - M - 196, M + 8, CS.meta, 3)
    d.rectangle([M, M + 74, W - M, M + 77], fill=CS.rule)

    top, bot = M + 122, H - M - 116
    d.rounded_rectangle([M, top, W - M, bot], 8, fill=CS.surface, outline=CS.rule)
    px, pw_ = M + 52, W - 2 * M - 104
    y = top + 50
    tracked(d, "PRACTICE QUESTION", F(CS.mono, 21, "Bold"), px, y, CS.brass, 4)
    y += 62
    y = block(d, question, F(CS.serif, 46, "SemiBold"), px, y, pw_, 62, CS.ink) + 34

    of = F(CS.sans, 31, "Regular")
    for i, opt in enumerate(options):
        lines = wrap(d, opt, of, pw_ - 78)
        rh = max(70, 26 + 44 * len(lines))
        is_c = i == correct
        d.rounded_rectangle([px, y, px + pw_, y + rh], 5,
                            fill="#f4f8f5" if is_c else CS.paperAlt,
                            outline=CS.sage if is_c else CS.rule, width=2 if is_c else 1)
        d.text((px + 26, y + rh / 2 + 1), "ABCD"[i], font=F(CS.mono, 26, "Bold"),
               fill=CS.sage if is_c else CS.meta, anchor="lm")
        ty = y + (rh - 44 * len(lines)) / 2 + 1
        for ln in lines:
            d.text((px + 78, ty), ln, font=of, fill=CS.ink if is_c else CS.inkBody)
            ty += 44
        y += rh + 14

    d.text((M, H - M - 52), "Explanation + curriculum reference in the app",
           font=F(CS.sans, 27, "Medium"), fill=CS.muted)
    save(img, fn)


# ==================================================== Cornerstone: carousel
def cs_slide(fn, kicker, headline, body, index, total, dark=False, cta=None,
             size=(1080, 1350)):
    W, H = size
    bg = "#131c2e" if dark else CS.paper
    fg = "#f4f1ea" if dark else CS.ink
    sub = "rgba" if False else ("#c3c8d2" if dark else CS.inkBody)
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    M = 88
    tracked(d, "CORNERSTONE", F(CS.sans, 22, "SemiBold"), M, M - 4,
            "#e0b26a" if dark else CS.meta, 4)
    d.text((W - M, M - 8), f"{index}/{total}", font=F(CS.mono, 26, "Bold"),
           fill="#8c95a6" if dark else CS.meta, anchor="ra")

    hf = F(CS.serif, 86 if len(headline) < 38 else 70, "SemiBold")
    hl = 100 if len(headline) < 38 else 86
    bfc = F(CS.sans, 38, "Regular")
    ch = (62 if kicker else 0) + hl * len(wrap(d, headline, hf, W - 2 * M)) + 38 + 5 + 52
    if body:
        ch += 58 * len(wrap(d, body, bfc, W - 2 * M))
    avail_top, avail_bot = M + 140, H - M - (150 if cta else 90)
    y = max(M + 140, avail_top + (avail_bot - avail_top - ch) / 2)
    if kicker:
        tracked(d, kicker.upper(), F(CS.mono, 24, "Bold"), M, y,
                "#e0b26a" if dark else CS.brass, 4)
        y += 62
    y = block(d, headline, hf, M, y, W - 2 * M, hl, fg) + 38
    d.rectangle([M, y, M + 110, y + 5], fill="#e0b26a" if dark else CS.brass)
    y += 52
    if body:
        block(d, body, bfc, M, y, W - 2 * M, 58, sub)

    if cta:
        bh = 106
        d.rounded_rectangle([M, H - M - bh, W - M, H - M], 5,
                            fill="#f4f1ea" if dark else CS.ink)
        d.text((W / 2, H - M - bh / 2 + 2), cta, font=F(CS.sans, 36, "SemiBold"),
               fill=CS.ink if dark else "#f7f4ee", anchor="mm")
    else:
        d.text((M, H - M - 32), "Free · offline · no account",
               font=F(CS.sans, 27, "Medium"), fill="#8c95a6" if dark else CS.meta)
    save(img, fn)


# ================================================================ X headers
def x_header(fn, brand, headline, sub, stats, theme="otc"):
    W, H = 1600, 900
    if theme == "otc":
        bg, fg, body, accent, mut = OTC.bg, OTC.ink, OTC.body, OTC.blue, OTC.micro
        hf = F(OTC.sans, 84, "ExtraBold"); bf = F(OTC.sans, 38, "Regular")
        sf = F(OTC.sans, 24, "ExtraBold"); nf = F(OTC.sans, 56, "ExtraBold")
        lf = F(OTC.sans, 24, "Medium")
    else:
        bg, fg, body, accent, mut = CS.paper, CS.ink, CS.inkBody, CS.brass, CS.meta
        hf = F(CS.serif, 88, "SemiBold"); bf = F(CS.sans, 36, "Regular")
        sf = F(CS.sans, 23, "SemiBold"); nf = F(CS.serif, 60, "SemiBold")
        lf = F(CS.sans, 23, "Medium")
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    M = 96
    tracked(d, brand.upper(), sf, M, M - 6, fg, 4)
    y = M + 130
    y = block(d, headline, hf, M, y, W - 2 * M - 40, 104, fg) + 30
    d.rectangle([M, y, M + 120, y + 7], fill=accent)
    y += 46
    block(d, sub, bf, M, y, W - 2 * M - 120, 56, body)

    x = M
    for num, lab in stats:
        d.text((x, H - M - 96), num, font=nf, fill=fg)
        d.text((x, H - M - 26), lab, font=lf, fill=mut)
        x += max(d.textlength(num, font=nf), d.textlength(lab, font=lf)) + 90
    save(img, fn)


# ==================================================================== CONTENT
if __name__ == "__main__":
    # ---- OTC Learn quiz cards (worked examples straight from the catalogue)
    otc_quiz("otc-quiz-01-irs.png", "ir",
             "On a $200m swap the fixed payer pays 3% and the floating leg sets at 3.8% for a full year. What happens on the payment date?",
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

    # ---- OTC Learn term cards
    otc_term("otc-term-01-notional.png", "ir", "Notional",
             "The reference amount interest is calculated on. It is never exchanged in a standard swap.")
    otc_term("otc-term-02-vm.png", "foundations", "Variation margin",
             "Collateral that settles the change in a portfolio's mark-to-market, so neither side carries an unpaid gain or loss.")
    otc_term("otc-term-03-points.png", "fx", "Forward points",
             "The adjustment added to or subtracted from spot to give the forward rate, driven by the interest rate differential.")

    # ---- OTC Learn carousel: "An interest rate swap in five slides"
    otc_slide("otc-carousel-1.png", None,
              "You have nodded along in a meeting about basis risk.",
              "Six slides. No jargon left undefined.", 1, 6, "ir", dark=True)
    otc_slide("otc-carousel-2.png", "What it is",
              "Two parties swap one interest stream for another.",
              "One side pays a rate fixed at inception. The other pays a rate that resets against a published benchmark such as SOFR.",
              2, 6, "ir")
    otc_slide("otc-carousel-3.png", "The trick",
              "The notional is never exchanged.",
              "It is only the number the interest is calculated on. $200m notional does not mean $200m changes hands — ever.",
              3, 6, "ir")
    otc_slide("otc-carousel-4.png", "Worked",
              "$200m. Fixed 3%. Floating sets at 3.8%.",
              "Only the difference settles: 0.8% of $200m = $1.6m, paid by the floating payer to the fixed payer.",
              4, 6, "ir")
    otc_slide("otc-carousel-5.png", "Why it exists",
              "A borrower turns a floating loan into a fixed one without refinancing it.",
              "Same debt, different rate profile. That is most of what the swap market is for.",
              5, 6, "ir")
    otc_slide("otc-carousel-6.png", None,
              "36 products. Same five steps each.",
              "Interest rate, FX, credit, equity, commodity, and the market plumbing underneath. 432 questions. Works with no signal.",
              6, 6, "ir", dark=True, cta="OTC Learn — free on Google Play")

    # ---- Cornerstone snapshot cards
    cs_snapshot("cs-card-01-fixedincome.png", "Fixed Income", "Core idea",
                "A bond’s price is just discounted cash flow",
                "Price is the present value of every coupon plus the redemption amount, discounted at the market yield. Because the yield sits in the denominator, price and yield always move in opposite directions.",
                "P = Σ C/(1+r)^t + FV/(1+r)^n")
    cs_snapshot("cs-card-02-ethics.png", "Ethics", "Core idea",
                "When laws conflict, follow the stricter one",
                "Members must comply with the most strict of applicable law, the Code and the Standards. Less strict local law never excuses a Standards violation, and members must not knowingly assist anyone else in a violation.")
    cs_snapshot("cs-card-03-frm.png", "Foundations of Risk", "Core idea",
                "Risk-adjusted measures differ in the risk they charge for",
                "The Sharpe ratio charges total risk, Treynor charges systematic risk, and the information ratio charges tracking error. Which one flatters a manager tells you what risk they are actually taking.")

    # ---- Cornerstone quiz cards
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

    # ---- Cornerstone carousel
    cs_slide("cs-carousel-1.png", None,
             "Fifteen honest minutes beats three distracted hours.",
             "Six slides on how to study when you have a job.", 1, 6, dark=True)
    cs_slide("cs-carousel-2.png", "The problem",
             "Re-reading feels like progress. It is not.",
             "Recognition is not recall. If you have not tried to retrieve it, you do not know whether you have it.",
             2, 6)
    cs_slide("cs-carousel-3.png", "One session",
             "Four cards, then five questions.",
             "The core idea, the formula that does the work, and the angle the examiners actually test — then prove it.",
             3, 6)
    cs_slide("cs-carousel-4.png", "The queue",
             "Anything you miss comes back tomorrow.",
             "Then in four days, then in ten, then less often as it sticks. Three clean passes and it retires.",
             4, 6)
    cs_slide("cs-carousel-5.png", "Weighted",
             "Your progress bar respects the exam weights.",
             "A 15–20% topic counts for more than a 5–8% one, so the number on the home screen means something.",
             5, 6)
    cs_slide("cs-carousel-6.png", None,
             "38 topic areas. 152 cards. 190 questions.",
             "CFA Levels I–III and FRM Parts I and II, side by side. No account, no ads, nothing leaves your phone.",
             6, 6, dark=True, cta="Cornerstone — free on Google Play")

    # ---- X / LinkedIn headers
    x_header("x-otc-header.png", "OTC Learn",
             "The derivatives everyone in the room pretends to understand.",
             "Thirty-six OTC products, one five-step lesson each, and a quiz that draws a different paper every time.",
             [("36", "PRODUCTS"), ("432", "QUESTIONS"), ("0", "ADS OR TRACKERS")], "otc")

    x_header("x-cs-header.png", "Cornerstone",
             "Fifteen honest minutes beats three distracted hours.",
             "Snapshot cards and five-question sessions for CFA® and FRM® candidates. Spaced repetition built in.",
             [("38", "TOPIC AREAS"), ("152", "CARDS"), ("190", "QUESTIONS")], "cs")
