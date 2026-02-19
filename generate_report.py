#!/usr/bin/env python3
"""
Generate "Massachusetts ADU Compliance Snapshot — Q1 2026" PDF report.

Parses compliance-data.ts and generates a professional policy-research-style
PDF using reportlab.
"""

import re
import json
import os
from collections import Counter, defaultdict
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics.charts.barcharts import VerticalBarChart

# ── Colors matching the confidence tiers ─────────────────────────────────
NAVY = colors.HexColor('#1a2332')
DARK_NAVY = colors.HexColor('#0f1722')
RED = colors.HexColor('#f87171')       # AG Disapproved
ORANGE = colors.HexColor('#fb923c')    # Appears Inconsistent
AMBER = colors.HexColor('#fbbf24')     # Needs Review
GREEN = colors.HexColor('#34d399')     # Consistent
LIGHT_GRAY = colors.HexColor('#f3f4f6')
MID_GRAY = colors.HexColor('#9ca3af')
DARK_GRAY = colors.HexColor('#4b5563')
WHITE = colors.white
BLUE_ACCENT = colors.HexColor('#3b82f6')


# ── Parse compliance-data.ts ─────────────────────────────────────────────

def parse_compliance_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    towns = []

    # Find all town blocks: { slug: '...', ... }
    # We look for each town entry by finding slug patterns
    slug_pattern = re.compile(r"slug:\s*'([^']+)'")
    name_pattern = re.compile(r"name:\s*'([^']+)'")
    county_pattern = re.compile(r"county:\s*'([^']+)'")
    population_pattern = re.compile(r"population:\s*(\d+)")
    municipality_pattern = re.compile(r"municipalityType:\s*'([^']+)'")
    last_reviewed_pattern = re.compile(r"lastReviewed:\s*'([^']+)'")
    bylaw_updated_pattern = re.compile(r"bylawLastUpdated:\s*'([^']+)'")
    bylaw_source_pattern = re.compile(r"bylawSource:\s*'([^']+)'")
    ag_disapprovals_pattern = re.compile(r"agDisapprovals:\s*(\d+)")
    ag_decision_date_pattern = re.compile(r"agDecisionDate:\s*'([^']+)'")
    bylaw_source_title_pattern = re.compile(r"bylawSourceTitle:\s*'([^']+)'")

    # Permit data
    permits_pattern = re.compile(
        r"permits:\s*\{\s*submitted:\s*(\d+),\s*approved:\s*(\d+),\s*denied:\s*(\d+),\s*pending:\s*(\d+),\s*approvalRate:\s*(\d+)"
    )

    # Bottom line - handle both regular quotes and smart quotes
    bottom_line_pattern = re.compile(r"bottomLine:\s*'((?:[^'\\]|\\.)*)'")

    # Provisions
    provision_block_pattern = re.compile(
        r"\{\s*id:\s*'([^']+)',\s*provision:\s*'([^']+)',\s*category:\s*'([^']+)',\s*status:\s*'([^']+)'",
        re.DOTALL
    )

    # AG decision text on provisions
    ag_decision_text_pattern = re.compile(r"agDecision:\s*'((?:[^'\\]|\\.)*)'")

    # Find the towns array and narrative cities array
    # Split into town blocks by looking for the comment pattern
    town_markers = list(re.finditer(r'//\s*──\s+([A-Z][A-Z\s]+)\s*──', content))

    # Find the start of the towns array
    towns_start = content.find("export const towns: TownComplianceProfile[] = [")
    narrative_start = content.find("export const narrativeCities: NarrativeCityProfile[] = [")

    if towns_start == -1:
        # Fallback: look for first slug
        towns_start = 0

    # Extract all town entries from the towns array
    # Each town starts with { slug: and ends with the next town or ]
    town_section = content[towns_start:narrative_start] if narrative_start > 0 else content[towns_start:]

    # Find all slug positions in the town section
    slug_matches = list(slug_pattern.finditer(town_section))

    for i, slug_match in enumerate(slug_matches):
        # Determine the block for this town
        start = slug_match.start()
        if i + 1 < len(slug_matches):
            end = slug_matches[i + 1].start()
        else:
            end = len(town_section)

        block = town_section[start:end]

        slug = slug_match.group(1)
        name_m = name_pattern.search(block)
        county_m = county_pattern.search(block)
        pop_m = population_pattern.search(block)
        mtype_m = municipality_pattern.search(block)
        reviewed_m = last_reviewed_pattern.search(block)
        bylaw_upd_m = bylaw_updated_pattern.search(block)
        bylaw_src_m = bylaw_source_pattern.search(block)
        ag_dis_m = ag_disapprovals_pattern.search(block)
        ag_date_m = ag_decision_date_pattern.search(block)
        permits_m = permits_pattern.search(block)
        bottom_m = bottom_line_pattern.search(block)
        bylaw_title_m = bylaw_source_title_pattern.search(block)

        # Extract provisions
        provisions = []
        for prov_m in provision_block_pattern.finditer(block):
            prov_id = prov_m.group(1)
            prov_name = prov_m.group(2)
            prov_cat = prov_m.group(3)
            prov_status = prov_m.group(4)

            # Check if this provision has an AG decision
            # Look in the block after this provision match for agDecision
            prov_start = prov_m.end()
            # Find the next provision or end of provisions array
            next_prov = provision_block_pattern.search(block[prov_start:])
            if next_prov:
                prov_block = block[prov_start:prov_start + next_prov.start()]
            else:
                prov_block = block[prov_start:prov_start + 500]

            ag_text_m = ag_decision_text_pattern.search(prov_block)
            has_ag = ag_text_m is not None

            provisions.append({
                'id': prov_id,
                'provision': prov_name,
                'category': prov_cat,
                'status': prov_status,
                'has_ag_decision': has_ag,
            })

        town = {
            'slug': slug,
            'name': name_m.group(1) if name_m else slug,
            'county': county_m.group(1) if county_m else '',
            'population': int(pop_m.group(1)) if pop_m else 0,
            'municipality_type': mtype_m.group(1) if mtype_m else 'town',
            'last_reviewed': reviewed_m.group(1) if reviewed_m else '',
            'bylaw_last_updated': bylaw_upd_m.group(1) if bylaw_upd_m else '',
            'bylaw_source': bylaw_src_m.group(1) if bylaw_src_m else '',
            'bylaw_source_title': bylaw_title_m.group(1) if bylaw_title_m else '',
            'ag_disapprovals': int(ag_dis_m.group(1)) if ag_dis_m else 0,
            'ag_decision_date': ag_date_m.group(1) if ag_date_m else None,
            'permits': {
                'submitted': int(permits_m.group(1)) if permits_m else 0,
                'approved': int(permits_m.group(2)) if permits_m else 0,
                'denied': int(permits_m.group(3)) if permits_m else 0,
                'pending': int(permits_m.group(4)) if permits_m else 0,
                'approval_rate': int(permits_m.group(5)) if permits_m else 0,
            },
            'bottom_line': bottom_m.group(1).replace('\\n', '\n') if bottom_m else '',
            'provisions': provisions,
        }

        towns.append(town)

    # Parse narrative cities
    narrative_cities = []
    if narrative_start > 0:
        narr_section = content[narrative_start:]
        narr_slugs = list(slug_pattern.finditer(narr_section))
        for i, ns in enumerate(narr_slugs):
            start = ns.start()
            end = narr_slugs[i+1].start() if i+1 < len(narr_slugs) else len(narr_section)
            block = narr_section[start:end]

            slug = ns.group(1)
            name_m = name_pattern.search(block)
            permits_m = permits_pattern.search(block)
            summary_m = re.search(r"summary:\s*'((?:[^'\\]|\\.)*)'", block)
            tag_m = re.search(r"tag:\s*'([^']+)'", block)

            narrative_cities.append({
                'slug': slug,
                'name': name_m.group(1) if name_m else slug,
                'permits': {
                    'submitted': int(permits_m.group(1)) if permits_m else 0,
                    'approved': int(permits_m.group(2)) if permits_m else 0,
                    'approval_rate': int(permits_m.group(5)) if permits_m else 0,
                },
                'summary': summary_m.group(1) if summary_m else '',
                'tag': tag_m.group(1) if tag_m else '',
            })

    # Parse SOURCES object for appendix
    sources = {}
    sources_section = re.search(r'const SOURCES = \{(.*?)\} as const;', content, re.DOTALL)
    if sources_section:
        src_text = sources_section.group(1)
        for m in re.finditer(r"/\*\*\s*(.*?)\s*\*/\s*(\w+):\s*'([^']+)'", src_text):
            sources[m.group(2)] = {'label': m.group(1), 'url': m.group(3)}

    return towns, narrative_cities, sources


