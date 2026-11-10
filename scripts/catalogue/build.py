"""Build the VYRO product catalogue (landscape A4 PDF) from the website content.

    bun scripts/catalogue/export-data.ts > /tmp/vyro-catalogue-data.json
    python3 scripts/catalogue/build.py /tmp/vyro-catalogue-data.json

Writes public/downloads/vyro-product-catalogue.pdf. Re-run both commands
whenever prices, specs, copy or product images change. Needs reportlab,
Pillow and the Lora and Poppins fonts (falls back to DejaVu if missing).

Only confirmed facts go in here: everything product-specific comes from the
exported site content. Hand-written copy below restates what the site says.
"""
import io
import json
import sys
from pathlib import Path

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle

# ---------------------------------------------------------------- brand ----
INK = colors.HexColor("#1B1D1F")
IVORY = colors.HexColor("#F4EFE7")
CREAM = colors.HexColor("#F8ECDE")  # the product renders' studio background
STONE = colors.HexColor("#EAE3D8")
BRONZE = colors.HexColor("#A98A5E")
BRONZE_STRONG = colors.HexColor("#8C6A3F")
MUTED = colors.HexColor("#5F5A54")
RULE = colors.HexColor("#DDD5C8")
WHITE = colors.white

W, H = 841.89, 595.28  # A4 landscape
M = 40

GF = Path("/usr/share/fonts/truetype/google-fonts")
DV = Path("/usr/share/fonts/truetype/dejavu")
OUT = Path(__file__).resolve().parents[2] / "public/downloads/vyro-product-catalogue.pdf"


def register_fonts() -> None:
    def reg(name: str, primary: Path, fallback: Path) -> None:
        pdfmetrics.registerFont(TTFont(name, str(primary if primary.exists() else fallback)))

    reg("Display", GF / "Lora-Variable.ttf", DV / "DejaVuSerif.ttf")
    reg("DisplayIt", GF / "Lora-Italic-Variable.ttf", DV / "DejaVuSerif.ttf")
    reg("Body", GF / "Poppins-Light.ttf", DV / "DejaVuSans.ttf")
    reg("BodyReg", GF / "Poppins-Regular.ttf", DV / "DejaVuSans.ttf")
    reg("BodyMed", GF / "Poppins-Medium.ttf", DV / "DejaVuSans-Bold.ttf")


def style(font="Body", size=9, leading=None, color=INK, alignment=TA_LEFT, **kw) -> ParagraphStyle:
    return ParagraphStyle("s", fontName=font, fontSize=size, leading=leading or size * 1.5, textColor=color, alignment=alignment, **kw)


def para(c, text, x, y_top, width, st) -> float:
    """Draw a paragraph with its top at y_top; return the y below it."""
    p = Paragraph(text, st)
    _, h = p.wrap(width, 2000)
    p.drawOn(c, x, y_top - h)
    return y_top - h


def eyebrow(c, text, x, y, color=BRONZE_STRONG, size=7, right=False) -> None:
    c.setFont("BodyMed", size)
    c.setFillColor(color)
    t = text.upper()
    if right:
        x -= pdfmetrics.stringWidth(t, "BodyMed", size) + 1.3 * (len(t) - 1)
    c.drawString(x, y, t, charSpace=1.3)


# --------------------------------------------------------------- images ----
_cache: dict = {}


