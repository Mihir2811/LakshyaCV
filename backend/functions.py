"""
functions.py — All resume data processing and PDF generation logic.
Three templates: classic, executive, modern.
No FastAPI imports here. Pure business logic only.
"""

import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, KeepTogether
)

PAGE_W, PAGE_H = A4

MARGIN_TIGHT  = 12 * mm
MARGIN_MODERN = 13 * mm
MARGIN_BOTTOM = 16 * mm


# ══════════════════════════════════════════════════════════════════════════════
# DATA PARSING
# ══════════════════════════════════════════════════════════════════════════════
def parse_resume_data(raw: dict) -> dict:
    def clean(val, default=""):
        return str(val).strip() if val else default

    def clean_list(lst):
        return [item for item in (lst or []) if any(str(v).strip() for v in item.values())]

    personal = raw.get("personal", {})
    return {
        "personal": {
            "name":     clean(personal.get("name"), "Your Name"),
            "title":    clean(personal.get("title")),
            "email":    clean(personal.get("email")),
            "phone":    clean(personal.get("phone")),
            "location": clean(personal.get("location")),
            "linkedin": clean(personal.get("linkedin")),
            "github":   clean(personal.get("github")),
            "website":  clean(personal.get("website")),
        },
        "summary":      clean(raw.get("summary")),
        "experience":   clean_list(raw.get("experience", [])),
        "education":    clean_list(raw.get("education", [])),
        "skills":       [s.strip() for s in clean(raw.get("skills")).split(",") if s.strip()],
        "projects":     clean_list(raw.get("projects", [])),
        "certificates": clean_list(raw.get("certificates", [])),
    }


# ══════════════════════════════════════════════════════════════════════════════
# SHARED HELPERS
# ══════════════════════════════════════════════════════════════════════════════
def make_contact_parts(p: dict, link_color: str = "#1d7a6b") -> list:
    parts = []
    if p["email"]:
        parts.append(f'<a href="mailto:{p["email"]}" color="{link_color}">{p["email"]}</a>')
    if p["phone"]:
        parts.append(p["phone"])
    if p["location"]:
        parts.append(p["location"])
    if p["linkedin"]:
        href = p["linkedin"] if p["linkedin"].startswith("http") else f'https://{p["linkedin"]}'
        parts.append(f'<a href="{href}" color="{link_color}">LinkedIn</a>')
    if p["github"]:
        href = p["github"] if p["github"].startswith("http") else f'https://{p["github"]}'
        parts.append(f'<a href="{href}" color="{link_color}">GitHub</a>')
    if p["website"]:
        href = p["website"] if p["website"].startswith("http") else f'https://{p["website"]}'
        parts.append(f'<a href="{href}" color="{link_color}">Portfolio</a>')
    return parts


def parse_bullets(text: str) -> list:
    lines = []
    for line in text.split("\n"):
        line = line.strip().lstrip("-*").strip()
        if line.startswith("•"):
            line = line[1:].strip()
        if line:
            lines.append(line)
    return lines


def footer_fn(accent_hex: str):
    def _footer(canvas_obj, doc):
        canvas_obj.saveState()
        canvas_obj.setFont("Helvetica", 7.5)
        canvas_obj.setFillColor(colors.HexColor("#aaaaaa"))
        date_str = datetime.now().strftime("%B %Y")
        canvas_obj.drawString(doc.leftMargin, 10 * mm, f"Generated {date_str}")
        canvas_obj.drawRightString(PAGE_W - doc.rightMargin, 10 * mm, f"Page {doc.page}")
        canvas_obj.restoreState()
    return _footer