# ── Parse data ───────────────────────────────────────────────────────────

DATA_FILE = os.path.join(os.path.dirname(__file__), 'src', 'app', 'compliance', 'compliance-data.ts')
towns, narrative_cities, sources = parse_compliance_data(DATA_FILE)

# Filter to only allEntries towns (not narrative cities)
# The narrative cities are separately parsed

# ── Compute statistics ───────────────────────────────────────────────────

total_provisions = sum(len(t['provisions']) for t in towns)
total_inconsistent = sum(1 for t in towns for p in t['provisions'] if p['status'] == 'inconsistent')
total_review = sum(1 for t in towns for p in t['provisions'] if p['status'] == 'review')
total_consistent = sum(1 for t in towns for p in t['provisions'] if p['status'] == 'compliant')
total_ag_disapproved = sum(1 for t in towns for p in t['provisions'] if p['has_ag_decision'])
total_statutory_conflict = total_inconsistent - total_ag_disapproved

towns_with_ag = [t for t in towns if t['ag_disapprovals'] > 0]
towns_with_inconsistencies = [t for t in towns if any(p['status'] == 'inconsistent' for p in t['provisions'])]

# Provision type frequency
provision_type_counter = Counter()
for t in towns:
    for p in t['provisions']:
        if p['status'] == 'inconsistent':
            provision_type_counter[p['provision']] += 1