def _fit(path: str, w: float, h: float, mode: str, focus=(0.5, 0.5)) -> ImageReader:
    """Crop (cover) or pad (contain) an image to the box ratio, at ~170 dpi."""
    key = (path, round(w), round(h), mode, focus)
    if key in _cache:
        return _cache[key]
    im = Image.open(path).convert("RGB")
    target = w / h
    if mode == "cover":
        iw, ih = im.size
        if iw / ih > target:
            nw = int(ih * target)
            left = int((iw - nw) * focus[0])
            im = im.crop((left, 0, left + nw, ih))
        else:
            nh = int(iw / target)
            top = int((ih - nh) * focus[1])
            im = im.crop((0, top, iw, top + nh))
    px = int(w * 170 / 72)
    if im.width > px:
        im = im.resize((px, int(px * im.height / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=84, optimize=True)
    buf.seek(0)
    _cache[key] = ImageReader(buf)
    return _cache[key]


def photo(c, path, x, y, w, h, focus=(0.5, 0.5)) -> None:
    c.drawImage(_fit(path, w, h, "cover", focus), x, y, w, h)


def _extend(path: str, ratio: float) -> Image.Image:
    """Extend a product render's studio backdrop to a new aspect ratio.

    The render is kept whole; the extra space is filled by stretching its own
    edge rows/columns and feathering them in, so there is no visible seam."""
    import numpy as np
    from scipy import ndimage

    im = np.asarray(Image.open(path).convert("RGB")).astype(float)
    h, w, _ = im.shape
    feather = max(20, int(min(h, w) * 0.06))
    if w / h > ratio:  # taller box: pad top and bottom
        axis, total = 0, int(round(w / ratio))
    else:  # wider box: pad left and right
        axis, total = 1, int(round(h * ratio))
    n = im.shape[axis]
    if total <= n + 1:
        return Image.fromarray(im.astype("uint8"))
    take = lambda a_, b_: im[a_:b_] if axis == 0 else im[:, a_:b_]
    first = ndimage.uniform_filter1d(take(0, 20).mean(axis=axis), 81, axis=0, mode="nearest")
    last = ndimage.uniform_filter1d(take(n - 20, n).mean(axis=axis), 81, axis=0, mode="nearest")
    body = im.copy()
    for i in range(feather):
        t = 1 - i / feather
        if axis == 0:
            body[i] = body[i] * (1 - t) + first * t
            body[-1 - i] = body[-1 - i] * (1 - t) + last * t
        else:
            body[:, i] = body[:, i] * (1 - t) + first * t
            body[:, -1 - i] = body[:, -1 - i] * (1 - t) + last * t
    pad = (total - n) // 2
    rep = lambda v, k: np.repeat(v[None], k, 0) if axis == 0 else np.repeat(v[:, None], k, 1)
    out = np.concatenate([rep(first, pad), body, rep(last, total - n - pad)], axis=axis)
    return Image.fromarray(out.clip(0, 255).astype("uint8"))


def render(c, path, x, y, w, h) -> None:
    """Product render filling the box: never cropped, backdrop extended to fit."""
    key = ("render", path, round(w), round(h))
    if key not in _cache:
        im = _extend(path, w / h)
        px = int(w * 170 / 72)
        if im.width > px:
            im = im.resize((px, int(px * im.height / im.width)), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=84, optimize=True)
        buf.seek(0)
        _cache[key] = ImageReader(buf)
    c.drawImage(_cache[key], x, y, w, h)


# ----------------------------------------------------------------- chrome ----
LOGO_DIR = Path(__file__).resolve().parent


def logo(c, cx, cy, r, color=INK) -> None:
    """The VYRO roundel (from the brand logo file), centred on cx, cy with radius r."""
    name = "logo-light.png" if color in (IVORY, WHITE) else "logo-dark.png"
    c.drawImage(ImageReader(str(LOGO_DIR / name)), cx - r, cy - r, 2 * r, 2 * r, mask="auto")


class Book:
    def __init__(self, data):
        self.d = data
        self.c = canvas.Canvas(str(OUT), pagesize=(W, H))
        self.c.setTitle("VYRO Wellness — Product Catalogue")
        self.c.setAuthor("VYRO Wellness")
        self.c.setSubject("Haven saunas, Glacier cold plunges and wellness spaces")
        self.page = 0

    def new_page(self):
        if self.page:
            self.c.showPage()
        self.page += 1
        return self.c

    def chrome(self, crumb_section: str, crumb_item: str = "", dark=False, number=True, side="left"):
        """Logo + breadcrumb at the top, page number square at the bottom."""
        c = self.c
        fg = IVORY if dark else INK
        x = M if side == "left" else W / 2 + 22
        logo(c, x + 15, H - 34, 15, fg)
        eyebrow(c, crumb_section, x + 40, H - 37, BRONZE if dark else BRONZE_STRONG)
        if crumb_item:
            off = pdfmetrics.stringWidth(crumb_section.upper(), "BodyMed", 7) + 1.3 * len(crumb_section) + 6
            c.setFillColor(MUTED if not dark else IVORY)
            c.setFont("Body", 7)
            c.drawString(x + 40 + off, H - 37, "|  " + crumb_item)
        if number:
            self.number(dark)

    def number(self, dark=False):
        c = self.c
        left = self.page % 2 == 0
        x = 0 if left else W - 22
        c.setFillColor(BRONZE if not dark else BRONZE)
        c.rect(x, 18, 22, 22, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont("BodyMed", 8)
        c.drawCentredString(x + 11, 26, str(self.page))

    def save(self):
        self.c.save()


def title(c, x, y_top, big, small="", width=360, big_size=40, color=INK, accent=BRONZE_STRONG):
    """SAWO-style two-line title: large word, then a lighter second line."""
    y = para(c, big, x, y_top, width, style("Display", big_size, big_size * 1.08, color))
    if small:
        y = para(c, small, x, y - 2, width, style("Display", big_size * 0.62, big_size * 0.7, accent))
    return y


def bullets(c, items, x, y_top, width, size=8.5, color=INK, mark_color=BRONZE_STRONG):
    y = y_top
    for it in items:
        c.setFillColor(mark_color)
        c.setFont("BodyMed", size)
        c.drawString(x, y - size * 1.05, "»")
        y = para(c, it, x + 12, y, width - 12, style("Body", size, size * 1.45, color)) - 3
    return y


def table(c, rows, x, y_top, col_widths, header=True, size=7.5, zebra=True):
    st = style("Body", size, size * 1.35)
    hs = style("BodyMed", size - 0.5, size * 1.3, WHITE)
    data = []
    for i, r in enumerate(rows):
        data.append([Paragraph(str(v), hs if (header and i == 0) else st) for v in r])
    t = Table(data, colWidths=col_widths)
    cmds = [
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, RULE),
    ]
    if header:
        cmds.append(("BACKGROUND", (0, 0), (-1, 0), INK))
    if zebra:
        for i in range(1 if header else 0, len(rows)):
            if i % 2 == 0:
                cmds.append(("BACKGROUND", (0, i), (-1, i), colors.HexColor("#F6F1EA")))
    t.setStyle(TableStyle(cmds))
    _, h = t.wrap(sum(col_widths), 1000)
    t.drawOn(c, x, y_top - h)
    return y_top - h


def opener(b: Book, photo_path, big, small, text, focus=(0.5, 0.5), panel_x=M, toc_key=None):
    """Section opener: full-bleed photo with a translucent title panel."""
    c = b.new_page()
    photo(c, photo_path, 0, 0, W, H, focus)
    pw, ph = 300, 270
    c.saveState()
    c.setFillColor(colors.Color(0.62, 0.48, 0.3, alpha=0.72))
    c.rect(panel_x, H - 70 - ph, pw, ph, stroke=0, fill=1)
    c.restoreState()
    y = title(c, panel_x + 24, H - 92, big, small, pw - 48, 46, WHITE, WHITE)
    para(c, text, panel_x + 24, y - 14, pw - 48, style("Body", 8.5, 13, WHITE))
    b.number(dark=True)


# ------------------------------------------------------------------ pages ----
TOC = [
    ("About VYRO", "intro", None),
    ("The VYRO Difference", "intro", None),
    ("Saunas", "head", None),
    ("Haven Series at a Glance", "item", None),
    ("Haven Classic", "item", None),
    ("Haven Glass", "item", None),
    ("Haven Infrared & Haven Compact", "item", None),
    ("Woods", "item", None),
    ("Ember Sauna Heaters", "item", None),
    ("Pulse Controls & Ritual Accessories", "item", None),
    ("Cold Plunge", "head", None),
    ("Glacier Launch Range", "item", None),
    ("Glacier Technical Data", "item", None),
    ("Glacier Chillers", "item", None),
    ("Glacier Project Collection", "item", None),
    ("Wellness Spaces & Commercial", "head", None),
    ("Complete Wellness Spaces", "item", None),
    ("Red Light Therapy", "item", None),
    ("How We Work & After-Sales", "head", None),
    ("Contact", "item", None),
]
PAGES = {}  # title -> page number, filled in by a dry run


def cover(b: Book):
    d = b.d
    c = b.new_page()
    photo(c, d["photos"]["saunaHero"], 0, 0, W, H, (0.5, 0.45))
    c.saveState()
    c.setFillColor(colors.Color(0.07, 0.07, 0.08, alpha=0.38))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.restoreState()
    logo(c, W / 2, H - 120, 46, IVORY)
    c.setFillColor(IVORY)
    c.setFont("Display", 46)
    c.drawCentredString(W / 2, 205, "PRODUCT CATALOGUE")
    c.setFont("Body", 15)
    t = "SAUNAS  ·  COLD PLUNGE  ·  WELLNESS SPACES"
    c.drawCentredString(W / 2, 176, t)
    c.setStrokeColor(BRONZE)
    c.setLineWidth(0.8)
    c.line(W / 2 - 40, 160, W / 2 + 40, 160)
    c.setFont("BodyMed", 8)
    c.setFillColor(IVORY)
    c.drawCentredString(W / 2, 140, f"WWW.{d['contact']['domain'].upper()}", charSpace=1.5)


def contents(b: Book):
    d = b.d
    c = b.new_page()
    photo(c, d["photos"]["stillLife"], 0, 0, W * 0.42, H, (0.6, 0.5))
    x = W * 0.42 + 60
    title(c, x, H - 70, "Table of", "Contents", 300, 30, INK, BRONZE_STRONG)
    y = H - 165
    col_w = W - x - M
    for name, kind, _ in TOC:
        n = PAGES.get(name, "")
        if kind == "head":
            y -= 6
            c.setFont("BodyMed", 10)
            c.setFillColor(BRONZE_STRONG)
            c.drawString(x, y, name)
        else:
            c.setFont("Body", 9.5)
            c.setFillColor(INK)
            c.drawString(x + (12 if kind == "item" else 0), y, name)
        c.setFont("BodyReg", 9)
        c.setFillColor(INK)
        c.drawRightString(x + col_w, y, str(n))
        tw = pdfmetrics.stringWidth(name, "BodyMed" if kind == "head" else "Body", 10 if kind == "head" else 9.5)
        c.setStrokeColor(RULE)
        c.setDash(1, 2)
        c.line(x + (12 if kind == "item" else 0) + tw + 6, y + 2, x + col_w - 16, y + 2)
        c.setDash()
        y -= 18
    b.number()


def about(b: Book):
    d = b.d
    c = b.new_page()
    PAGES["About VYRO"] = b.page
    PAGES["The VYRO Difference"] = b.page
    b.chrome("About VYRO")
    x = M
    y = title(c, x, H - 82, "Wellness Should", "Feel Personal", 330, 34)
    copy = [
        "VYRO brings premium saunas, cold plunges and complete wellness spaces to Indian homes and businesses.",
        "Wellness should fit naturally into everyday life. The best ritual is the one you'll actually keep — so we design for consistency, comfort and calm rather than extremes.",
        "Technology should be functional, beautiful and quietly easy to live with. Every person, home and business has different needs, so we help you shape a wellness experience that feels right for your life.",
    ]
    y -= 14
    for p in copy:
        y = para(c, p, x, y, 330, style("Body", 9, 14.5, MUTED)) - 8
    # The VYRO Difference: four cards on the right
    rx = W / 2 + 10
    eyebrow(c, "The VYRO Difference", rx, H - 80)
    y2 = para(c, "Expert Advice Before. Real Support After.", rx, H - 88, W - rx - M, style("Display", 20, 24))
    cw = (W - rx - M - 12) / 2
    ch = 150
    for i, p in enumerate(d["difference"]):
        cx = rx + (i % 2) * (cw + 12)
        cy = y2 - 18 - (i // 2) * (ch + 12)
        c.setFillColor(CREAM)
        c.rect(cx, cy - ch, cw, ch, stroke=0, fill=1)
        c.setFillColor(BRONZE_STRONG)
        c.setFont("BodyMed", 8)
        c.drawString(cx + 14, cy - 22, f"0{i + 1}")
        yy = para(c, p["title"], cx + 14, cy - 30, cw - 28, style("Display", 12.5, 15))
        para(c, p["copy"], cx + 14, yy - 6, cw - 28, style("Body", 7.6, 11.2, MUTED))
    # small still-life strip bottom-left
    photo(c, d["photos"]["saunaInterior"], x, 50, 330, 120, (0.5, 0.6))


def haven_glance(b: Book):
    d = b.d["haven"]
    c = b.new_page()
    PAGES["Haven Series at a Glance"] = b.page
    b.chrome("Saunas", "Haven Series")
    title(c, M, H - 82, "Haven", "Series at a Glance", 340, 34)
    para(
        c,
        f"Four ways to sauna. Every Haven cabin is crafted in {d['standardWood'].lower()} as standard, with six premium wood upgrades, and installed by our team {d['installation']}.",
        M, H - 165, 330, style("Body", 9, 14, MUTED),
    )
    # Four series cards
    cw = (W - 2 * M - 3 * 14) / 4
    top = H - 225
    for i, t in enumerate(d["roomTypes"]):
        x = M + i * (cw + 14)
        render(c, t["image"], x, top - cw, cw, cw)
        eyebrow(c, t["series"], x, top - cw - 16)
        yy = para(c, t["name"], x, top - cw - 20, cw, style("Display", 14, 17))
        para(c, t["short"], x, yy - 3, cw, style("Body", 7.6, 11, MUTED))
    # Size guide on the right of the title
    rows = [["Size", "Width (approx.)", "Seats"]] + [[s["name"], s["width"], s["people"]] for s in d["roomSizes"]]
    eyebrow(c, "Size Guide", W / 2 + 20, H - 80)
    table(c, rows, W / 2 + 20, H - 88, [70, 190, 90])
    para(c, "Sizes are indicative. Your consultant confirms final dimensions for your space.", W / 2 + 20, H - 178, 350, style("Body", 7, 10, MUTED))


def series_page(b: Book, type_id: str, name_key: str, bullets_list):
    d = b.d["haven"]
    t = next(x for x in d["roomTypes"] if x["id"] == type_id)
    models = [m for m in d["models"] if m["name"] == t["name"]]
    c = b.new_page()
    PAGES[t["name"]] = b.page
    # Left: big render of the series image
    render(c, t["image"], 0, 0, W * 0.46, H)
    # Right: copy
    x = W * 0.46 + 34
    b.chrome("Saunas", t["name"], side="right")
    tw = W - x - M
    y = title(c, x, H - 78, t["name"].split()[0], t["name"].split()[1], tw, 34)
    eyebrow(c, t["series"], x, y - 14)
    y = para(c, t["about"], x, y - 22, tw, style("Body", 9, 14, MUTED))
    y = bullets(c, bullets_list, x, y - 10, tw)
    # Models row
    n = len(models)
    mw = min(110, (tw - (n - 1) * 10) / n)
    y -= 12
    for i, m in enumerate(models):
        mx = x + i * (mw + 10)
        render(c, m["image"], mx, y - mw, mw, mw)
        c.setFont("BodyMed", 8)
        c.setFillColor(INK)
        c.drawString(mx, y - mw - 12, f"{m['code']}  ·  {m['size']}")
    y = y - mw - 26
    rows = [["Model", "Size", "Width (approx.)", "Seats"]] + [
        [m["code"], m["size"], m["width"].replace("Approx. ", "").replace(" wide", ""), m["people"]] for m in models
    ]
    table(c, rows, x, y, [52, 52, tw - 52 - 52 - 72, 72])


def series_pair(b: Book):
    """Haven Infrared and Haven Compact share a spread-style page."""
    d = b.d["haven"]
    c = b.new_page()
    PAGES["Haven Infrared & Haven Compact"] = b.page
    b.chrome("Saunas", "Haven Infrared · Haven Compact")
    half = (W - 2 * M - 30) / 2
    for i, tid in enumerate(["infrared", "compact"]):
        t = next(x for x in d["roomTypes"] if x["id"] == tid)
        m = next(x for x in d["models"] if x["type"] == tid)
        x = M + i * (half + 30)
        img = 250
        render(c, m["image"], x, H - 76 - img, img, img)
        tx = x + img + 16
        tw = half - img - 16
        y = title(c, tx, H - 84, t["name"].split()[0], t["name"].split()[1], tw, 24)
        eyebrow(c, f"{t['series']}  ·  {m['code']}", tx, y - 12)
        para(c, t["about"], tx, y - 20, tw, style("Body", 8, 12, MUTED))
        y = H - 76 - img - 20
        y = para(c, m["copy"], x, y, half, style("Display", 12, 16))
        extra = {
            "infrared": ["Infrared panels instead of a heater and stones", "Black-framed glass door", "Gentle warmth at lower air temperatures"],
            "compact": ["Space-saving footprint for apartments", "Glass door with a clean timber front", "Heater tucked neatly out of sight"],
        }[tid]
        y = bullets(c, extra, x, y - 8, half, size=8.6)
        rows = [["Model", "Size", "Width (approx.)", "Seats"], [m["code"], m["size"], m["width"].replace("Approx. ", "").replace(" wide", ""), m["people"]]]
        table(c, rows, x, y - 10, [48, 48, half - 48 - 48 - 70, 70], size=8)


def woods_page(b: Book):
    d = b.d["haven"]
    c = b.new_page()
    PAGES["Woods"] = b.page
    b.chrome("Saunas", "Woods")
    title(c, M, H - 82, "Choose", "Your Wood", 300, 34)
    para(c, f"Every Haven cabin is crafted in {d['standardWood'].lower()} as standard. The upgrades change the colour, grain and character of your sauna — your consultant will help you choose for your space.",
         M, H - 165, 300, style("Body", 9, 14, MUTED))
    para(c, "Swatches are indicative; timber is a natural material and every board varies. See samples with your consultant.", M, 80, 280, style("Body", 7, 10, MUTED))
    x0 = M + 340
    cols = 4
    sw = (W - x0 - M - (cols - 1) * 12) / cols
    sh = 120
    for i, w in enumerate(d["woods"]):
        x = x0 + (i % cols) * (sw + 12)
        top = H - 82 - (i // cols) * (sh + 90)
        hexc = w.get("colour") or "#e6cfa6"
        c.setFillColor(colors.HexColor(hexc))
        c.rect(x, top - sh, sw, sh, stroke=0, fill=1)
        # simple board lines
        c.setStrokeColor(colors.Color(0, 0, 0, alpha=0.08))
        c.setLineWidth(0.6)
        bx = x + 14
        while bx < x + sw:
            c.line(bx, top - sh, bx, top)
            bx += 14
        eyebrow(c, "Standard" if w.get("standard") else "Upgrade", x, top - sh - 13)
        yy = para(c, w["name"], x, top - sh - 17, sw, style("Display", 13, 16))
        para(c, w["note"], x, yy - 2, sw, style("Body", 7.3, 10.5, MUTED))


def heaters_page(b: Book):
    d = b.d["haven"]
    c = b.new_page()
    PAGES["Ember Sauna Heaters"] = b.page
    b.chrome("Saunas", "Ember Heaters")
    title(c, M, H - 82, "Ember", "Sauna Heaters", 260, 34)
    para(c, "Floor-standing, tower and wall-mounted heaters in stainless steel or matte black. Your consultant matches the heater to your cabin and room.",
         M, H - 165, 240, style("Body", 9, 14, MUTED))
    a = b.d["afterSales"]
    c.setFillColor(CREAM)
    c.rect(M, 70, 240, 120, stroke=0, fill=1)
    eyebrow(c, "After-sales", M + 14, 172)
    yy = para(c, f"{a['heaterServiceYears']} years of heater after-sales", M + 14, 166, 212, style("Display", 13, 16))
    para(c, f"A {a['heaterComprehensiveWarrantyYears']}-year comprehensive warranty, followed by {a['heaterSupportYears']} years of service support and spare parts ({a['heaterSupportCharges']}).",
         M + 14, yy - 4, 212, style("Body", 7.6, 11, MUTED))
    x0 = M + 280
    cols = 3
    cw = (W - x0 - M - (cols - 1) * 14) / cols
    img = 128
    for i, h in enumerate(d["heaters"]):
        x = x0 + (i % cols) * (cw + 14)
        top = H - 70 - (i // cols) * (img + 108)
        render(c, h["image"], x, top - img, cw, img)
        eyebrow(c, h["kind"], x, top - img - 13)
        yy = para(c, f"{h['name']}  <font name='Body' size='8' color='#8C6A3F'>{h['finish'].capitalize()}</font>", x, top - img - 17, cw, style("Display", 12.5, 15))
        para(c, h["copy"], x, yy - 2, cw, style("Body", 7.8, 11, MUTED))


def controls_accessories(b: Book):
    d = b.d["haven"]
    c = b.new_page()
    PAGES["Pulse Controls & Ritual Accessories"] = b.page
    b.chrome("Saunas", "Controls & Accessories")
    lw = 200
    x0 = M + lw + 30
    area = W - x0 - M
    # Row 1: Pulse control panels, image beside text
    top = H - 76
    title(c, M, top - 6, "Pulse", "Control Panels", lw, 26)
    para(c, "Simple buttons or a black-glass touch dial — mounted on the wall beside your cabin.", M, top - 70, lw - 10, style("Body", 8.4, 12.6, MUTED))
    cw = (area - 18) / 2
    img = 150
    for i, p in enumerate(d["controlPanels"]):
        x = x0 + i * (cw + 18)
        render(c, p["image"], x, top - img, img, img)
        tx = x + img + 14
        eyebrow(c, p["kind"], tx, top - 30)
        yy = para(c, p["name"], tx, top - 36, cw - img - 14, style("Display", 14, 17))
        para(c, p["copy"], tx, yy - 4, cw - img - 14, style("Body", 8, 11.6, MUTED))
    # Row 2: Ritual accessory sets
    top2 = top - img - 34
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.line(M, top2 + 16, W - M, top2 + 16)
    title(c, M, top2 - 6, "Ritual", "Accessory Sets", lw, 26)
    para(c, "Bucket, ladle, timers, backrests and towels, in spruce or matte black.", M, top2 - 70, lw - 10, style("Body", 8.4, 12.6, MUTED))
    cols = 4
    cw = (area - (cols - 1) * 12) / cols
    img = cw * 0.86
    for i, a in enumerate(d["accessorySets"]):
        x = x0 + i * (cw + 12)
        render(c, a["image"], x, top2 - img, cw, img)
        eyebrow(c, a["finish"], x, top2 - img - 13)
        yy = para(c, a["name"], x, top2 - img - 17, cw, style("Display", 12, 15))
        para(c, a["copy"], x, yy - 2, cw, style("Body", 7.4, 10.4, MUTED))


def glacier_opener(b: Book):
    g = b.d["glacier"]
    c = b.new_page()
    PAGES["Cold Plunge"] = b.page
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    eyebrow(c, f"VYRO Glacier  ·  Made in {g['madeIn']}", M + 4, H - 92)
    title(c, M, H - 102, "Cold", "Plunge", 420, 58)
    para(c, f"Three Glacier plunges launch on {g['launchLabel']}: Barrel, Portable and Acrylic, each with the {g['included']} included. Available first in {', '.join(g['cities'][:-1])} and {g['cities'][-1]}.",
         W / 2 + 20, H - 110, W / 2 - 20 - M, style("Body", 10, 16, MUTED))
    im = Image.open(b.d["photos"]["launchRange"])
    iw = W - 2 * M
    ih = iw * im.height / im.width
    render(c, b.d["photos"]["launchRange"], M, 70, iw, ih)
    c.setFillColor(INK)
    c.rect(W - M - 190, 70 + ih + 20, 190, 28, stroke=0, fill=1)
    c.setFillColor(IVORY)
    c.setFont("BodyMed", 8)
    c.drawCentredString(W - M - 95, 70 + ih + 30, f"LAUNCHING {g['launchLabel'].upper()}", charSpace=1.2)
    b.number()


def glacier_range(b: Book):
    g = b.d["glacier"]
    c = b.new_page()
    PAGES["Glacier Launch Range"] = b.page
    b.chrome("Cold Plunge", "Glacier Launch Range")
    title(c, M, H - 82, "Glacier", "Launch Range", 300, 30)
    para(c, f"MRP includes the {g['included']}. Upgrade to the 2HP chiller for faster cooling for {g['upgradePrice']} more.",
         W / 2, H - 84, W / 2 - M, style("Body", 9, 14, MUTED))
    cols = 3
    cw = (W - 2 * M - (cols - 1) * 18) / cols
    img = 200
    top = H - 150
    for i, m in enumerate(g["models"]):
        x = M + i * (cw + 18)
        render(c, m["image"], x, top - img, cw, img)
        eyebrow(c, m["tag"], x, top - img - 14)
        yy = para(c, m["name"], x, top - img - 18, cw, style("Display", 16, 19))
        c.setFont("BodyReg", 15)
        c.setFillColor(BRONZE_STRONG)
        price = m["price"]["display"] if m.get("price") else ""
        c.drawString(x, yy - 18, f"{price}  MRP")
        c.setFont("Body", 6.8)
        c.setFillColor(MUTED)
        c.drawString(x, yy - 29, m["price"]["note"] if m.get("price") else "")
        yy = para(c, m["positioning"], x, yy - 38, cw, style("Body", 8.4, 12.4, MUTED))
        bullets(c, [f"Size: {m['size']}", f"Best for: {m['bestFor']}"] + m["keyFacts"][:2], x, yy - 6, cw, size=8.2)
    b.number()


def glacier_data(b: Book):
    g = b.d["glacier"]
    c = b.new_page()
    PAGES["Glacier Technical Data"] = b.page
    b.chrome("Cold Plunge", "Technical Data")
    title(c, M, H - 82, "Technical", "Data", 300, 30)
    labels = [s["label"] for s in g["models"][0]["specs"]]
    rows = [["", *[m["name"] for m in g["models"]]]]
    rows.append(["MRP", *[f"{m['price']['display']} (incl. {g['included']})" for m in g["models"]]])
    for lab in labels:
        rows.append([lab, *[next((s["value"] for s in m["specs"] if s["label"] == lab), "—") for m in m_list(g)]])
    rows.append(["Water capacity (range)", *[g["waterCapacity"]] * 3])
    tw = W - 2 * M
    table(c, rows, M, H - 140, [150] + [(tw - 150) / 3] * 3, size=8.6)
    # Installation requirements
    eyebrow(c, "Installation requirements (external chiller)", M, 196)
    rows2 = [["Requirement", "Specification"]] + [[r["label"], r["value"]] for r in g["requirements"]]
    table(c, rows2, M, 188, [200, 250], size=8.6)
    para(c, f"Installation is available first in {', '.join(g['cities'][:-1])} and {g['cities'][-1]}. Your consultant confirms power, water and drainage for your space before installation.",
         M + 480, 188, W - M - 480 - M + 40, style("Body", 9, 13.5, MUTED))


def m_list(g):
    return g["models"]


def chillers_page(b: Book):
    g = b.d["glacier"]
    c = b.new_page()
    PAGES["Glacier Chillers"] = b.page
    b.chrome("Cold Plunge", "Glacier Chillers")
    title(c, M, H - 82, "Glacier", "Chillers", 300, 30)
    para(c, f"Chillers launch with the tubs on {g['launchLabel']}. Every launch model includes the 1HP chiller; the 2HP is the upgrade for faster cooling ({g['upgradePrice']} over the included 1HP).",
         M, H - 160, 300, style("Body", 9, 14, MUTED))
    x0 = M + 340
    cw = (W - x0 - M - 18) / 2
    img = 280
    for i, ch in enumerate(g["chillers"]):
        x = x0 + i * (cw + 18)
        top = H - 70
        render(c, ch["image"], x, top - img, cw, img)
        yy = para(c, ch["best"].upper(), x, top - img - 8, cw, style("BodyMed", 6.6, 9, BRONZE_STRONG))
        yy = para(c, ch["name"], x, yy - 4, cw, style("Display", 15, 18))
        c.setFont("BodyReg", 13)
        c.setFillColor(BRONZE_STRONG)
        c.drawString(x, yy - 16, f"{ch['mrp']}  MRP (chiller only)")
        para(c, ch["copy"], x, yy - 26, cw, style("Body", 8.4, 12.4, MUTED))


def project_page(b: Book):
    g = b.d["glacier"]
    c = b.new_page()
    PAGES["Glacier Project Collection"] = b.page
    b.chrome("Cold Plunge", "Project Collection")
    title(c, M, H - 82, "Project", "Collection", 300, 30)
    para(c, "Coming soon for custom and premium projects — villas, wellness suites, gyms and hospitality. Ask your consultant to plan one into your space.",
         W / 2, H - 84, W / 2 - M, style("Body", 9, 14, MUTED))
    cols = 4
    cw = (W - 2 * M - (cols - 1) * 14) / cols
    top = H - 160
    for i, m in enumerate(g["projectModels"]):
        x = M + i * (cw + 14)
        render(c, m["image"], x, top - cw, cw, cw)
        c.setFillColor(INK)
        c.rect(x + 8, top - 24, 76, 16, stroke=0, fill=1)
        c.setFillColor(IVORY)
        c.setFont("BodyMed", 6.5)
        c.drawString(x + 14, top - 19, "COMING SOON", charSpace=0.8)
        eyebrow(c, m["tag"], x, top - cw - 14)
        yy = para(c, m["name"], x, top - cw - 18, cw, style("Display", 13, 16))
        para(c, m["copy"], x, yy - 2, cw, style("Body", 7.8, 11.2, MUTED))
    c.setFillColor(INK)
    c.rect(0, 0, W, 92, stroke=0, fill=1)
    eyebrow(c, "Planning a premium project?", M, 58, BRONZE)
    c.setFillColor(IVORY)
    c.setFont("Display", 16)
    c.drawString(M, 34, "Talk to a VYRO consultant about a custom cold plunge for your space.")
    b.number(dark=True)


def spaces_page(b: Book):
    d = b.d
    c = b.new_page()
    PAGES["Complete Wellness Spaces"] = b.page
    photo(c, d["photos"]["studio"], 0, 0, W * 0.42, H, (0.4, 0.5))
    x = W * 0.42 + 34
    b.chrome("Wellness Spaces", "Homes & Business", side="right")
    tw = W - x - M
    y = title(c, x, H - 78, "Complete", "Wellness Spaces", tw, 30)
    y = para(c, "Heat, cold and light planned together as one space — start with a single sauna and plan for the rest, or bring everything in at once.",
             x, y - 12, tw, style("Body", 9.6, 15, MUTED))
    y = bullets(c, [
        "<b>One assessment</b> — power, drainage and ventilation reviewed once, for every piece in the room.",
        "<b>One design language</b> — timber, finishes and placement chosen so the sauna, plunge and light sit together.",
        "<b>One team</b> — the same VYRO team from the first consultation to installation and support.",
    ], x, y - 10, tw, size=9)
    eyebrow(c, "For business", x, y - 18)
    y = para(c, "Thoughtfully planned wellness for gyms, hotels, spas, fitness studios, residential developments and architects.",
             x, y - 26, tw, style("Display", 12, 16))
    rows = [["Space", "What we plan"],
            ["Luxury hotels & hospitality", "Sauna, cold and light experiences that become part of your property's signature."],
            ["Premium gyms", "Recovery zones that match the quality of your training floor."],
            ["Wellness studios & spas", "Heat, cold and light woven into treatment and class journeys."],
            ["Residential developments", "Shared wellness amenities planned with developers and facility teams."]]
    table(c, rows, x, y - 12, [150, tw - 150], size=8.4)


def red_light_page(b: Book):
    d = b.d
    c = b.new_page()
    PAGES["Red Light Therapy"] = b.page
    photo(c, d["photos"]["redLight"], W * 0.5, 0, W * 0.5, H, (0.5, 0.5))
    b.chrome("Wellness Spaces", "Red Light Therapy")
    title(c, M, H - 82, "Red Light", "Therapy", 320, 36)
    c.setFillColor(INK)
    c.rect(M, H - 190, 84, 18, stroke=0, fill=1)
    c.setFillColor(IVORY)
    c.setFont("BodyMed", 7)
    c.drawString(M + 9, H - 184, "COMING SOON", charSpace=1)
    y = para(c, "Red and near-infrared light panels are coming to VYRO — panels for personal routines and larger-format systems for dedicated rooms.",
             M, H - 210, 320, style("Display", 13, 19))
    bullets(c, [
        "<b>Personal panels</b> — designed to stand, lean or mount in a bedroom, home gym or wellness corner.",
        "<b>Larger-format systems</b> — for wellness suites, gyms, studios and spas, alongside sauna and cold plunge.",
        "Planning a wellness space now? Your consultant can allow wall space and power for light therapy.",
    ], M, y - 16, 320, size=9.4)


def work_page(b: Book):
    d = b.d
    c = b.new_page()
    PAGES["How We Work & After-Sales"] = b.page
    b.chrome("How We Work")
    title(c, M, H - 82, "From Floor Plan", "to First Session", 380, 32)
    steps = d["haven"]["steps"]
    cw = (W - 2 * M - 2 * 18) / 3
    top = H - 180
    for i, s in enumerate(steps):
        x = M + i * (cw + 18)
        c.setStrokeColor(INK)
        c.setLineWidth(0.8)
        c.line(x, top, x + cw, top)
        c.setFont("BodyMed", 8)
        c.setFillColor(BRONZE_STRONG)
        c.drawString(x, top - 16, s["n"])
        yy = para(c, s["title"], x, top - 24, cw, style("Display", 18, 22))
        para(c, s["copy"], x, yy - 4, cw, style("Body", 9.4, 14, MUTED))
    a = d["afterSales"]
    c.setFillColor(INK)
    c.rect(0, 0, W, 230, stroke=0, fill=1)
    eyebrow(c, "Warranty & after-sales", M, 196, BRONZE)
    items = [
        (f"{a['heaterServiceYears']} years", "Sauna heaters", f"{a['heaterComprehensiveWarrantyYears']}-year comprehensive warranty, then {a['heaterSupportYears']} years of service support and spare parts ({a['heaterSupportCharges']})."),
        (f"{a['woodworkWorkmanshipMonths']} months", "Sauna woodwork", "Warranty against workmanship defects, subject to warranty conditions."),
        ("AMC", "Every product", "Annual maintenance contracts are available for every VYRO product."),
        (d["contact"]["responseTime"].replace("within ", "").capitalize(), "Every enquiry", f"Our team replies to every enquiry {d['contact']['responseTime']}."),
    ]
    cw = (W - 2 * M - 3 * 18) / 4
    for i, (big, label, copy) in enumerate(items):
        x = M + i * (cw + 18)
        c.setFillColor(BRONZE)
        c.setFont("Display", 24)
        c.drawString(x, 140, big)
        eyebrow(c, label, x, 122, IVORY)
        para(c, copy, x, 112, cw, style("Body", 8.4, 12.4, colors.HexColor("#C9C1B5")))
    b.number(dark=True)


def back_cover(b: Book):
    d = b.d
    k = d["contact"]
    c = b.new_page()
    PAGES["Contact"] = b.page
    photo(c, d["photos"]["hospitality"], 0, 0, W, H, (0.5, 0.5))
    c.saveState()
    c.setFillColor(colors.Color(0.07, 0.07, 0.08, alpha=0.62))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.restoreState()
    logo(c, W / 2, H - 120, 40, IVORY)
    c.setFillColor(IVORY)
    c.setFont("Display", 30)
    c.drawCentredString(W / 2, H - 205, "Book a Consultation")
    c.setFont("Body", 10)
    c.drawCentredString(W / 2, H - 228, f"Talk to a VYRO wellness consultant. We reply {k['responseTime']}.")
    lines = [
        ("Phone / WhatsApp", k["phone"]),
        ("General", k["infoEmail"]),
        ("Sales", k["salesEmail"]),
        ("Support", k["supportEmail"]),
        ("Website", f"www.{k['domain']}"),
    ]
    if k.get("instagram"):
        lines.append(("Instagram", k["instagram"]))
    y = H - 280
    for lab, val in lines:
        c.setFont("BodyMed", 7)
        c.setFillColor(BRONZE)
        c.drawRightString(W / 2 - 10, y, lab.upper(), charSpace=1.2)
        c.setFont("BodyReg", 11)
        c.setFillColor(IVORY)
        c.drawString(W / 2 + 10, y - 1, val)
        y -= 22
    c.setFont("Body", 6.5)
    c.setFillColor(colors.HexColor("#BDB3A3"))
    note = (f"Product images are renders for illustration. Sizes are indicative; your consultant confirms specifications, "
            f"dimensions and finishes in your quote. Prices are MRP in INR as of {as_of(d['asOf'])} and may change.")
    para(c, note, W / 2 - 260, 60, 520, style("Body", 6.5, 9.5, colors.HexColor("#BDB3A3"), alignment=1))


def as_of(iso: str) -> str:
    import datetime
    return datetime.date.fromisoformat(iso).strftime("%B %Y")


def build(data, dry=False):
    b = Book(data)
    cover(b)
    contents(b)
    about(b)
    PAGES["Saunas"] = b.page + 1
    opener(b, data["photos"]["saunaInterior"], "SAUNA", "Haven Series",
           f"Traditional, glass-front, infrared and compact cabins, crafted in {data['haven']['standardWood'].lower()} with six wood upgrades and installed by our team {data['haven']['installation']}.")
    haven_glance(b)
    series_page(b, "standard", "Haven Classic", [
        "Traditional cabin heated by an Ember sauna heater and stones",
        "Timber door with a tall glass panel",
        "Three sizes, from private sessions to 6 or more",
    ])
    series_page(b, "glass-front", "Haven Glass", [
        "Full glass façade in a black frame",
        "An open, airy feel that becomes a design feature",
        "Three sizes, up to a 6+ person statement sauna",
    ])
    series_pair(b)
    woods_page(b)
    heaters_page(b)
    controls_accessories(b)
    glacier_opener(b)
    glacier_range(b)
    glacier_data(b)
    chillers_page(b)
    project_page(b)
    PAGES["Wellness Spaces & Commercial"] = b.page + 1
    opener(b, data["photos"]["hospitality"], "WELLNESS", "Spaces & Commercial",
           "Complete wellness spaces for homes, and thoughtfully planned wellness for gyms, hotels, spas and studios — heat, cold and light, with one assessment and one team.",
           panel_x=W - M - 300)
    spaces_page(b)
    red_light_page(b)
    work_page(b)
    back_cover(b)
    if dry:
        return b
    b.save()
    return b


def main():
    data = json.load(open(sys.argv[1]))
    register_fonts()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    real = OUT
    # Dry run to learn page numbers for the contents page, then the real build.
    globals()["OUT"] = Path("/tmp/vyro-catalogue-dry.pdf")
    build(data, dry=False)
    globals()["OUT"] = real
    build(data)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
