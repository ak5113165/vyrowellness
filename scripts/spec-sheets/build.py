"""Build the downloadable VYRO spec sheets (A4 PDFs) from the website content.

    bun scripts/spec-sheets/export-data.ts > /tmp/vyro-spec-data.json
    python3 scripts/spec-sheets/build.py /tmp/vyro-spec-data.json

Writes public/downloads/vyro-glacier-spec-sheet.pdf and
public/downloads/vyro-haven-spec-sheet.pdf. Re-run both commands whenever
prices, specs or product images change. Needs reportlab and the Lora and
Poppins fonts (falls back to DejaVu if they are missing).
"""
import json
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle

# ---------------------------------------------------------------- brand ----
INK = colors.HexColor("#1B1D1F")
IVORY = colors.HexColor("#F4EFE7")
CARD = colors.HexColor("#F8ECDE")  # matches the product renders' background
BRONZE = colors.HexColor("#A98A5E")
BRONZE_STRONG = colors.HexColor("#8C6A3F")
MUTED = colors.HexColor("#5F5A54")
RULE = colors.HexColor("#DDD5C8")

W, H = A4
M = 40  # page margin

GF = Path("/usr/share/fonts/truetype/google-fonts")
DV = Path("/usr/share/fonts/truetype/dejavu")


def register_fonts() -> None:
    def reg(name: str, primary: Path, fallback: Path) -> None:
        pdfmetrics.registerFont(TTFont(name, str(primary if primary.exists() else fallback)))

    reg("Display", GF / "Lora-Variable.ttf", DV / "DejaVuSerif.ttf")
    reg("Body", GF / "Poppins-Light.ttf", DV / "DejaVuSans.ttf")
    reg("BodyMed", GF / "Poppins-Medium.ttf", DV / "DejaVuSans-Bold.ttf")
    # Lora has no rupee sign; prices are set in Poppins.
    reg("Price", GF / "Poppins-Regular.ttf", DV / "DejaVuSans.ttf")


def style(font="Body", size=9, leading=None, color=INK, **kw) -> ParagraphStyle:
    return ParagraphStyle(
        "s", fontName=font, fontSize=size, leading=leading or size * 1.45, textColor=color, alignment=TA_LEFT, **kw
    )


def para(c, text, x, y_top, width, st) -> float:
    """Draw a paragraph with its top at y_top; return the y below it."""
    p = Paragraph(text, st)
    _, h = p.wrap(width, 1000)
    p.drawOn(c, x, y_top - h)
    return y_top - h


def eyebrow(c, text, x, y, color=BRONZE_STRONG, size=7) -> None:
    c.setFont("BodyMed", size)
    c.setFillColor(color)
    c.drawString(x, y, text.upper(), charSpace=1.2)


def band(c, label: str) -> None:
    c.setFillColor(INK)
    c.rect(0, H - 56, W, 56, stroke=0, fill=1)
    c.setFillColor(IVORY)
    c.setFont("Display", 20)
    c.drawString(M, H - 36, "V Y R O")
    c.setFont("BodyMed", 7)
    c.setFillColor(BRONZE)
    c.drawRightString(W - M, H - 33, label.upper())


def footer(c, data, page: int, total: int, note: str) -> None:
    ct = data["contact"]
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.line(M, 52, W - M, 52)
    c.setFont("Body", 7)
    c.setFillColor(MUTED)
    c.drawString(M, 40, f"{ct['domain']}   ·   {ct['phone']}   ·   {ct['salesEmail']}")
    c.drawRightString(W - M, 40, f"{page} / {total}")
    c.setFont("Body", 6.5)
    c.drawString(M, 29, note)


def image(c, path: str, x, y, w, h) -> None:
    c.setFillColor(CARD)
    c.rect(x, y, w, h, stroke=0, fill=1)
    try:
        img = ImageReader(path)
        iw, ih = img.getSize()
        scale = min(w / iw, h / ih)
        dw, dh = iw * scale, ih * scale
        c.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
    except Exception as exc:  # keep building even if one image is missing
        print("image skipped:", path, exc)


def table(c, rows, x, y_top, col_widths, header=True, size=8) -> float:
    cell = style(size=size, leading=size * 1.35)
    head = style("BodyMed", size=6.5, color=MUTED)
    body = [[Paragraph(str(v), head if (header and r == 0) or col == 0 else cell) for col, v in enumerate(row)]
            for r, row in enumerate(rows)]
    t = Table(body, colWidths=col_widths)
    cmds = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, RULE),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]
    if header:
        cmds.append(("LINEBELOW", (0, 0), (-1, 0), 0.9, INK))
    t.setStyle(TableStyle(cmds))
    _, h = t.wrap(sum(col_widths), 1000)
    t.drawOn(c, x, y_top - h)
    return y_top - h