# Category frequency
category_counter = Counter()
for t in towns:
    for p in t['provisions']:
        if p['status'] == 'inconsistent':
            category_counter[p['category']] += 1


# ── PDF Generation ───────────────────────────────────────────────────────

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), 'adu-compliance-snapshot-q1-2026.pdf')

def format_date(iso_date):
    """Convert ISO date to readable format."""
    if not iso_date:
        return 'N/A'
    try:
        from datetime import datetime
        dt = datetime.strptime(iso_date, '%Y-%m-%d')
        return dt.strftime('%B %d, %Y').replace(' 0', ' ')
    except:
        return iso_date

def format_date_short(iso_date):
    """Convert ISO date to short format."""
    if not iso_date:
        return 'N/A'
    try:
        from datetime import datetime
        dt = datetime.strptime(iso_date, '%Y-%m-%d')
        return dt.strftime('%b %Y')
    except:
        return iso_date


# ── Styles ───────────────────────────────────────────────────────────────

styles = getSampleStyleSheet()

# Cover styles
cover_title_style = ParagraphStyle(
    'CoverTitle', parent=styles['Title'],
    fontSize=28, leading=34, textColor=NAVY,
    spaceAfter=12, alignment=TA_CENTER,
    fontName='Helvetica-Bold',
)
cover_subtitle_style = ParagraphStyle(
    'CoverSubtitle', parent=styles['Normal'],
    fontSize=13, leading=18, textColor=DARK_GRAY,
    spaceAfter=8, alignment=TA_CENTER,
    fontName='Helvetica',
)
cover_meta_style = ParagraphStyle(
    'CoverMeta', parent=styles['Normal'],
    fontSize=11, leading=16, textColor=MID_GRAY,
    alignment=TA_CENTER, fontName='Helvetica',
)

# Section headers
h1_style = ParagraphStyle(
    'H1', parent=styles['Heading1'],
    fontSize=20, leading=26, textColor=NAVY,
    spaceBefore=0, spaceAfter=12,
    fontName='Helvetica-Bold',
)
h2_style = ParagraphStyle(
    'H2', parent=styles['Heading2'],
    fontSize=14, leading=18, textColor=NAVY,
    spaceBefore=16, spaceAfter=8,
    fontName='Helvetica-Bold',
)
h3_style = ParagraphStyle(
    'H3', parent=styles['Heading3'],
    fontSize=11, leading=14, textColor=DARK_GRAY,
    spaceBefore=10, spaceAfter=4,
    fontName='Helvetica-Bold',
)

# Body text
body_style = ParagraphStyle(
    'BodyText', parent=styles['Normal'],
    fontSize=10, leading=14, textColor=DARK_GRAY,
    spaceAfter=8, alignment=TA_JUSTIFY,
    fontName='Helvetica',
)
body_small_style = ParagraphStyle(
    'BodySmall', parent=styles['Normal'],
    fontSize=8.5, leading=12, textColor=DARK_GRAY,
    spaceAfter=4, fontName='Helvetica',
)
body_italic_style = ParagraphStyle(
    'BodyItalic', parent=body_style,
    fontName='Helvetica-Oblique', textColor=MID_GRAY,
)
bullet_style = ParagraphStyle(
    'Bullet', parent=body_style,
    leftIndent=20, bulletIndent=8,
    spaceBefore=2, spaceAfter=2,
)

# Table header style
table_header_style = ParagraphStyle(
    'TableHeader', parent=styles['Normal'],
    fontSize=8, leading=10, textColor=WHITE,
    fontName='Helvetica-Bold',
)
table_cell_style = ParagraphStyle(
    'TableCell', parent=styles['Normal'],
    fontSize=8, leading=10, textColor=DARK_GRAY,
    fontName='Helvetica',
)
table_cell_bold = ParagraphStyle(
    'TableCellBold', parent=table_cell_style,
    fontName='Helvetica-Bold',
)

# Town profile styles
town_name_style = ParagraphStyle(
    'TownName', parent=styles['Heading2'],
    fontSize=16, leading=20, textColor=NAVY,
    spaceBefore=0, spaceAfter=4,
    fontName='Helvetica-Bold',
)
town_meta_style = ParagraphStyle(
    'TownMeta', parent=styles['Normal'],
    fontSize=9, leading=12, textColor=MID_GRAY,
    spaceAfter=8, fontName='Helvetica',
)
town_bottom_line_style = ParagraphStyle(
    'TownBottomLine', parent=body_style,
    fontSize=9.5, leading=13, textColor=DARK_GRAY,
    leftIndent=10, rightIndent=10,
    spaceBefore=8, spaceAfter=8,
    backColor=colors.HexColor('#f8f9fa'),
    borderPadding=8,
)

# Footer style
footer_style = ParagraphStyle(
    'Footer', parent=styles['Normal'],
    fontSize=7.5, textColor=MID_GRAY,
    fontName='Helvetica',
)


# ── Page template with footer ────────────────────────────────────────────