def _two_col_table(rows, usable_w):
    t = Table(rows, colWidths=[usable_w * 0.72, usable_w * 0.28])
    t.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
        ("TOPPADDING",    (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    return t


def _skills_row_pills(skills: list, usable_w: float, pill_bg, text_hex: str, per_row: int = 6):
    """Render skills as coloured pill grid, row-wise, no wasted space."""
    if not skills:
        return []
    pill_style = ParagraphStyle("pill",
        fontName="Helvetica", fontSize=8.5,
        textColor=colors.HexColor(text_hex), leading=11,
        alignment=TA_CENTER)

    rows = []
    for i in range(0, len(skills), per_row):
        chunk = skills[i:i+per_row]
        while len(chunk) < per_row:
            chunk.append("")
        rows.append([Paragraph(sk, pill_style) for sk in chunk])

    col_w = usable_w / per_row
    t = Table(rows, colWidths=[col_w] * per_row)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), pill_bg),
        ("GRID",          (0, 0), (-1, -1), 1, colors.white),
        ("LEFTPADDING",   (0, 0), (-1, -1), 4),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 4),
        ("TOPPADDING",    (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN",         (0, 0), (-1, -1), "CENTER"),
    ]))
    return [t]


def _skills_row_plain(skills: list, style):
    """Classic template: skills as dot-separated inline text."""
    return [Paragraph("  ·  ".join(skills), style)]


def _job_block(job, s, usable_w):
    items = []
    company = job.get("company", "")
    role    = job.get("role", "")
    period  = job.get("period", "")
    bullets = job.get("bullets", "")
    if company or period:
        row = [[Paragraph(company, s["job_company"]), Paragraph(period, s["job_date"])]]
        items.append(_two_col_table(row, usable_w))
    if role:
        items.append(Paragraph(role, s["job_role"]))
    for b in parse_bullets(bullets):
        items.append(Paragraph(f"• {b}", s["bullet"]))
    return items


def _edu_block(edu, s, usable_w):
    items = []
    inst  = edu.get("institution", "")
    deg   = edu.get("degree", "")
    year  = edu.get("year", "")
    gpa   = edu.get("gpa", "")
    if inst or year:
        row = [[Paragraph(inst, s["edu_inst"]), Paragraph(year, s["job_date"])]]
        items.append(_two_col_table(row, usable_w))
    deg_line = deg + (f"  —  GPA: {gpa}" if gpa else "")
    if deg_line.strip():
        items.append(Paragraph(deg_line, s["edu_deg"]))
    return items


def _project_block(proj, s, link_color: str):
    items = []
    name = proj.get("name", "")
    desc = proj.get("description", "")
    tech = proj.get("tech", "")
    url  = proj.get("url", "")
    name_str = name
    if url:
        href = url if url.startswith("http") else f"https://{url}"
        name_str = f'{name}  <a href="{href}" color="{link_color}"><u>View</u></a>'
    if name_str:
        items.append(Paragraph(name_str, s["proj_name"]))
    if tech:
        items.append(Paragraph(f"Tech: {tech}", s["proj_tech"]))
    for b in parse_bullets(desc):
        items.append(Paragraph(f"• {b}", s["bullet"]))
    return items