def two_line_width(label: str) -> str:
    """'Approx. 3.9–4.9 ft wide (1.2–1.5 m)' -> feet on one line, metres below."""
    feet, _, metric = label.replace("Approx. ", "approx. ").partition(" (")
    return f"{feet}<br/><font color='#5F5A54'>({metric}</font>" if metric else feet


# -------------------------------------------------------------- glacier ----
def glacier(data, out: Path) -> None:
    g = data["glacier"]
    cities = ", ".join(g["cities"][:-1]) + " and " + g["cities"][-1]
    note = (
        f"Prices are MRP in Indian rupees and include the {g['included']}. "
        f"Specifications as of {data['asOf']}; please confirm current details on {data['contact']['domain']}."
    )
    c = canvas.Canvas(str(out), pagesize=A4)
    c.setTitle("VYRO Glacier — Launch Range Spec Sheet")
    c.setAuthor("VYRO Wellness")

    # Page 1 — the three launch models + comparison
    c.setFillColor(IVORY); c.rect(0, 0, W, H, stroke=0, fill=1)
    band(c, "Glacier cold plunge · spec sheet")
    y = H - 88
    eyebrow(c, f"Launching {g['launchLabel']}  ·  Made in {g['madeIn']}", M, y)
    y = para(c, "The Glacier Launch Range", M, y - 8, W - 2 * M, style("Display", 26, 30))
    y = para(
        c,
        f"Three cold plunges, each sold with the VYRO {g['included']}. Available first in {cities}.",
        M, y - 6, 380, style(size=9.5, color=MUTED),
    )

    gap = 16
    colw = (W - 2 * M - 2 * gap) / 3
    top = y - 18
    bottoms = []
    for i, m in enumerate(g["models"]):
        x = M + i * (colw + gap)
        image(c, m["image"], x, top - colw, colw, colw)
        yy = top - colw - 16
        eyebrow(c, m["tag"], x, yy, size=6.5)
        yy = para(c, m["name"], x, yy - 4, colw, style("Display", 15, 18))
        yy = para(c, m["size"], x, yy - 1, colw, style(size=7.5, color=MUTED))
        c.setStrokeColor(RULE); c.line(x, yy - 6, x + colw, yy - 6)
        yy = para(c, m["price"]["display"], x, yy - 10, colw, style("Price", 16, 19))
        if m["price"]["note"]:
            yy = para(c, m["price"]["note"], x, yy - 1, colw, style(size=7, color=MUTED))
        yy = para(c, f"2HP chiller upgrade: {g['upgradePrice']}", x, yy - 1, colw, style(size=7, color=MUTED))
        c.line(x, yy - 6, x + colw, yy - 6)
        yy = para(c, "<br/>".join(f"— {f}" for f in m["keyFacts"]), x, yy - 10, colw, style(size=7.5, leading=11))
        bottoms.append(yy)

    y = min(bottoms) - 22
    eyebrow(c, "Compare at a glance", M, y)
    labels = [s["label"] for s in g["models"][0]["specs"]]
    rows = [[""] + [m["name"] for m in g["models"]]]
    for lab in labels:
        rows.append([lab] + [next(s["value"] for s in m["specs"] if s["label"] == lab) for m in g["models"]])
    rows.append(["MRP (incl. 1HP chiller and installation)"] + [m["price"]["display"] for m in g["models"]])
    rows.append(["2HP chiller upgrade"] + [g["upgradePrice"]] * 3)
    rows.append(["Launch"] + [g["launchLabel"]] * 3)
    first = 130
    table(c, rows, M, y - 8, [first] + [(W - 2 * M - first) / 3] * 3)
    footer(c, data, 1, 2, note)
    c.showPage()

    # Page 2 — chillers, requirements, project collection, contact
    c.setFillColor(IVORY); c.rect(0, 0, W, H, stroke=0, fill=1)
    band(c, "Glacier cold plunge · spec sheet")
    y = H - 88
    eyebrow(c, f"Chilling systems  ·  Launching {g['launchLabel']}", M, y)
    y = para(c, "1HP Included. 2HP for Faster Cooling.", M, y - 8, W - 2 * M, style("Display", 20, 24))
    colw = (W - 2 * M - gap) / 2
    top = y - 16
    lows = []
    for i, ch in enumerate(g["chillers"]):
        x = M + i * (colw + gap)
        img = 110
        image(c, ch["image"], x, top - img, img, img)
        tx, tw = x + img + 12, colw - img - 12
        yy = para(c, ch["name"], tx, top, tw, style("Display", 13, 16))
        yy = para(c, ch["copy"], tx, yy - 3, tw, style(size=7.5, color=MUTED, leading=10.5))
        yy = para(c, f"Best for: {ch['best']}", tx, yy - 3, tw, style(size=7.5, leading=10.5))
        yy = para(c, f"Chiller only, MRP  <font name='Price' size='11'>{ch['mrp']}</font>", tx, yy - 5, tw,
                  style(size=7.5, leading=13))
        lows.append(min(yy, top - img))
    y = min(lows) - 24

    eyebrow(c, "Installation requirements · external chillers", M, y)
    rows = [[r["label"], r["value"]] for r in g["requirements"]]
    rows += [["Water capacity (launch range)", g["waterCapacity"]], ["Installation", f"Included in MRP · first in {cities}"]]
    y = table(c, rows, M, y - 8, [170, W - 2 * M - 170], header=False, size=8.5) - 24

    eyebrow(c, "Coming soon · custom and premium projects", M, y)
    y = para(c, "The Project Collection", M, y - 8, W - 2 * M, style("Display", 16, 20))
    pw = (W - 2 * M - 3 * 12) / 4
    top = y - 10
    lows = []
    for i, p in enumerate(g["projectModels"]):
        x = M + i * (pw + 12)
        image(c, p["image"], x, top - 70, pw, 70)
        yy = para(c, p["name"], x, top - 78, pw, style("Display", 10.5, 13))
        yy = para(c, p["copy"], x, yy - 2, pw, style(size=6.8, color=MUTED, leading=9.2))
        lows.append(yy)
    y = min(lows) - 22

    ct = data["contact"]
    c.setFillColor(INK)
    c.rect(M, y - 74, W - 2 * M, 74, stroke=0, fill=1)
    para(c, "Register for launch or talk to a specialist", M + 16, y - 14, 300, style("Display", 13, 16, color=IVORY))
    para(
        c,
        f"Phone / WhatsApp {ct['phone']}<br/>{ct['salesEmail']}  ·  {ct['domain']}/cold-plunge<br/>"
        f"Our team replies {ct['responseTime']}.",
        M + 16, y - 36, 330, style(size=8, color=IVORY, leading=12),
    )
    footer(c, data, 2, 2, note)
    c.showPage()
    c.save()