def add_page_footer(canvas, doc):
    """Add footer to every page."""
    canvas.saveState()
    page_num = doc.page
    # Footer line
    canvas.setStrokeColor(colors.HexColor('#e5e7eb'))
    canvas.setLineWidth(0.5)
    canvas.line(72, 45, letter[0] - 72, 45)
    # Left: ADU Pulse
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(MID_GRAY)
    canvas.drawString(72, 32, "ADU Pulse — adupulse.com")
    # Right: page number
    canvas.drawRightString(letter[0] - 72, 32, f"Page {page_num}")
    canvas.restoreState()

def add_cover_footer(canvas, doc):
    """No page number on cover."""
    pass


# ── Build document ───────────────────────────────────────────────────────

doc = SimpleDocTemplate(
    OUTPUT_FILE,
    pagesize=letter,
    topMargin=0.75*inch,
    bottomMargin=0.75*inch,
    leftMargin=1*inch,
    rightMargin=1*inch,
)

story = []


# ═══════════════════════════════════════════════════════════════════════════
# COVER PAGE
# ═══════════════════════════════════════════════════════════════════════════

story.append(Spacer(1, 2*inch))

# Decorative line
story.append(HRFlowable(
    width="60%", thickness=2, color=NAVY,
    spaceAfter=20, spaceBefore=0,
))

story.append(Paragraph(
    "Massachusetts ADU<br/>Compliance Snapshot",
    cover_title_style,
))
story.append(Paragraph("Q1 2026", ParagraphStyle(
    'Q1', parent=cover_title_style, fontSize=22, textColor=BLUE_ACCENT,
    spaceBefore=4, spaceAfter=16,
)))

story.append(HRFlowable(
    width="40%", thickness=1, color=MID_GRAY,
    spaceAfter=20, spaceBefore=0,
))

story.append(Paragraph(
    "A structured analysis of local ADU bylaw consistency<br/>"
    "with MGL c.40A §3 and 760 CMR 71.00",
    cover_subtitle_style,
))
story.append(Spacer(1, 30))
story.append(Paragraph(
    "Prepared by ADU Pulse — adupulse.com",
    cover_meta_style,
))
story.append(Spacer(1, 8))
story.append(Paragraph("February 2026", cover_meta_style))

story.append(Spacer(1, 1.5*inch))

# Disclaimer at bottom of cover
story.append(Paragraph(
    "<i>This report provides structured statutory comparison and public-record analysis. "
    "It does not render legal opinions or determine enforceability in specific cases.</i>",
    ParagraphStyle('CoverDisclaimer', parent=body_italic_style,
                   fontSize=8, alignment=TA_CENTER, textColor=MID_GRAY),
))

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# EXECUTIVE SUMMARY
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Executive Summary", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceAfter=16))

exec_paras = [
    "Massachusetts legalized accessory dwelling units (ADUs) statewide effective February 2, 2025, "
    "through Chapter 150 of the Acts of 2024. The law amended MGL c.40A §3 to establish the right "
    "to build a first ADU by right on any single-family lot, with implementing regulations at 760 CMR 71.00.",

    "In the first full year of the law, 1,639 ADU applications were filed and 1,224 approved across "
    "293 Massachusetts municipalities responding to the EOHLC survey. ADUs now represent more than "
    "25% of new housing permitted statewide, making them a significant contributor to the state's "
    "housing production.",

    "However, many municipalities have adopted or retained local bylaws and ordinances that appear "
    "inconsistent with state law. This creates confusion for homeowners, uncertainty for builders, "
    "and potential legal exposure for municipalities.",

    f"This report analyzes <b>{len(towns)} municipalities</b> and identifies <b>{total_inconsistent} provisions</b> "
    f"across <b>{len(category_counter)} categories</b> that appear inconsistent with Chapter 150 and 760 CMR 71.00.",

    f"The Massachusetts Attorney General has formally disapproved provisions in "
    f"<b>{len(towns_with_ag)} towns</b> to date, striking down <b>{total_ag_disapproved} provisions</b> "
    f"as inconsistent with state law. An additional <b>{total_statutory_conflict} provisions</b> across "
    f"<b>{len(towns_with_inconsistencies) - len([t for t in towns_with_ag if any(p['has_ag_decision'] for p in t['provisions'])])} additional communities</b> "
    f"appear inconsistent based on ADU Pulse's statutory analysis but have not yet been the subject of AG action.",

    f"A further <b>{total_review} provisions</b> are classified as needing review — they fall in a "
    f"gray area where the municipality's authority is unclear and further legal evaluation is recommended.",
]

for para in exec_paras:
    story.append(Paragraph(para, body_style))

# Key stats box
story.append(Spacer(1, 12))
stats_data = [
    [Paragraph('<b>Metric</b>', table_header_style),
     Paragraph('<b>Value</b>', table_header_style)],
    [Paragraph('Communities analyzed', table_cell_style),
     Paragraph(f'{len(towns)}', table_cell_bold)],
    [Paragraph('Total provisions reviewed', table_cell_style),
     Paragraph(f'{total_provisions}', table_cell_bold)],
    [Paragraph('Provisions inconsistent with state law', table_cell_style),
     Paragraph(f'{total_inconsistent}', table_cell_bold)],
    [Paragraph('AG-disapproved provisions', table_cell_style),
     Paragraph(f'{total_ag_disapproved}', table_cell_bold)],
    [Paragraph('Provisions needing review', table_cell_style),
     Paragraph(f'{total_review}', table_cell_bold)],
    [Paragraph('Provisions consistent with state law', table_cell_style),
     Paragraph(f'{total_consistent}', table_cell_bold)],
    [Paragraph('Towns with AG disapprovals', table_cell_style),
     Paragraph(f'{len(towns_with_ag)}', table_cell_bold)],
]