# ══════════════════════════════════════════════════════════════════════════════
# TEMPLATE 1 — CLASSIC (black & white, Times + Helvetica)
# ══════════════════════════════════════════════════════════════════════════════
def _classic_styles():
    BLK = colors.black
    MID = colors.HexColor("#444444")
    LGT = colors.HexColor("#777777")
    return {
        "name":        ParagraphStyle("c_name", fontName="Times-Bold", fontSize=22,
                           textColor=BLK, leading=26, spaceAfter=1, alignment=TA_CENTER),
        "title":       ParagraphStyle("c_title", fontName="Times-Italic", fontSize=11,
                           textColor=MID, leading=15, spaceAfter=3, alignment=TA_CENTER),
        "contact":     ParagraphStyle("c_contact", fontName="Helvetica", fontSize=8.5,
                           textColor=MID, leading=12, alignment=TA_CENTER),
        "section":     ParagraphStyle("c_section", fontName="Helvetica-Bold", fontSize=9,
                           textColor=BLK, leading=12, spaceBefore=10, spaceAfter=2,
                           letterSpacing=1.5),
        "job_company": ParagraphStyle("c_co", fontName="Times-Bold", fontSize=10.5,
                           textColor=BLK, leading=14),
        "job_role":    ParagraphStyle("c_role", fontName="Times-Italic", fontSize=10,
                           textColor=MID, leading=13, spaceAfter=1),
        "job_date":    ParagraphStyle("c_date", fontName="Helvetica", fontSize=8.5,
                           textColor=LGT, leading=13, alignment=TA_RIGHT),
        "bullet":      ParagraphStyle("c_bullet", fontName="Times-Roman", fontSize=9.5,
                           textColor=BLK, leading=13, leftIndent=10, spaceAfter=1),
        "summary":     ParagraphStyle("c_summary", fontName="Times-Roman", fontSize=10,
                           textColor=MID, leading=14, spaceAfter=2),
        "skill":       ParagraphStyle("c_skill", fontName="Helvetica", fontSize=9,
                           textColor=BLK, leading=13),
        "edu_inst":    ParagraphStyle("c_edu_inst", fontName="Times-Bold", fontSize=10.5,
                           textColor=BLK, leading=14),
        "edu_deg":     ParagraphStyle("c_edu_deg", fontName="Times-Roman", fontSize=10,
                           textColor=MID, leading=13),
        "proj_name":   ParagraphStyle("c_proj_name", fontName="Times-Bold", fontSize=10.5,
                           textColor=BLK, leading=14),
        "proj_tech":   ParagraphStyle("c_proj_tech", fontName="Helvetica", fontSize=8.5,
                           textColor=LGT, leading=12, spaceAfter=1),
        "proj_desc":   ParagraphStyle("c_proj_desc", fontName="Times-Roman", fontSize=9.5,
                           textColor=MID, leading=13),
    }


def build_classic_pdf(data: dict) -> bytes:
    s        = _classic_styles()
    buf      = io.BytesIO()
    usable_w = PAGE_W - 2 * MARGIN_TIGHT
    doc = SimpleDocTemplate(buf, pagesize=A4,
        leftMargin=MARGIN_TIGHT, rightMargin=MARGIN_TIGHT,
        topMargin=MARGIN_TIGHT, bottomMargin=MARGIN_BOTTOM,
        title=f"{data['personal']['name']} — Resume")

    p     = data["personal"]
    story = []

    # Header
    story.append(Paragraph(p["name"], s["name"]))
    if p["title"]:
        story.append(Paragraph(p["title"], s["title"]))
    parts = make_contact_parts(p, link_color="#000000")
    if parts:
        story.append(Paragraph("  ·  ".join(parts), s["contact"]))
    story.append(Spacer(1, 3 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceAfter=2))

    def section(title):
        return [
            Spacer(1, 1 * mm),
            Paragraph(title.upper(), s["section"]),
            HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cccccc"), spaceAfter=3),
        ]

    if data["summary"]:
        story += section("Profile Summary")
        story.append(Paragraph(data["summary"], s["summary"]))

    if data["experience"]:
        story += section("Experience")
        for i, job in enumerate(data["experience"]):
            story += _job_block(job, s, usable_w)
            if i < len(data["experience"]) - 1:
                story.append(Spacer(1, 3 * mm))

    if data["projects"]:
        story += section("Projects")
        for i, proj in enumerate(data["projects"]):
            story += _project_block(proj, s, "#000000")
            if i < len(data["projects"]) - 1:
                story.append(Spacer(1, 2.5 * mm))

    if data["education"]:
        story += section("Education")
        for i, edu in enumerate(data["education"]):
            story += _edu_block(edu, s, usable_w)
            if i < len(data["education"]) - 1:
                story.append(Spacer(1, 2 * mm))

    if data["skills"]:
        story += section("Skills")
        story += _skills_row_plain(data["skills"], s["skill"])

    doc.build(story, onFirstPage=footer_fn("#000000"), onLaterPages=footer_fn("#000000"))
    buf.seek(0)
    return buf.read()