# ---------------------------------------------------------------- haven ----
def haven(data, out: Path) -> None:
    hv = data["haven"]
    note = (
        f"Sizes are indicative; final dimensions are confirmed per project. Pricing on request. "
        f"As of {data['asOf']} — confirm current details on {data['contact']['domain']}."
    )
    c = canvas.Canvas(str(out), pagesize=A4)
    c.setTitle("VYRO Haven — Sauna Range Spec Sheet")
    c.setAuthor("VYRO Wellness")

    # Page 1 — series, sizes, models
    c.setFillColor(IVORY); c.rect(0, 0, W, H, stroke=0, fill=1)
    band(c, "Haven sauna · spec sheet")
    y = H - 88
    eyebrow(c, f"Saunas  ·  Installed by our team {hv['installation']}", M, y)
    y = para(c, "The Haven Sauna Range", M, y - 8, W - 2 * M, style("Display", 26, 30))
    upgrades = [w["name"] for w in hv["woods"] if not w.get("standard")]
    y = para(
        c,
        f"Every Haven cabin is crafted in {hv['standardWood'].lower()} as standard, with {len(upgrades)} wood upgrades, "
        f"{len(hv['heaters'])} Ember heaters, {len(hv['controlPanels'])} Pulse control panels and "
        f"{len(hv['accessorySets'])} Ritual accessory sets.",
        M, y - 6, 420, style(size=9.5, color=MUTED),
    )

    gap = 12
    colw = (W - 2 * M - 3 * gap) / 4
    top = y - 16
    lows = []
    for i, t in enumerate(hv["roomTypes"]):
        x = M + i * (colw + gap)
        image(c, t["image"], x, top - colw, colw, colw)
        yy = top - colw - 13
        eyebrow(c, t["series"], x, yy, size=6.5)
        yy = para(c, t["name"], x, yy - 3, colw, style("Display", 12.5, 15))
        yy = para(c, t["short"], x, yy - 2, colw, style(size=7, color=MUTED, leading=9.8))
        lows.append(yy)
    y = min(lows) - 20

    eyebrow(c, "Sizes", M, y)
    rows = [["Size", "Indicative width", "Capacity"]] + [
        [s["name"], s["width"].replace("Approx. ", "approx. "), s["people"]] for s in hv["roomSizes"]
    ]
    y = table(c, rows, M, y - 8, [90, 220, W - 2 * M - 310]) - 20

    eyebrow(c, "Models", M, y)
    rows = [["Model", "Indicative width", "Seats", "Description"]] + [
        [f"{m['name']} {m['code']}", two_line_width(m["width"]), m["people"], m["copy"]]
        for m in hv["models"]
    ]
    table(c, rows, M, y - 8, [92, 128, 58, W - 2 * M - 278], size=7.5)
    footer(c, data, 1, 2, note)
    c.showPage()

    # Page 2 — woods, heaters, controls, accessories, process, contact
    c.setFillColor(IVORY); c.rect(0, 0, W, H, stroke=0, fill=1)
    band(c, "Haven sauna · spec sheet")
    y = H - 84
    half = (W - 2 * M - 20) / 2
    eyebrow(c, "Wood options", M, y)
    rows = [["Wood", "", "Character"]] + [
        [w["name"], "Standard" if w.get("standard") else "Upgrade", w["note"]] for w in hv["woods"]
    ]
    yl = table(c, rows, M, y - 8, [62, 46, half - 108], size=7.5)

    eyebrow(c, "Ember heaters", M + half + 20, y)
    rows = [["Heater", "Type", "Description"]] + [[h["name"], h["kind"], h["copy"]] for h in hv["heaters"]]
    yr = table(c, rows, M + half + 20, y - 8, [50, 76, half - 126], size=7.5)
    y = min(yl, yr) - 22

    eyebrow(c, "Pulse control panels", M, y)
    rows = [["Panel", "Type", "Description"]] + [[p["name"], p["kind"], p["copy"]] for p in hv["controlPanels"]]
    yl = table(c, rows, M, y - 8, [60, 60, half - 120], size=7.5)
    eyebrow(c, "Ritual accessory sets", M + half + 20, y)
    rows = [["Set", "Finish", "Includes"]] + [[a["name"], a["finish"], a["copy"]] for a in hv["accessorySets"]]
    yr = table(c, rows, M + half + 20, y - 8, [62, 56, half - 118], size=7.5)
    y = min(yl, yr) - 24

    eyebrow(c, "How it comes together", M, y)
    sw = (W - 2 * M - 2 * 16) / 3
    lows = []
    for i, s in enumerate(hv["steps"]):
        x = M + i * (sw + 16)
        c.setStrokeColor(INK); c.setLineWidth(0.8); c.line(x, y - 10, x + sw, y - 10)
        yy = para(c, f"<font name='BodyMed' size='7' color='#8C6A3F'>{s['n']}</font>", x, y - 16, sw, style(size=7))
        yy = para(c, s["title"], x, yy - 2, sw, style("Display", 12.5, 15))
        yy = para(c, s["copy"], x, yy - 2, sw, style(size=7.5, color=MUTED, leading=10.5))
        lows.append(yy)
    y = min(lows) - 24

    ct = data["contact"]
    c.setFillColor(INK)
    c.rect(M, y - 74, W - 2 * M, 74, stroke=0, fill=1)
    para(c, "Plan your sauna with us", M + 16, y - 14, 300, style("Display", 13, 16, color=IVORY))
    para(
        c,
        f"Phone / WhatsApp {ct['phone']}<br/>{ct['salesEmail']}  ·  {ct['domain']}/saunas<br/>"
        f"Our team replies {ct['responseTime']}.",
        M + 16, y - 36, 330, style(size=8, color=IVORY, leading=12),
    )
    footer(c, data, 2, 2, note)
    c.showPage()
    c.save()


def main() -> None:
    data = json.loads(Path(sys.argv[1]).read_text())
    register_fonts()
    out = Path("public/downloads")
    out.mkdir(parents=True, exist_ok=True)
    glacier(data, out / "vyro-glacier-spec-sheet.pdf")
    haven(data, out / "vyro-haven-spec-sheet.pdf")
    print("wrote", *sorted(p.name for p in out.glob("*.pdf")))


if __name__ == "__main__":
    main()