stats_table = Table(stats_data, colWidths=[3.5*inch, 2*inch])
stats_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
]))
story.append(stats_table)

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# METHODOLOGY
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Methodology", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceAfter=16))

story.append(Paragraph(
    "Every analysis in this report follows a consistent process:",
    body_style,
))

method_steps = [
    "We read the full local ADU bylaw or ordinance as adopted by the municipality.",
    "We compare each provision against Massachusetts Chapter 150 (the Affordable Homes Act) "
    "and the implementing regulations at 760 CMR 71.00.",
    "For towns, we review all published Attorney General decisions on that town's bylaw, "
    "including partial disapprovals. City ordinances are not subject to AG review — those "
    "inconsistencies are identified through independent analysis.",
    "We classify each provision into one of four confidence tiers based on available evidence.",
]
for step in method_steps:
    story.append(Paragraph(f"• {step}", bullet_style))

story.append(Spacer(1, 12))
story.append(Paragraph(
    "<i>This platform provides structured statutory comparison and public-record analysis. "
    "It does not render legal opinions or determine enforceability in specific cases. "
    "Consult a zoning attorney for project-specific guidance.</i>",
    body_italic_style,
))

story.append(Spacer(1, 16))
story.append(Paragraph("Confidence Tiers", h2_style))

tier_data = [
    [Paragraph('<b>Tier</b>', table_header_style),
     Paragraph('<b>Definition</b>', table_header_style),
     Paragraph('<b>Count</b>', table_header_style)],
    [Paragraph('AG Disapproved', ParagraphStyle('', parent=table_cell_bold, textColor=colors.HexColor('#dc2626'))),
     Paragraph('The Attorney General has formally disapproved this provision as inconsistent with state law.', table_cell_style),
     Paragraph(str(total_ag_disapproved), table_cell_bold)],
    [Paragraph('Appears Inconsistent', ParagraphStyle('', parent=table_cell_bold, textColor=colors.HexColor('#ea580c'))),
     Paragraph('ADU Pulse analysis identifies this provision as appearing to conflict with G.L. c. 40A §3 or 760 CMR 71.00, but no AG decision exists.', table_cell_style),
     Paragraph(str(total_statutory_conflict), table_cell_bold)],
    [Paragraph('Needs Review', ParagraphStyle('', parent=table_cell_bold, textColor=colors.HexColor('#d97706'))),
     Paragraph('The provision is in a gray area and may face future challenges. Further legal evaluation recommended.', table_cell_style),
     Paragraph(str(total_review), table_cell_bold)],
    [Paragraph('Consistent', ParagraphStyle('', parent=table_cell_bold, textColor=colors.HexColor('#059669'))),
     Paragraph('The provision appears consistent with state law. No issues expected.', table_cell_style),
     Paragraph(str(total_consistent), table_cell_bold)],
]

tier_table = Table(tier_data, colWidths=[1.4*inch, 3.6*inch, 0.7*inch])
tier_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
]))
story.append(tier_table)

story.append(Spacer(1, 16))
story.append(Paragraph("Data Sources", h2_style))

data_sources = [
    "<b>EOHLC ADU Survey (February 2026)</b> — Statewide survey of all 351 municipalities, "
    "providing aggregate counts of ADU applications submitted, approved, and denied.",
    "<b>U.S. Census Bureau</b> — American Community Survey population estimates and "
    "Building Permit Survey data for housing production context.",
    "<b>Attorney General Municipal Law Unit</b> — Published AG decisions on town bylaw "
    "articles, including partial and full disapprovals.",
    "<b>Municipal Bylaws and Ordinances</b> — The full text of each municipality's ADU "
    "bylaw or ordinance as publicly available on municipal websites or ecode360.",
]
for src in data_sources:
    story.append(Paragraph(f"• {src}", bullet_style))

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# CONFIDENCE TIER SUMMARY
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Confidence Tier Summary", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceAfter=16))

story.append(Paragraph(
    f"Across {len(towns)} municipalities analyzed, ADU Pulse reviewed {total_provisions} "
    f"individual provisions. The distribution across confidence tiers is shown below.",
    body_style,
))

# Per-town tier breakdown table
tier_summary_header = [
    Paragraph('<b>Municipality</b>', table_header_style),
    Paragraph('<b>AG Disapproved</b>', table_header_style),
    Paragraph('<b>Appears Inconsistent</b>', table_header_style),
    Paragraph('<b>Needs Review</b>', table_header_style),
    Paragraph('<b>Consistent</b>', table_header_style),
    Paragraph('<b>Total</b>', table_header_style),
]

