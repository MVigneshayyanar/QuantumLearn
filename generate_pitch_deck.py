import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Color Palette
    NAVY_DARK = RGBColor(15, 23, 42)      # #0F172A
    NAVY_MED = RGBColor(30, 41, 59)       # #1E293B
    BLUE_ACCENT = RGBColor(37, 99, 235)   # #2563EB
    BLUE_LIGHT = RGBColor(239, 246, 255)  # #EFF6FF
    AMBER_DARK = RGBColor(180, 83, 9)     # #B45309
    AMBER_LIGHT = RGBColor(254, 243, 199) # #FEF3C7
    GREEN_DARK = RGBColor(5, 150, 105)    # #059669
    GREEN_LIGHT = RGBColor(236, 253, 245) # #ECFDF5
    PURPLE_DARK = RGBColor(124, 58, 237)  # #7C3AED
    PURPLE_LIGHT = RGBColor(245, 243, 255)# #F5F3FF
    RED_DARK = RGBColor(220, 38, 38)      # #DC2626
    RED_LIGHT = RGBColor(254, 242, 242)   # #FEF2F2
    GRAY_TEXT = RGBColor(100, 116, 139)   # #64748B
    GRAY_BG = RGBColor(248, 250, 252)     # #F8FAFC
    GRAY_BORDER = RGBColor(226, 232, 240) # #E2E8F0
    WHITE = RGBColor(255, 255, 255)

    def add_header_footer(slide, title_text, category_text="QuanBit · AI-Based Quantum Platform"):
        # Top Header Bar
        header_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.05))
        header_shape.fill.solid()
        header_shape.fill.fore_color.rgb = WHITE
        header_shape.line.color.rgb = GRAY_BORDER
        header_shape.line.width = Pt(1)

        # Team Badge Left
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(0.2), Inches(1.8), Inches(0.65))
        badge.fill.solid()
        badge.fill.fore_color.rgb = BLUE_LIGHT
        badge.line.color.rgb = BLUE_ACCENT
        badge.line.width = Pt(1.5)
        tf = badge.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "OptiMind"
        p.font.name = "Arial"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = BLUE_ACCENT
        p.alignment = PP_ALIGN.CENTER

        # Title Center
        tb = slide.shapes.add_textbox(Inches(2.6), Inches(0.12), Inches(8.0), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = "Georgia"
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        p.alignment = PP_ALIGN.CENTER

        # Category Right
        tb_r = slide.shapes.add_textbox(Inches(10.6), Inches(0.18), Inches(2.3), Inches(0.7))
        tf_r = tb_r.text_frame
        tf_r.word_wrap = True
        p_r = tf_r.paragraphs[0]
        p_r.text = "Youth Entrepreneurs\nChallenge 2027"
        p_r.font.name = "Arial"
        p_r.font.size = Pt(10)
        p_r.font.bold = True
        p_r.font.color.rgb = AMBER_DARK
        p_r.alignment = PP_ALIGN.RIGHT

        # Footer Bar
        footer = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(6.9), Inches(13.333), Inches(0.6))
        footer.fill.solid()
        footer.fill.fore_color.rgb = NAVY_DARK
        footer.line.fill.background()

        tb_f = slide.shapes.add_textbox(Inches(0.6), Inches(6.95), Inches(12.133), Inches(0.45))
        tf_f = tb_f.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = "YOUTUBE: https://youtu.be/7j56qHWI42Q   |   LIVE PLATFORM: https://www.quanbit.tech/   |   STARTUP: REVERSUN"
        p_f.font.name = "Consolas"
        p_f.font.size = Pt(10)
        p_f.font.color.rgb = RGBColor(203, 213, 225)
        p_f.alignment = PP_ALIGN.CENTER

    def add_card(slide, left, top, width, height, title, bg_color=WHITE, border_color=GRAY_BORDER, title_color=NAVY_DARK):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        # Header ribbon
        ribbon = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, Inches(0.55))
        ribbon.fill.solid()
        ribbon.fill.fore_color.rgb = border_color
        ribbon.line.fill.background()
        tf = ribbon.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

        # Text container inside card
        tb = slide.shapes.add_textbox(left + Inches(0.15), top + Inches(0.6), width - Inches(0.3), height - Inches(0.7))
        tf_body = tb.text_frame
        tf_body.word_wrap = True
        return tf_body

    # =========================================================================
    # SLIDE 1: COVER SLIDE
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_slide_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = NAVY_DARK
    bg1.line.fill.background()

    # Decorative top bar
    bar1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.2))
    bar1.fill.solid()
    bar1.fill.fore_color.rgb = AMBER_DARK
    bar1.line.fill.background()

    # Event Banner
    tb = slide1.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.333), Inches(0.8))
    p = tb.text_frame.paragraphs[0]
    p.text = "Youth Entrepreneurs Challenge 2027"
    p.font.name = "Georgia"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = RGBColor(241, 245, 249)
    p.alignment = PP_ALIGN.CENTER

    tb_sub = slide1.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(11.333), Inches(0.5))
    p_sub = tb_sub.text_frame.paragraphs[0]
    p_sub.text = "National Innovation & Educational Technology Showcase"
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(16)
    p_sub.font.color.rgb = RGBColor(148, 163, 184)
    p_sub.alignment = PP_ALIGN.CENTER

    # Main Card Box
    card1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.8), Inches(2.4), Inches(9.733), Inches(3.8))
    card1.fill.solid()
    card1.fill.fore_color.rgb = NAVY_MED
    card1.line.color.rgb = BLUE_ACCENT
    card1.line.width = Pt(2)

    tb_meta = slide1.shapes.add_textbox(Inches(2.2), Inches(2.6), Inches(8.933), Inches(3.4))
    tf1 = tb_meta.text_frame
    tf1.word_wrap = True

    entries = [
        ("Team Name", ": OptiMind"),
        ("Idea Title", ": QuanBit — AI-Based Interactive Quantum Algorithm Learning Platform"),
        ("Theme", ": Education & Skill Development"),
        ("Startup Entity", ": REVERSUN"),
        ("Core Focus", ": WebGL 3D Bloch Mechanics, AST Transpilation, Socratic AI & Academy Analytics"),
        ("Live URL", ": https://www.quanbit.tech/")
    ]

    for i, (label, val) in enumerate(entries):
        p = tf1.add_paragraph() if i > 0 else tf1.paragraphs[0]
        p.space_before = Pt(8)
        run1 = p.add_run()
        run1.text = f"•  {label.ljust(18)} "
        run1.font.bold = True
        run1.font.size = Pt(17)
        run1.font.color.rgb = AMBER_DARK
        run2 = p.add_run()
        run2.text = val
        run2.font.bold = False
        run2.font.size = Pt(17)
        run2.font.color.rgb = WHITE

    # Footer
    tb_foot = slide1.shapes.add_textbox(Inches(1.0), Inches(6.6), Inches(11.333), Inches(0.6))
    p = tb_foot.text_frame.paragraphs[0]
    p.text = "Confidential Pitch Deck — Proprietary & Patent-Pending Pedagogical Architecture"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT & MARKET URGENCY (NEW ESSENTIAL SLIDE)
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide2, "PROBLEM STATEMENT & MARKET URGENCY")

    # 4 Metric Callout Boxes at Top
    metrics = [
        ("300,000", "Quantum Specialists Needed Worldwide by 2030 (McKinsey)", BLUE_ACCENT, BLUE_LIGHT),
        ("Only 1 in 3", "Qualified Candidates available per open Quantum job role", RED_DARK, RED_LIGHT),
        ("₹6,003 Cr", "Budget allocated by Indian Govt for National Quantum Mission (NQM)", AMBER_DARK, AMBER_LIGHT),
        ("2 Weeks", "Wasted in collegiate labs fixing Conda/Python dependency errors", PURPLE_DARK, PURPLE_LIGHT),
    ]
    for i, (num, label, bcolor, bgcolor) in enumerate(metrics):
        x = Inches(0.6 + i * 3.08)
        box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.2), Inches(2.9), Inches(1.5))
        box.fill.solid()
        box.fill.fore_color.rgb = bgcolor
        box.line.color.rgb = bcolor
        box.line.width = Pt(1.5)
        tf = box.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = num
        p1.font.name = "Georgia"
        p1.font.size = Pt(28)
        p1.font.bold = True
        p1.font.color.rgb = bcolor
        p1.alignment = PP_ALIGN.CENTER
        p2 = tf.add_paragraph()
        p2.text = label
        p2.font.name = "Arial"
        p2.font.size = Pt(10)
        p2.font.color.rgb = NAVY_MED
        p2.alignment = PP_ALIGN.CENTER

    # 4 Foundational Pedagogical Chasms
    chasms = [
        ("1. Mathematical Abstraction Barrier", 
         "Novice students encounter complex Hilbert spaces (C^(2^n)) and tensor products before developing spatial or geometric intuition on phase rotations and superposition.",
         RED_DARK),
        ("2. Disconnected Tooling (Code vs GUI)", 
         "Existing platforms force a choice: drag-and-drop circuit toys OR raw Python code editors. They are never kept in real-time bidirectional synchronization.",
         AMBER_DARK),
        ("3. Visualization Breakdown on Entanglement", 
         "Single-qubit Bloch spheres freeze or display misleading classical coordinates when bipartite entanglement forms (Bell states), cementing core misconceptions.",
         PURPLE_DARK),
        ("4. Zero Classroom Visibility & Syntax-Only Errors", 
         "Compilers only flag syntax typos, not conceptual quantum mistakes (wrong basis, misapplied phase kickback). Instructors have zero cohort-level visibility.",
         BLUE_ACCENT),
    ]

    for i, (title, desc, color) in enumerate(chasms):
        row = i // 2
        col = i % 2
        left = Inches(0.6 + col * 6.15)
        top = Inches(2.9 + row * 1.9)
        c = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(6.0), Inches(1.75))
        c.fill.solid()
        c.fill.fore_color.rgb = WHITE
        c.line.color.rgb = color
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = color
        p_body = tf.add_paragraph()
        p_body.space_before = Pt(4)
        p_body.text = desc
        p_body.font.name = "Arial"
        p_body.font.size = Pt(11)
        p_body.font.color.rgb = NAVY_MED

    # =========================================================================
    # SLIDE 3: PROPOSED SOLUTION & UNIQUE VALUE PROPOSITION
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide3, "PROPOSED SOLUTION & UNIQUE VALUE PROPOSITION")

    # Left Container: Proposed Solution
    tf_sol = add_card(slide3, Inches(0.6), Inches(1.2), Inches(5.8), Inches(5.5), "PROPOSED SOLUTION ARCHITECTURE", WHITE, BLUE_ACCENT)
    solutions = [
        ("Quantum Circuit Lab", "Synced drag-and-drop builder + Monaco Editor. Edit visually or textually; both stay synchronized."),
        ("3D Quantum Visualization", "6-Axis WebGL Three.js Bloch Sphere with continuous SLERP rotations & true bipartite entanglement purity contraction."),
        ("Schrödinger AI Tutor", "Socratic hints bounded by negative constraints; diagnoses conceptual errors using geometric discrepancy analysis."),
        ("Practice Arena", "40+ algorithmic challenges with live circuit oracle grading (Accepted / Wrong Answer)."),
        ("Instructor Academy Portal", "Real-time cohort performance and student misconception heatmaps powered by Prisma analytics."),
        ("Dual Learning Modes", "Progressive disclosure: Beginner Visual Mode vs Advanced Dirac Notation Mode.")
    ]
    for i, (h, b) in enumerate(solutions):
        p = tf_sol.paragraphs[0] if i == 0 else tf_sol.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = f"• {h}: "
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = BLUE_ACCENT
        r2 = p.add_run()
        r2.text = b
        r2.font.size = Pt(10)
        r2.font.color.rgb = NAVY_MED

    # Right Container: UVP Table
    # Table shape
    rows, cols = 5, 3
    left_t, top_t, width_t, height_t = Inches(6.7), Inches(1.2), Inches(6.0), Inches(5.5)
    tbl_shape = slide3.shapes.add_table(rows, cols, left_t, top_t, width_t, height_t)
    table = tbl_shape.table
    table.columns[0].width = Inches(1.7)
    table.columns[1].width = Inches(2.0)
    table.columns[2].width = Inches(2.3)

    headers = ["Features", "Existing Tools (IBM/Quirk)", "QuanBit (Ours)"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = BLUE_ACCENT if j == 2 else NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

    data = [
        ("Circuit Input", "Visual ONLY or Code ONLY. Never kept in sync.", "Bidirectional Visual Builder + Monaco Code Editor in real-time sync."),
        ("Entanglement", "Bloch spheres freeze, crash, or show misleading coordinates.", "Purity Gauge (Tr(p^2)) visually contracts mixed statevectors into sphere."),
        ("Mistake Feedback", "Syntax and dimension runtime errors only.", "Schrödinger AI Socratic Guidance (basis, kickback, gate errors)."),
        ("Classroom Visibility", "None. Designed strictly for isolated individual sandbox.", "Live Cohort Misconception Heatmaps & automated homework grading.")
    ]

    for i, row in enumerate(data):
        for j, val in enumerate(row):
            cell = table.cell(i + 1, j)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = BLUE_LIGHT if j == 2 else (WHITE if i % 2 == 0 else GRAY_BG)
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(10)
            p.font.color.rgb = BLUE_ACCENT if j == 2 else NAVY_MED
            if j == 2:
                p.font.bold = True

    # =========================================================================
    # SLIDE 4: TECHNICAL APPROACH & SYSTEM ARCHITECTURE
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide4, "TECHNICAL APPROACH & SYSTEM ARCHITECTURE")

    # Column 1: Tech Stack
    tf_tech = add_card(slide4, Inches(0.6), Inches(1.2), Inches(3.6), Inches(5.5), "1. TECHNOLOGIES USED", WHITE, BLUE_ACCENT)
    techs = [
        ("Frontend", "Next.js 14.2.35 (React 18)\nTailwind CSS · Lucide Icons"),
        ("3D Engine", "Three.js WebGL (6-Axis SLERP geodesic rotation engine)"),
        ("Simulators", "Primary: Python FastAPI + Qiskit Aer\nFallback: 15ms TypeScript Engine"),
        ("AI Mentor", "Google Gemini Tier 1 API\nNegative-constrained Socratic Agent"),
        ("Database", "Neon Serverless PostgreSQL\nPrisma ORM (PgBouncer pooled)"),
        ("Transpiler", "Universal AST bidirectional bridge\n(Qiskit, Cirq, PennyLane, QASM)")
    ]
    for i, (k, v) in enumerate(techs):
        p = tf_tech.paragraphs[0] if i == 0 else tf_tech.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = f"• {k}: "
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = BLUE_ACCENT
        r2 = p.add_run()
        r2.text = v
        r2.font.size = Pt(10)
        r2.font.color.rgb = NAVY_MED

    # Column 2: Implementation Process
    tf_proc = add_card(slide4, Inches(4.4), Inches(1.2), Inches(3.9), Inches(5.5), "2. SYSTEM DATA FLOW", WHITE, AMBER_DARK)
    steps = [
        ("Student / Educator Canvas", "Interactive circuit wire updates trigger dual dispatch: AST compiler and WebGL visualizer."),
        ("Dual Simulation Dispatch", "API route queries Qiskit Aer (port 8000). On latency > 250ms, falls back to 15ms TypeScript engine."),
        ("Statevector & Purity Engine", "Extracts exact amplitudes, measurement probabilities, and trace purity gamma = Tr(rho^2)."),
        ("Schrödinger AI Socratic Core", "Computes geometric state discrepancy (dTheta, dPhi). Evaluates against 8 misconception tags."),
        ("Prisma PostgreSQL Ledger", "Records user progression, quiz attempts, practice submissions, and instructor cohort logs."),
        ("SHA-256 Verifier (/verify/[id])", "Emits cryptographically tamper-proof course completion certificates.")
    ]
    for i, (k, v) in enumerate(steps):
        p = tf_proc.paragraphs[0] if i == 0 else tf_proc.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = f"{i+1}. {k}: "
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = AMBER_DARK
        r2 = p.add_run()
        r2.text = v
        r2.font.size = Pt(10)
        r2.font.color.rgb = NAVY_MED

    # Column 3: Working Prototype Highlights
    tf_proto = add_card(slide4, Inches(8.5), Inches(1.2), Inches(4.2), Inches(5.5), "3. WORKING PROTOTYPE STATUS", WHITE, GREEN_DARK)
    proto_items = [
        ("Production Compilation", "22 static/dynamic routes passing with 0 TypeScript errors via Next.js 14."),
        ("Circuit Builder & Editor", "Drag-and-drop wire canvas synchronized bidirectionally with Monaco text editor."),
        ("3D Bloch Sphere Explorer", "Continuous geodesic statevector SLERP rotations with real-time radial entanglement shrinkage."),
        ("Algorithm Modules Live", "Full step-by-step interactive tracks for Deutsch-Jozsa, Bell States, Grover's Search, Teleportation."),
        ("Practice Arena Live", "40+ challenges with real-time circuit oracle evaluating submitted gates."),
        ("Instructor Dashboard (/instructor)", "Live heatmap tracking class difficulty across 8 misconception tags.")
    ]
    for i, (k, v) in enumerate(proto_items):
        p = tf_proto.paragraphs[0] if i == 0 else tf_proto.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = f"✓ {k}: "
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = GREEN_DARK
        r2 = p.add_run()
        r2.text = v
        r2.font.size = Pt(10)
        r2.font.color.rgb = NAVY_MED

    # =========================================================================
    # SLIDE 5: MARKET OPPORTUNITY (TAM / SAM / SOM) (NEW ESSENTIAL SLIDE)
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide5, "MARKET OPPORTUNITY & TIMING (TAM / SAM / SOM)")

    # Macro Driver Ribbon Top
    ribbon_driver = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.2), Inches(12.133), Inches(0.85))
    ribbon_driver.fill.solid()
    ribbon_driver.fill.fore_color.rgb = BLUE_LIGHT
    ribbon_driver.line.color.rgb = BLUE_ACCENT
    tf = ribbon_driver.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Macro Catalyst: India's National Quantum Mission (₹6,003 Crore) + Global Shortage of 300,000 Quantum Engineers"
    p.font.name = "Georgia"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = BLUE_ACCENT
    p.alignment = PP_ALIGN.CENTER
    p2 = tf.add_paragraph()
    p2.text = "Colleges are mandated to become quantum-ready, but lack dedicated quantum physical hardware or specialized lab faculty."
    p2.font.name = "Arial"
    p2.font.size = Pt(11)
    p2.font.color.rgb = NAVY_MED
    p2.alignment = PP_ALIGN.CENTER

    # 3 Market Size Cards
    tam_cards = [
        ("TAM (Total Addressable)", "$1.8 Billion / ₹15,000 Cr", 
         "Global Quantum Information Science and Technology (QIST) educational platforms, enterprise workforce upskilling, and multi-cloud simulator software market.",
         BLUE_ACCENT, BLUE_LIGHT),
        ("SAM (Serviceable Addressable)", "₹1,200 Crore / $145 Million", 
         "1,200+ accredited STEM, Physics & Computer Science university departments across India, Southeast Asia, and Tier-1 research labs mandating quantum coursework.",
         AMBER_DARK, AMBER_LIGHT),
        ("SOM (Serviceable Obtainable)", "₹15 Crore / $1.8 Million (Year 1-3)", 
         "150 Tier-1/2 Indian engineering collegiate cohorts + 15,000 self-directed student and developer subscribers adopting the platform.",
         GREEN_DARK, GREEN_LIGHT),
    ]

    for i, (title, num, desc, border_c, bg_c) in enumerate(tam_cards):
        left = Inches(0.6 + i * 4.15)
        top = Inches(2.25)
        card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.85), Inches(4.45))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_c
        card.line.color.rgb = border_c
        card.line.width = Pt(2)
        tf = card.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        p.alignment = PP_ALIGN.CENTER

        p_num = tf.add_paragraph()
        p_num.space_before = Pt(10)
        p_num.text = num
        p_num.font.name = "Georgia"
        p_num.font.size = Pt(22)
        p_num.font.bold = True
        p_num.font.color.rgb = border_c
        p_num.alignment = PP_ALIGN.CENTER

        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(14)
        p_desc.text = desc
        p_desc.font.name = "Arial"
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = NAVY_MED

        # Strategic take
        p_take = tf.add_paragraph()
        p_take.space_before = Pt(12)
        p_take.font.size = Pt(10)
        p_take.font.bold = True
        p_take.font.color.rgb = border_c
        if i == 0:
            p_take.text = "Driver: 300,000 global talent shortage."
        elif i == 1:
            p_take.text = "Driver: NQM curriculum mandate."
        else:
            p_take.text = "Driver: Direct college lab adoption."

    # =========================================================================
    # SLIDE 6: BUSINESS MODEL & UNIT ECONOMICS (NEW ESSENTIAL SLIDE)
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide6, "BUSINESS MODEL & UNIT ECONOMICS")

    # Left Container: 3 Tiers
    tf_tier = add_card(slide6, Inches(0.6), Inches(1.2), Inches(6.0), Inches(5.5), "3-TIER MONETIZATION ARCHITECTURE", WHITE, BLUE_ACCENT)
    tiers = [
        ("Community Tier (Free / Freemium)", "₹0 / Free Forever", 
         "• Up to 3 qubits client-side TypeScript simulation\n• Core 3D Bloch sphere & intro algorithm tracks\n• Viral organic acquisition channel for student developers"),
        ("Pro Individual Developer", "₹999 / $14 per Month  (₹8,999 / $119 per Year)", 
         "• Unlimited Schrödinger AI Socratic tutoring\n• 40+ Practice Arena challenges & automated grading\n• Multi-SDK transpilation (Qiskit, Cirq, PennyLane)\n• Cryptographically verifiable SHA-256 certificate ledger"),
        ("Academic Academy Cohort (B2B)", "₹99,000 / $1,200 per Course / Year", 
         "• Unlimited student seats (~₹24/student for a 50-student lab)\n• Live faculty misconception heatmap at /instructor\n• Turnkey 14-week Canvas / Blackboard LMS lab pack\n• Priority Qiskit cloud simulation backend execution")
    ]
    for i, (title, price, body) in enumerate(tiers):
        p = tf_tier.paragraphs[0] if i == 0 else tf_tier.add_paragraph()
        p.space_before = Pt(6)
        r = p.add_run()
        r.text = f"{title}\n"
        r.font.bold = True
        r.font.size = Pt(12)
        r.font.color.rgb = BLUE_ACCENT

        r_p = p.add_run()
        r_p.text = f"Price: {price}\n"
        r_p.font.bold = True
        r_p.font.size = Pt(11)
        r_p.font.color.rgb = AMBER_DARK

        r_b = p.add_run()
        r_b.text = body
        r_b.font.size = Pt(10)
        r_b.font.color.rgb = NAVY_MED

    # Right Container: Unit Economics Box
    tf_cfo = add_card(slide6, Inches(6.9), Inches(1.2), Inches(5.8), Inches(5.5), "UNIT ECONOMICS & FINANCIAL VIABILITY", WHITE, GREEN_DARK)
    cfo_stats = [
        ("87% Gross Margin", "Unit Price: ₹999 / mo. Variable costs = ₹130 (AI tokens ₹35, server compute ₹30, payment gateway ₹65). Leaves ₹869 contribution per user."),
        ("Break-Even: 12 Sales / Day", "Only 360 active paying subscribers required to cover the entire monthly fixed operating overhead (₹3.6 Lakhs / mo)."),
        ("₹34 Lakhs ($40.8K) Year 1 Net Profit", "Modeled on a conservative 12-month ramp starting at 5 sales/day, reaching ₹88 Lakhs revenue in Year 1."),
        ("Payback in Month 8", "Initial startup development expenditure of ₹7.3 Lakhs ($8,800) fully recouped by Month 8."),
        ("Peak Cash Runway Needed: ₹11 Lakhs", "Maximum cumulative operating deficit before reaching self-sustaining profitability is only ₹11 Lakhs ($13,187).")
    ]
    for i, (h, b) in enumerate(cfo_stats):
        p = tf_cfo.paragraphs[0] if i == 0 else tf_cfo.add_paragraph()
        p.space_before = Pt(5)
        r1 = p.add_run()
        r1.text = f"• {h}: "
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = GREEN_DARK
        r2 = p.add_run()
        r2.text = b
        r2.font.size = Pt(10)
        r2.font.color.rgb = NAVY_MED

    # =========================================================================
    # SLIDE 7: GO-TO-MARKET (GTM) & TRACTION (NEW ESSENTIAL SLIDE)
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide7, "GO-TO-MARKET (GTM) STRATEGY & TRACTION")

    # 3 Strategic Channels
    channels = [
        ("1. Top-Down Institutional Sales", 
         "Targeting University Physics & CS Faculty",
         "• Offer the Turnkey 14-Week Quantum Lab Courseware (Canvas .imscc export).\n• Guarantee 40% reduction in TA grading hours and zero environment setup tickets.\n• Direct demonstration of live cohort misconception heatmap at /instructor.\n• Low-friction 30-day full-cohort pilot.",
         BLUE_ACCENT, BLUE_LIGHT),
        ("2. Bottom-Up Campus Communities", 
         "Sponsoring Collegiate Hackathons",
         "• Partnering with IEEE Quantum Student Chapters and university coding clubs.\n• Campus Ambassador program across 25 Tier-1/2 engineering colleges.\n• Free community challenge hackathons hosted directly on QuanBit Practice Arena.\n• Viral certificate sharing on LinkedIn with SHA-256 verification.",
         AMBER_DARK, AMBER_LIGHT),
        ("3. Visual Developer Virality", 
         "Show HN & Hypnotic Micro-Demos",
         "• 15-second visual demonstrations of 3D Bloch sphere SLERP rotations vs Bell state contraction on TikTok, YouTube Shorts, and X.\n• Technical deep-dive Show HN and Reddit (r/QuantumComputing) launch.\n• Direct no-login sandbox experience eliminates trial friction.",
         PURPLE_DARK, PURPLE_LIGHT),
    ]

    for i, (title, sub, body, border_c, bg_c) in enumerate(channels):
        left = Inches(0.6 + i * 4.15)
        card = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.2), Inches(3.85), Inches(4.1))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_c
        card.line.color.rgb = border_c
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = border_c
        p.alignment = PP_ALIGN.CENTER

        p_sub = tf.add_paragraph()
        p_sub.text = sub
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = NAVY_MED
        p_sub.alignment = PP_ALIGN.CENTER

        p_b = tf.add_paragraph()
        p_b.space_before = Pt(8)
        p_b.text = body
        p_b.font.name = "Arial"
        p_b.font.size = Pt(10)
        p_b.font.color.rgb = NAVY_MED

    # Bottom Traction & Validation Bar
    bar_trac = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(5.5), Inches(12.133), Inches(1.2))
    bar_trac.fill.solid()
    bar_trac.fill.fore_color.rgb = WHITE
    bar_trac.line.color.rgb = GREEN_DARK
    bar_trac.line.width = Pt(2)
    tf_trac = bar_trac.text_frame
    tf_trac.word_wrap = True

    p = tf_trac.paragraphs[0]
    p.text = "TRACTION & MARKET VALIDATION MILESTONES"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GREEN_DARK

    p_body = tf_trac.add_paragraph()
    p_body.space_before = Pt(3)
    p_body.text = "• Working Prototype Live at quanbit.tech with 22 production routes and dual Qiskit engines.\n• Tested with 3 Postgraduate Scholars who built Bell-state and Grover circuits independently.\n• 100-Agent Consumer Panel validation yielded an 82% Buy Rate with CAC target < ₹1,500 vs LTV ₹6,500 (4.3:1 LTV:CAC Ratio)."
    p_body.font.name = "Arial"
    p_body.font.size = Pt(10)
    p_body.font.color.rgb = NAVY_MED

    # =========================================================================
    # SLIDE 8: FEASIBILITY, VIABILITY & RISK MITIGATION
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide8, "FEASIBILITY, VIABILITY & RISK MITIGATION")

    quads = [
        ("Future Viability & Scalability", 
         "• Quantum job market expanding to 300,000 specialists by 2030 (McKinsey).\n• Multi-backend strategy: Google Cirq, Xanadu PennyLane, QASM 2/3.\n• Multilingual platform localization across 5+ languages via next-intl.\n• Shared community circuits, peer challenge arena, and cloud simulator scaling.",
         AMBER_DARK, AMBER_LIGHT),
        ("Execution Strategies", 
         "• Dual simulation engine: High-fidelity Qiskit microservice + 15ms TypeScript engine.\n• Socratic AI tutor utilizing geometric error discrepancy angles (dTheta, dPhi).\n• 40+ challenge Practice Arena with automated test judge.\n• Proven pilot completed with 3 PG scholars constructing circuits without assistance.",
         BLUE_ACCENT, BLUE_LIGHT),
        ("Identified Challenges & Mitigations", 
         "• Simulation Concurrency: Enforce 15ms TypeScript engine on serverless edge; cap browser at 16 qubits.\n• Database Connection Limits: Implemented PgBouncer connection pooling (-pooler.neon.tech) raising ceiling to 10,000 sockets.\n• AI Rate Limits: Upgraded to Google Gemini Tier 1 Pay-As-You-Go (1,000 RPM capacity).\n• Security: Migrated to salted bcrypt and signed JWT cookies.",
         RED_DARK, RED_LIGHT),
        ("Feasibility & Operational Stack", 
         "• Live Production Architecture: Next.js 14, FastAPI Qiskit microservice, Neon PostgreSQL, Gemini API.\n• Pluggable and modular microservice architecture with open-source core.\n• Extremely low deployment footprint: Vercel Pro + Railway + Neon Serverless.\n• Highly sustainable unit economics with 87% gross margin.",
         GREEN_DARK, GREEN_LIGHT),
    ]

    for i, (title, body, border_c, bg_c) in enumerate(quads):
        row = i // 2
        col = i % 2
        left = Inches(0.6 + col * 6.15)
        top = Inches(1.2 + row * 2.8)
        card = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(6.0), Inches(2.65))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_c
        card.line.color.rgb = border_c
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = border_c

        p_b = tf.add_paragraph()
        p_b.space_before = Pt(6)
        p_b.text = body
        p_b.font.name = "Arial"
        p_b.font.size = Pt(10)
        p_b.font.color.rgb = NAVY_MED

    # =========================================================================
    # SLIDE 9: IMPACT AND MULTI-DIMENSIONAL BENEFITS
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide9, "IMPACT AND MULTI-DIMENSIONAL BENEFITS")

    impact_cards = [
        ("01", "STUDENTS", 
         "Rather than memorizing abstract mathematical slides, students learn by constructing circuits themselves in 3D. Active schema acquisition accelerates retention and removes math intimidation.",
         RED_DARK, RED_LIGHT),
        ("02", "INSTITUTIONS", 
         "Colleges gain a ready-made, turnkey 14-week lab curriculum. Professors monitor student misconception heatmaps in real time and eliminate 40 hours of manual homework grading.",
         GREEN_DARK, GREEN_LIGHT),
        ("03", "ECONOMIC IMPACT", 
         "Zero costly quantum hardware or expensive software licenses required. Runs in any browser on an ordinary budget laptop, lowering lab infrastructure costs to near zero.",
         AMBER_DARK, AMBER_LIGHT),
        ("04", "SOCIAL & TIER-2/3 EQUITY", 
         "Font scaling, keyboard accessibility, 5+ localized languages, and zero installation barriers ensure collegiate students in Tier-2 and Tier-3 institutions gain equal access to quantum education.",
         BLUE_ACCENT, BLUE_LIGHT),
    ]

    for i, (num, h, b, border_c, bg_c) in enumerate(impact_cards):
        top = Inches(1.2 + i * 1.35)
        card = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), top, Inches(7.5), Inches(1.25))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_c
        card.line.color.rgb = border_c
        card.line.width = Pt(1.5)

        # Number Badge
        badge = slide9.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.75), top + Inches(0.2), Inches(0.85), Inches(0.85))
        badge.fill.solid()
        badge.fill.fore_color.rgb = border_c
        badge.line.fill.background()
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.text = num
        p_b.font.name = "Georgia"
        p_b.font.size = Pt(18)
        p_b.font.bold = True
        p_b.font.color.rgb = WHITE
        p_b.alignment = PP_ALIGN.CENTER

        tb = slide9.shapes.add_textbox(Inches(1.75), top + Inches(0.1), Inches(6.2), Inches(1.05))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = border_c

        p_desc = tf.add_paragraph()
        p_desc.text = b
        p_desc.font.name = "Arial"
        p_desc.font.size = Pt(10)
        p_desc.font.color.rgb = NAVY_MED

    # Right Container: Triad of Benefits
    tf_triad = add_card(slide9, Inches(8.4), Inches(1.2), Inches(4.3), Inches(5.5), "HOLISTIC SUSTAINABILITY IMPACT", WHITE, PURPLE_DARK)
    triads = [
        ("Environmental Benefits", "• Eliminates the need for printed physical lab manuals and server waste.\n• Lightweight frontend and edge caching minimize energy consumption.\n• Completely paperless, zero-footprint learning lifecycle."),
        ("Social & Cognitive Benefits", "• Makes quantum computing approachable rather than intimidating.\n• Available in 5+ languages for regional accessibility.\n• Builds computational curiosity and problem-solving habits."),
        ("Economic Benefits", "• Runs smoothly on any basic student laptop with standard internet.\n• Democratizes access to Qiskit Aer cloud simulation.\n• Cuts down both laboratory operating budgets and TA training hours.")
    ]
    for i, (k, v) in enumerate(triads):
        p = tf_triad.paragraphs[0] if i == 0 else tf_triad.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = f"• {k}:\n"
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = PURPLE_DARK
        r2 = p.add_run()
        r2.text = v
        r2.font.size = Pt(10)
        r2.font.color.rgb = NAVY_MED

    # =========================================================================
    # SLIDE 10: 12-MONTH ROADMAP, TEAM & THE ASK (NEW ESSENTIAL SLIDE)
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide10, "12-MONTH EXECUTION ROADMAP & THE ASK")

    # Left Container: 12-Month Roadmap
    tf_road = add_card(slide10, Inches(0.6), Inches(1.2), Inches(6.0), Inches(5.5), "12-MONTH EXECUTION ROADMAP", WHITE, BLUE_ACCENT)
    quarters = [
        ("Q1 2027: Campus Pilot Expansion", 
         "• Onboard 5 pilot engineering colleges with turnkey Canvas lab packs.\n• Connect live Stripe & Razorpay billing webhooks to replace simulated tier state.\n• Implement PgBouncer connection pooling for 10,000 socket concurrency."),
        ("Q2 2027: National Collegiate Hackathon", 
         "• Launch public Pro tier with ₹700 ($7/mo) launch founder pricing.\n• Host National Collegiate Quantum Circuit Hackathon with IEEE Student Chapters.\n• Reach 100 daily active subscribers."),
        ("Q3 2027: Financial Break-Even Milestone", 
         "• Achieve 12 subscriber-months per day (360 active paying subscribers).\n• Cross operating break-even; cover all fixed hosting and maintenance costs.\n• Deploy multi-SDK auto-transpilation for Google Cirq and PennyLane."),
        ("Q4 2027: National Academy Scale", 
         "• Expand to 25 university cohort licenses (₹25 Lakhs ARR).\n• Achieve ₹34 Lakhs ($40.8K) Year 1 operating profit.\n• Formalize integration with National Quantum Mission collegiate curriculum.")
    ]
    for i, (h, b) in enumerate(quarters):
        p = tf_road.paragraphs[0] if i == 0 else tf_road.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = f"• {h}\n"
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = BLUE_ACCENT
        r2 = p.add_run()
        r2.text = b
        r2.font.size = Pt(10)
        r2.font.color.rgb = NAVY_MED

    # Right Container: The Ask & Team
    tf_ask = add_card(slide10, Inches(6.9), Inches(1.2), Inches(5.8), Inches(5.5), "THE ASK & USE OF FUNDS (₹15 LAKHS)", WHITE, GREEN_DARK)

    p = tf_ask.paragraphs[0]
    p.text = "Seed Grant / Competition Ask: ₹15,00,000 ($18,000)"
    p.font.name = "Georgia"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = GREEN_DARK

    p_sub = tf_ask.add_paragraph()
    p_sub.text = "Runway to achieve cash-flow positivity by Month 8 and scale to 15 colleges."
    p_sub.font.size = Pt(10)
    p_sub.font.color.rgb = NAVY_MED

    allocations = [
        ("40% Product Hardening (₹6.0 Lakhs)", "Connecting live Stripe billing, PgBouncer pooling, security audit, and WebGL 2D fallback."),
        ("35% Institutional Deployment (₹5.25 Lakhs)", "Subsidized sandbox onboarding and training for our first 15 collegiate faculty pilots."),
        ("25% Cloud Simulation Compute (₹3.75 Lakhs)", "Dedicated cloud FastAPI Qiskit Aer worker nodes and Gemini Tier 1 API token reserve.")
    ]
    for h, b in allocations:
        p = tf_ask.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = f"• {h}: "
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = GREEN_DARK
        r2 = p.add_run()
        r2.text = b
        r2.font.size = Pt(10)
        r2.font.color.rgb = NAVY_MED

    p_team_h = tf_ask.add_paragraph()
    p_team_h.space_before = Pt(8)
    p_team_h.text = "CORE EXECUTION TEAM (OptiMind · REVERSUN)"
    p_team_h.font.bold = True
    p_team_h.font.size = Pt(11)
    p_team_h.font.color.rgb = NAVY_DARK

    p_team = tf_ask.add_paragraph()
    p_team.text = "• Quantum Algorithm & Simulation Architecture: Qiskit Aer & statevector math.\n• Full-Stack & Systems Engineering: Next.js 14, WebGL Three.js, Prisma, Neon.\n• Pedagogical Curriculum Lead: Socratic AI constraints & misconception ontology."
    p_team.font.size = Pt(9.5)
    p_team.font.color.rgb = NAVY_MED

    # =========================================================================
    # SLIDE 11: RESEARCH, CITATIONS & DATA SOURCES
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_slide_layout)
    add_header_footer(slide11, "RESEARCH, CITATIONS & DATA SOURCES")

    # 4 Metric Cards Top
    ref_metrics = [
        ("300,000", "Quantum specialists needed worldwide by 2030 (McKinsey)", BLUE_ACCENT, BLUE_LIGHT),
        ("Only 1 in 3", "Qualified candidate available for every 3 openings (McKinsey)", RED_DARK, RED_LIGHT),
        ("₹6,003 Cr", "Government of India National Quantum Mission budget through 2031", AMBER_DARK, AMBER_LIGHT),
        ("3 PG Scholars", "Tested QuanBit & constructed Bell/Grover circuits independently", GREEN_DARK, GREEN_LIGHT),
    ]
    for i, (num, label, bcolor, bgcolor) in enumerate(ref_metrics):
        x = Inches(0.6 + i * 3.08)
        box = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.2), Inches(2.9), Inches(1.4))
        box.fill.solid()
        box.fill.fore_color.rgb = bgcolor
        box.line.color.rgb = bcolor
        box.line.width = Pt(1.5)
        tf = box.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = num
        p1.font.name = "Georgia"
        p1.font.size = Pt(24)
        p1.font.bold = True
        p1.font.color.rgb = bcolor
        p1.alignment = PP_ALIGN.CENTER
        p2 = tf.add_paragraph()
        p2.text = label
        p2.font.name = "Arial"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = NAVY_MED
        p2.alignment = PP_ALIGN.CENTER

    # Left Container: Research Papers
    tf_lit = add_card(slide11, Inches(0.6), Inches(2.8), Inches(6.0), Inches(3.9), "ACADEMIC LITERATURE & CURRICULUM REFERENCES", WHITE, BLUE_ACCENT)
    papers = [
        ("Bridging the Quantum Education Gap", "Hands-on Visualization Projects for Quantum Search Algorithm (IEEE Trans. on Education)."),
        ("Teaching Quantum to High-School & Undergrads", "A Hands-On Visual Approach utilizing Bloch Sphere Geodesic Rotations."),
        ("Developing Programming Assignments for QIST", "Automated Circuit Verification & Misconception Ontologies in Collegiate Computer Science."),
        ("Nature India (2023)", "Making Indian Universities Quantum Ready: Overcoming the Collegiate Hardware & Laboratory Deficit.")
    ]
    for i, (t, d) in enumerate(papers):
        p = tf_lit.paragraphs[0] if i == 0 else tf_lit.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = f"• {t}: "
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = BLUE_ACCENT
        r2 = p.add_run()
        r2.text = d
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = NAVY_MED

    # Right Container: Official Data Sources
    tf_src = add_card(slide11, Inches(6.9), Inches(2.8), Inches(5.8), Inches(3.9), "OFFICIAL GOVERNMENT & INDUSTRY SOURCES", WHITE, NAVY_DARK)
    sources = [
        ("McKinsey & Company (2022–2026)", "Quantum Technology Workforce and Adoption Research: The 300,000 Specialist Deficit."),
        ("Government of India (DST / NQM)", "National Quantum Mission Policy & Collegiate Capability Enhancement Guidelines (₹6,003 Cr)."),
        ("IBM Quantum & NPTEL (2026)", "Introduction to Quantum Computing MOOC Enrollment & Collegiate Drop-Out Rate Data."),
        ("QED-C / U.K. Quantum Skills Taskforce", "Quantum Workforce Composition and Educational Tooling Reports (2025–2026)."),
        ("IBM Qiskit Documentation", "Open-source Qiskit Aer statevector simulation microservice and transpiler specification.")
    ]
    for i, (t, d) in enumerate(sources):
        p = tf_src.paragraphs[0] if i == 0 else tf_src.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = f"• {t}: "
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = NAVY_DARK
        r2 = p.add_run()
        r2.text = d
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = NAVY_MED

    output_path = r"c:\QuanBit\QuanBit_Youth_Entrepreneurs_Challenge_2027.pptx"
    prs.save(output_path)
    print(f"Successfully generated PowerPoint presentation at: {output_path}")

if __name__ == "__main__":
    create_presentation()