# ══════════════════════════════════════════════════════════════════════════════
# TEMPLATE 2 — EXECUTIVE (navy + gold accents, corporate)
# ══════════════════════════════════════════════════════════════════════════════
NAVY     = colors.HexColor("#1a2e4a")
GOLD     = colors.HexColor("#b8903a")
EXEC_MID = colors.HexColor("#3a3a3a")
EXEC_LGT = colors.HexColor("#6a6a6a")


def _exec_styles():
    return {
        "name":        ParagraphStyle("e_name", fontName="Helvetica-Bold", fontSize=24,
                           textColor=colors.white, leading=28, spaceAfter=2),
        "title":       ParagraphStyle("e_title", fontName="Helvetica", fontSize=11,
                           textColor=colors.HexColor("#d4b06a"), leading=15),
        "contact":     ParagraphStyle("e_contact", fontName="Helvetica", fontSize=8.5,
                           textColor=colors.HexColor("#b8cce0"), leading=13),
        "section":     ParagraphStyle("e_section", fontName="Helvetica-Bold", fontSize=8.5,
                           textColor=NAVY, leading=12, spaceBefore=8, spaceAfter=2,
                           letterSpacing=1.8),
        "job_company": ParagraphStyle("e_co", fontName="Helvetica-Bold", fontSize=10.5,
                           textColor=NAVY, leading=14),
        "job_role":    ParagraphStyle("e_role", fontName="Helvetica-Oblique", fontSize=10,
                           textColor=EXEC_MID, leading=13, spaceAfter=1),
        "job_date":    ParagraphStyle("e_date", fontName="Helvetica", fontSize=8.5,
                           textColor=EXEC_LGT, leading=13, alignment=TA_RIGHT),
        "bullet":      ParagraphStyle("e_bullet", fontName="Helvetica", fontSize=9.5,
                           textColor=EXEC_MID, leading=13.5, leftIndent=10, spaceAfter=1),
        "summary":     ParagraphStyle("e_summary", fontName="Helvetica", fontSize=10,
                           textColor=EXEC_MID, leading=14.5, spaceAfter=2),
        "skill":       ParagraphStyle("e_skill", fontName="Helvetica", fontSize=9,
                           textColor=colors.white, leading=13, alignment=TA_CENTER),
        "edu_inst":    ParagraphStyle("e_edu_inst", fontName="Helvetica-Bold", fontSize=10.5,
                           textColor=NAVY, leading=14),
        "edu_deg":     ParagraphStyle("e_edu_deg", fontName="Helvetica", fontSize=10,
                           textColor=EXEC_MID, leading=13),
        "proj_name":   ParagraphStyle("e_proj_name", fontName="Helvetica-Bold", fontSize=10.5,
                           textColor=NAVY, leading=14),
        "proj_tech":   ParagraphStyle("e_proj_tech", fontName="Helvetica-Oblique", fontSize=8.5,
                           textColor=GOLD, leading=12, spaceAfter=1),
        "proj_desc":   ParagraphStyle("e_proj_desc", fontName="Helvetica", fontSize=9.5,
                           textColor=EXEC_MID, leading=13),
    }