tier_summary_data = [tier_summary_header]
for t in sorted(towns, key=lambda x: x['name']):
    ag_count = sum(1 for p in t['provisions'] if p['has_ag_decision'])
    incon_no_ag = sum(1 for p in t['provisions'] if p['status'] == 'inconsistent' and not p['has_ag_decision'])
    review_count = sum(1 for p in t['provisions'] if p['status'] == 'review')
    consistent_count = sum(1 for p in t['provisions'] if p['status'] == 'compliant')
    total = len(t['provisions'])

    tier_summary_data.append([
        Paragraph(t['name'], table_cell_bold),
        Paragraph(str(ag_count) if ag_count > 0 else '—', table_cell_style),
        Paragraph(str(incon_no_ag) if incon_no_ag > 0 else '—', table_cell_style),
        Paragraph(str(review_count) if review_count > 0 else '—', table_cell_style),
        Paragraph(str(consistent_count), table_cell_style),
        Paragraph(str(total), table_cell_bold),
    ])

# Totals row
tier_summary_data.append([
    Paragraph('<b>TOTAL</b>', table_cell_bold),
    Paragraph(f'<b>{total_ag_disapproved}</b>', table_cell_bold),
    Paragraph(f'<b>{total_statutory_conflict}</b>', table_cell_bold),
    Paragraph(f'<b>{total_review}</b>', table_cell_bold),
    Paragraph(f'<b>{total_consistent}</b>', table_cell_bold),
    Paragraph(f'<b>{total_provisions}</b>', table_cell_bold),
])

col_widths = [1.5*inch, 0.9*inch, 1.1*inch, 0.8*inch, 0.7*inch, 0.6*inch]
tier_summary_table = Table(tier_summary_data, colWidths=col_widths, repeatRows=1)
tier_summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -2), [WHITE, LIGHT_GRAY]),
    ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#e5e7eb')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
]))
story.append(tier_summary_table)

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# AG ACTION TIMELINE
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Attorney General Action Timeline", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceAfter=16))

story.append(Paragraph(
    f"The Massachusetts Attorney General has disapproved ADU bylaw provisions in "
    f"{len(towns_with_ag)} towns as of February 2026. The following table shows all "
    f"AG actions in chronological order.",
    body_style,
))

ag_header = [
    Paragraph('<b>Town</b>', table_header_style),
    Paragraph('<b>AG Decision Date</b>', table_header_style),
    Paragraph('<b>Provisions Disapproved</b>', table_header_style),
    Paragraph('<b>Key Issues</b>', table_header_style),
]

ag_data = [ag_header]
for t in sorted(towns_with_ag, key=lambda x: x.get('ag_decision_date') or ''):
    ag_provs = [p for p in t['provisions'] if p['has_ag_decision']]
    key_issues = ', '.join(p['provision'] for p in ag_provs[:3])
    if len(ag_provs) > 3:
        key_issues += f' (+{len(ag_provs) - 3} more)'

    ag_data.append([
        Paragraph(t['name'], table_cell_bold),
        Paragraph(format_date_short(t.get('ag_decision_date', '')), table_cell_style),
        Paragraph(str(len(ag_provs)), table_cell_style),
        Paragraph(key_issues, table_cell_style),
    ])

ag_table = Table(ag_data, colWidths=[1.2*inch, 1.1*inch, 1.0*inch, 2.4*inch])
ag_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('ALIGN', (2, 0), (2, -1), 'CENTER'),
]))
story.append(ag_table)

story.append(Spacer(1, 16))
story.append(Paragraph(
    "Note: AG review applies only to town bylaws. City ordinances (Boston, New Bedford, Newton, "
    "Somerville, Worcester, Quincy, Salem, Revere) are not subject to AG review; inconsistencies "
    "in city ordinances are identified through ADU Pulse's independent analysis.",
    body_italic_style,
))

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# MOST COMMON INCONSISTENCY TYPES
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Most Common Inconsistency Types", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceAfter=16))

story.append(Paragraph(
    "The following table shows the most frequently identified inconsistencies across all "
    f"{len(towns)} municipalities analyzed, ranked by the number of towns affected.",
    body_style,
))

# By provision type
story.append(Paragraph("By Provision Type", h2_style))

type_header = [
    Paragraph('<b>Provision Type</b>', table_header_style),
    Paragraph('<b>Towns Affected</b>', table_header_style),
]
type_data = [type_header]
for prov_name, count in provision_type_counter.most_common(15):
    type_data.append([
        Paragraph(prov_name, table_cell_style),
        Paragraph(str(count), table_cell_bold),
    ])

type_table = Table(type_data, colWidths=[4.2*inch, 1.2*inch])
type_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
]))
story.append(type_table)

# By category
story.append(Spacer(1, 16))
story.append(Paragraph("By Category", h2_style))

cat_header = [
    Paragraph('<b>Category</b>', table_header_style),
    Paragraph('<b>Inconsistent Provisions</b>', table_header_style),
]
cat_data = [cat_header]
for cat_name, count in category_counter.most_common():
    cat_data.append([
        Paragraph(cat_name, table_cell_style),
        Paragraph(str(count), table_cell_bold),
    ])

cat_table = Table(cat_data, colWidths=[3.5*inch, 1.8*inch])
cat_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
]))
story.append(cat_table)

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# TOWN-BY-TOWN PROFILES
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Town-by-Town Profiles", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceAfter=16))

story.append(Paragraph(
    f"The following pages provide individual profiles for each of the {len(towns)} "
    f"municipalities analyzed. Each profile includes the municipality's provision-level "
    f"analysis, permit data, and key findings.",
    body_style,
))

story.append(PageBreak())

for t in sorted(towns, key=lambda x: x['name']):
    # Town header
    story.append(Paragraph(t['name'], town_name_style))

    # Meta line
    meta_parts = [
        f"{t['county']} County",
        f"Pop. {t['population']:,}",
        f"{'City' if t['municipality_type'] == 'city' else 'Town'}",
    ]
    if t['last_reviewed']:
        meta_parts.append(f"Last reviewed: {format_date(t['last_reviewed'])}")
    story.append(Paragraph(' · '.join(meta_parts), town_meta_style))

    # Bylaw source
    story.append(Paragraph(
        f"<b>Bylaw source:</b> {t['bylaw_source']} · Last updated: {t['bylaw_last_updated']}",
        ParagraphStyle('', parent=body_small_style, spaceAfter=4),
    ))

    # AG action
    if t['ag_decision_date']:
        story.append(Paragraph(
            f"<b>AG action:</b> {format_date(t['ag_decision_date'])} — "
            f"{t['ag_disapprovals']} provision{'s' if t['ag_disapprovals'] != 1 else ''} disapproved",
            ParagraphStyle('', parent=body_small_style, textColor=colors.HexColor('#dc2626'), spaceAfter=4),
        ))
    elif t['ag_disapprovals'] > 0:
        story.append(Paragraph(
            f"<b>AG action:</b> {t['ag_disapprovals']} provision{'s' if t['ag_disapprovals'] != 1 else ''} disapproved",
            ParagraphStyle('', parent=body_small_style, textColor=colors.HexColor('#dc2626'), spaceAfter=4),
        ))

    # Permit bar
    perm = t['permits']
    story.append(Paragraph(
        f"<b>Permits:</b> {perm['submitted']} submitted, {perm['approved']} approved, "
        f"{perm['denied']} denied ({perm['approval_rate']}% approval rate)",
        ParagraphStyle('', parent=body_small_style, spaceAfter=8),
    ))

    # Bottom line
    if t['bottom_line']:
        # Clean up unicode for PDF
        bl = t['bottom_line']
        bl = bl.replace('\u2019', '\u2019').replace('\u201c', '\u201c').replace('\u201d', '\u201d')
        bl = bl.replace('\u2014', ' — ').replace('\u00a7', '§')
        story.append(Paragraph(
            f"<i>{bl}</i>",
            town_bottom_line_style,
        ))

    # Provisions table
    prov_header = [
        Paragraph('<b>Provision</b>', table_header_style),
        Paragraph('<b>Category</b>', table_header_style),
        Paragraph('<b>Tier</b>', table_header_style),
    ]
    prov_data = [prov_header]

    for p in t['provisions']:
        if p['has_ag_decision']:
            tier_label = 'AG Disapproved'
            tier_color = colors.HexColor('#dc2626')
        elif p['status'] == 'inconsistent':
            tier_label = 'Appears Inconsistent'
            tier_color = colors.HexColor('#ea580c')
        elif p['status'] == 'review':
            tier_label = 'Needs Review'
            tier_color = colors.HexColor('#d97706')
        else:
            tier_label = 'Consistent'
            tier_color = colors.HexColor('#059669')

        prov_data.append([
            Paragraph(p['provision'], table_cell_style),
            Paragraph(p['category'], table_cell_style),
            Paragraph(tier_label, ParagraphStyle('', parent=table_cell_bold, textColor=tier_color)),
        ])

    prov_table = Table(prov_data, colWidths=[2.4*inch, 1.5*inch, 1.5*inch])
    prov_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(prov_table)

    story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# PERMIT DATA CORRELATION
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Permit Data Correlation", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceAfter=16))

story.append(Paragraph(
    "The following table shows permit application and approval data alongside compliance "
    "status for all profiled municipalities. This allows comparison of regulatory posture "
    "with actual permitting outcomes.",
    body_style,
))

permit_header = [
    Paragraph('<b>Municipality</b>', table_header_style),
    Paragraph('<b>Applications</b>', table_header_style),
    Paragraph('<b>Approved</b>', table_header_style),
    Paragraph('<b>Rate</b>', table_header_style),
    Paragraph('<b>Inconsistent</b>', table_header_style),
    Paragraph('<b>AG Actions</b>', table_header_style),
]

permit_data = [permit_header]
for t in sorted(towns, key=lambda x: -x['permits']['submitted']):
    incon = sum(1 for p in t['provisions'] if p['status'] == 'inconsistent')
    permit_data.append([
        Paragraph(t['name'], table_cell_style),
        Paragraph(str(t['permits']['submitted']), table_cell_style),
        Paragraph(str(t['permits']['approved']), table_cell_style),
        Paragraph(f"{t['permits']['approval_rate']}%", table_cell_style),
        Paragraph(str(incon), table_cell_bold),
        Paragraph(str(t['ag_disapprovals']) if t['ag_disapprovals'] > 0 else '—', table_cell_style),
    ])