def build_executive_pdf(data: dict) -> bytes:
    s        = _exec_styles()
    buf      = io.BytesIO()
    usable_w = PAGE_W - 2 * MARGIN_TIGHT
    doc = SimpleDocTemplate(buf, pagesize=A4,
        leftMargin=MARGIN_TIGHT, rightMargin=MARGIN_TIGHT,
        topMargin=0, bottomMargin=MARGIN_BOTTOM,
        title=f"{data['personal']['name']} — Resume")

    p     = data["personal"]
    story = []

    # Navy header band
    name_content = [Paragraph(p["name"], s["name"])]
    if p["title"]:
        name_content.append(Paragraph(p["title"], s["title"]))
    parts = make_contact_parts(p, link_color="#b8cce0")
    if parts:
        name_content.append(Spacer(1, 2 * mm))
        name_content.append(Paragraph("  ·  ".join(parts), s["contact"]))

    header_tbl = Table([[name_content]], colWidths=[usable_w])
    header_tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), NAVY),
        ("LEFTPADDING",   (0, 0), (-1, -1), 14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
        ("TOPPADDING",    (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(header_tbl)
    story.append(HRFlowable(width="100%", thickness=3, color=GOLD, spaceAfter=4))

    def section(title):
        return [
            Paragraph(title.upper(), s["section"]),
            HRFlowable(width="100%", thickness=1.5, color=NAVY, spaceAfter=4),
        ]

    if data["summary"]:
        story += section("Profile Summary")
        story.append(Paragraph(data["summary"], s["summary"]))

    if data["experience"]:
        story += section("Experience")
        for i, job in enumerate(data["experience"]):
            story += _job_block(job, s, usable_w)
            if i < len(data["experience"]) - 1:
                story.append(Spacer(1, 3 * mm))

    if data["projects"]:
        story += section("Projects")
        for i, proj in enumerate(data["projects"]):
            story += _project_block(proj, s, GOLD.hexval())
            if i < len(data["projects"]) - 1:
                story.append(Spacer(1, 2.5 * mm))

    if data["education"]:
        story += section("Education")
        for i, edu in enumerate(data["education"]):
            story += _edu_block(edu, s, usable_w)
            if i < len(data["education"]) - 1:
                story.append(Spacer(1, 2 * mm))

    if data["skills"]:
        story += section("Skills")
        story += _skills_row_pills(data["skills"], usable_w, NAVY, "#ffffff", per_row=6)

    doc.build(story, onFirstPage=footer_fn(NAVY.hexval()), onLaterPages=footer_fn(NAVY.hexval()))
    buf.seek(0)
    return buf.read()


# ══════════════════════════════════════════════════════════════════════════════
# TEMPLATE 3 — MODERN (teal, warm bg feel, clean sans)
# ══════════════════════════════════════════════════════════════════════════════
TEAL     = colors.HexColor("#1d7a6b")
TEAL_DK  = colors.HexColor("#155a4e")
MOD_DARK = colors.HexColor("#1a1a1a")
MOD_MID  = colors.HexColor("#4a4a4a")
MOD_LGT  = colors.HexColor("#767676")
MOD_RULE = colors.HexColor("#d0ccc7")


def _modern_styles():
    return {
        "name":        ParagraphStyle("m_name", fontName="Helvetica-Bold", fontSize=26,
                           textColor=MOD_DARK, leading=30, spaceAfter=2),
        "title":       ParagraphStyle("m_title", fontName="Helvetica", fontSize=12,
                           textColor=TEAL, leading=16, spaceAfter=4),
        "contact":     ParagraphStyle("m_contact", fontName="Helvetica", fontSize=8.5,
                           textColor=MOD_MID, leading=12),
        "section":     ParagraphStyle("m_section", fontName="Helvetica-Bold", fontSize=9,
                           textColor=TEAL, leading=12, spaceBefore=10, spaceAfter=2,
                           letterSpacing=1.4),
        "job_company": ParagraphStyle("m_co", fontName="Helvetica-Bold", fontSize=10.5,
                           textColor=MOD_DARK, leading=14),
        "job_role":    ParagraphStyle("m_role", fontName="Helvetica-Oblique", fontSize=10,
                           textColor=MOD_MID, leading=13, spaceAfter=1),
        "job_date":    ParagraphStyle("m_date", fontName="Helvetica", fontSize=8.5,
                           textColor=MOD_LGT, leading=13, alignment=TA_RIGHT),
        "bullet":      ParagraphStyle("m_bullet", fontName="Helvetica", fontSize=9.5,
                           textColor=MOD_DARK, leading=13.5, leftIndent=10, spaceAfter=1),
        "summary":     ParagraphStyle("m_summary", fontName="Helvetica", fontSize=10,
                           textColor=MOD_MID, leading=14.5, spaceAfter=2),
        "skill":       ParagraphStyle("m_skill", fontName="Helvetica", fontSize=8.5,
                           textColor=colors.white, leading=11, alignment=TA_CENTER),
        "edu_inst":    ParagraphStyle("m_edu_inst", fontName="Helvetica-Bold", fontSize=10.5,
                           textColor=MOD_DARK, leading=14),
        "edu_deg":     ParagraphStyle("m_edu_deg", fontName="Helvetica", fontSize=10,
                           textColor=MOD_MID, leading=13),
        "proj_name":   ParagraphStyle("m_proj_name", fontName="Helvetica-Bold", fontSize=10.5,
                           textColor=MOD_DARK, leading=14),
        "proj_tech":   ParagraphStyle("m_proj_tech", fontName="Helvetica-Oblique", fontSize=8.5,
                           textColor=TEAL, leading=12, spaceAfter=1),
        "proj_desc":   ParagraphStyle("m_proj_desc", fontName="Helvetica", fontSize=9.5,
                           textColor=MOD_MID, leading=13),
    }


def build_modern_pdf(data: dict) -> bytes:
    s        = _modern_styles()
    buf      = io.BytesIO()
    usable_w = PAGE_W - 2 * MARGIN_MODERN
    doc = SimpleDocTemplate(buf, pagesize=A4,
        leftMargin=MARGIN_MODERN, rightMargin=MARGIN_MODERN,
        topMargin=MARGIN_MODERN, bottomMargin=MARGIN_BOTTOM,
        title=f"{data['personal']['name']} — Resume")

    p     = data["personal"]
    story = []

    # Header
    story.append(Paragraph(p["name"], s["name"]))
    if p["title"]:
        story.append(Paragraph(p["title"], s["title"]))
    parts = make_contact_parts(p, link_color=TEAL.hexval())
    if parts:
        story.append(Paragraph("  ·  ".join(parts), s["contact"]))
    story.append(Spacer(1, 3 * mm))
    story.append(HRFlowable(width="100%", thickness=2.5, color=TEAL, spaceAfter=3))

    def section(title):
        return [
            Paragraph(title.upper(), s["section"]),
            HRFlowable(width="100%", thickness=0.75, color=MOD_RULE, spaceAfter=4),
        ]

    if data["summary"]:
        story += section("Profile Summary")
        story.append(Paragraph(data["summary"], s["summary"]))

    if data["experience"]:
        story += section("Experience")
        for i, job in enumerate(data["experience"]):
            story += _job_block(job, s, usable_w)
            if i < len(data["experience"]) - 1:
                story.append(Spacer(1, 3 * mm))

    if data["projects"]:
        story += section("Projects")
        for i, proj in enumerate(data["projects"]):
            story += _project_block(proj, s, TEAL.hexval())
            if i < len(data["projects"]) - 1:
                story.append(Spacer(1, 2.5 * mm))

    if data["education"]:
        story += section("Education")
        for i, edu in enumerate(data["education"]):
            story += _edu_block(edu, s, usable_w)
            if i < len(data["education"]) - 1:
                story.append(Spacer(1, 2 * mm))

    if data["skills"]:
        story += section("Skills")
        story += _skills_row_pills(data["skills"], usable_w, TEAL, "#ffffff", per_row=6)

    doc.build(story, onFirstPage=footer_fn(TEAL.hexval()), onLaterPages=footer_fn(TEAL.hexval()))
    buf.seek(0)
    return buf.read()


# ══════════════════════════════════════════════════════════════════════════════
# MAIN ENTRY POINT
# ══════════════════════════════════════════════════════════════════════════════
def generate_pdf(raw_data: dict, template: str = "modern") -> bytes:
    """
    Validates data then routes to the correct template builder.
    template: "classic" | "executive" | "modern"
    """
    data = parse_resume_data(raw_data)
    builders = {
        "classic":   build_classic_pdf,
        "executive": build_executive_pdf,
        "modern":    build_modern_pdf,
    }
    return builders.get(template, build_modern_pdf)(data)