permit_col_widths = [1.4*inch, 0.8*inch, 0.7*inch, 0.6*inch, 0.9*inch, 0.8*inch]
permit_table = Table(permit_data, colWidths=permit_col_widths, repeatRows=1)
permit_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
    ('ALIGN', (0, 0), (0, -1), 'LEFT'),
]))
story.append(permit_table)

# Special cases note
if narrative_cities:
    story.append(Spacer(1, 16))
    story.append(Paragraph("Special Cases (Narrative Profiles)", h2_style))
    story.append(Paragraph(
        "Three additional cities are tracked as narrative special cases — they do not have "
        "provision-by-provision analysis but exhibit notable ADU policy patterns.",
        body_style,
    ))

    narr_header = [
        Paragraph('<b>City</b>', table_header_style),
        Paragraph('<b>Status</b>', table_header_style),
        Paragraph('<b>Applications</b>', table_header_style),
        Paragraph('<b>Approved</b>', table_header_style),
        Paragraph('<b>Rate</b>', table_header_style),
    ]
    narr_data = [narr_header]
    tag_labels = {
        'passive-resistance': 'Passive Resistance',
        'no-ordinance': 'No Local Ordinance',
        'stalled': 'Stalled',
    }
    for nc in narrative_cities:
        narr_data.append([
            Paragraph(nc['name'], table_cell_bold),
            Paragraph(tag_labels.get(nc['tag'], nc['tag']), table_cell_style),
            Paragraph(str(nc['permits']['submitted']), table_cell_style),
            Paragraph(str(nc['permits']['approved']), table_cell_style),
            Paragraph(f"{nc['permits']['approval_rate']}%", table_cell_style),
        ])

    narr_table = Table(narr_data, colWidths=[1.2*inch, 1.3*inch, 0.9*inch, 0.8*inch, 0.6*inch])
    narr_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (2, 0), (-1, -1), 'CENTER'),
    ]))
    story.append(narr_table)

story.append(PageBreak())


# ═══════════════════════════════════════════════════════════════════════════
# APPENDIX
# ═══════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Appendix: Sources", h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceAfter=16))

# Group sources by type
ag_sources = {k: v for k, v in sources.items() if 'AG' in v['label'] or k.startswith('ag_')}
law_sources = {k: v for k, v in sources.items() if any(x in k for x in ['ch150', 'mgl', 'cmr', 'eohlc'])}
town_sources = {k: v for k, v in sources.items() if k not in ag_sources and k not in law_sources}

story.append(Paragraph("State Law and Regulatory Sources", h2_style))
for key, src in sorted(law_sources.items()):
    story.append(Paragraph(
        f"• <b>{src['label']}</b><br/>"
        f"<font size=7 color='#6b7280'>{src['url']}</font>",
        ParagraphStyle('', parent=bullet_style, fontSize=8.5, leading=11, spaceAfter=4),
    ))

story.append(Paragraph("Attorney General Decisions", h2_style))
for key, src in sorted(ag_sources.items()):
    story.append(Paragraph(
        f"• <b>{src['label']}</b><br/>"
        f"<font size=7 color='#6b7280'>{src['url']}</font>",
        ParagraphStyle('', parent=bullet_style, fontSize=8.5, leading=11, spaceAfter=4),
    ))

story.append(Paragraph("Municipal and News Sources", h2_style))
for key, src in sorted(town_sources.items()):
    story.append(Paragraph(
        f"• <b>{src['label']}</b><br/>"
        f"<font size=7 color='#6b7280'>{src['url']}</font>",
        ParagraphStyle('', parent=bullet_style, fontSize=8.5, leading=11, spaceAfter=4),
    ))

story.append(Spacer(1, 30))
story.append(HRFlowable(width="40%", thickness=1, color=MID_GRAY, spaceAfter=12))
story.append(Paragraph(
    "Compliance analysis and consistency assessments © 2025–2026 ADU Pulse",
    ParagraphStyle('', parent=body_style, alignment=TA_CENTER, fontSize=9, textColor=MID_GRAY),
))
story.append(Paragraph(
    "adupulse.com",
    ParagraphStyle('', parent=body_style, alignment=TA_CENTER, fontSize=9, textColor=BLUE_ACCENT),
))


# ── Build PDF ────────────────────────────────────────────────────────────

doc.build(story, onFirstPage=add_cover_footer, onLaterPages=add_page_footer)
print(f"Report generated: {OUTPUT_FILE}")
print(f"Towns parsed: {len(towns)}")
print(f"Total provisions: {total_provisions}")
print(f"Inconsistent: {total_inconsistent} (AG: {total_ag_disapproved}, Analysis: {total_statutory_conflict})")
print(f"Needs Review: {total_review}")
print(f"Consistent: {total_consistent}")
print(f"Narrative cities: {len(narrative_cities)}")
print(f"Sources: {len(sources)}")
