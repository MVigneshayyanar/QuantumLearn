import os
import subprocess
import markdown

def generate_pdf_report():
    md_path = r"c:\QuanBit\founder\business-plan.md"
    html_path = r"c:\QuanBit\founder\business-plan.html"
    pdf_path = r"c:\QuanBit\QuanBit_Detailed_Project_Report.pdf"

    with open(md_path, "r", encoding="utf-8") as f:
        md_content = f.read()

    # Pre-clean any accidental LaTeX artifacts just in case
    md_content = md_content.replace(r"\text{Tr}(\rho_w^2)", "Tr(ρ²_w)")
    md_content = md_content.replace(r"\text{Tr}(\rho^2)", "Tr(ρ²)")
    md_content = md_content.replace(r"\Delta\theta, \Delta\phi", "Δθ, Δϕ")
    md_content = md_content.replace(r"\Delta\theta", "Δθ")
    md_content = md_content.replace(r"\Delta\phi", "Δϕ")
    md_content = md_content.replace(r"\mathcal{C}_1-\mathcal{C}_4", "C₁–C₄")
    md_content = md_content.replace(r"\rightarrow", "→")
    md_content = md_content.replace(r"|-\rangle", "|-⟩")
    md_content = md_content.replace(r"|0\rangle", "|0⟩")
    md_content = md_content.replace(r"|1\rangle", "|1⟩")
    md_content = md_content.replace(r"\rangle", "⟩")
    md_content = md_content.replace(r"\langle", "⟨")

    # Convert markdown to HTML
    html_body = markdown.markdown(md_content, extensions=['tables', 'fenced_code'])

    styled_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>QuanBit — Detailed Project Report | YEC 2027</title>
<style>
    @page {{
        size: A4;
        margin: 18mm 16mm 18mm 16mm;
    }}
    body {{
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
        color: #1e293b;
        line-height: 1.6;
        font-size: 10.5pt;
        background: #ffffff;
    }}
    .header-cover {{
        text-align: center;
        border-bottom: 2px solid #2563eb;
        padding-bottom: 20px;
        margin-bottom: 25px;
    }}
    .badge {{
        display: inline-block;
        background: #eff6ff;
        color: #2563eb;
        padding: 5px 14px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 10pt;
        border: 1px solid #bfdbfe;
        margin-bottom: 12px;
        letter-spacing: 0.5px;
    }}
    h1 {{
        color: #0f172a;
        font-size: 26pt;
        margin-bottom: 4px;
        font-family: Georgia, serif;
    }}
    .subtitle {{
        color: #64748b;
        font-size: 13pt;
        margin-top: 0;
        font-weight: 500;
    }}
    .meta-box {{
        background: #f8fafc;
        border: 1.5px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px 20px;
        margin: 18px auto;
        max-width: 680px;
        text-align: left;
        font-size: 10pt;
    }}
    .meta-box table {{
        width: 100%;
        border-collapse: collapse;
        margin: 0;
    }}
    .meta-box td {{
        padding: 5px 10px;
        border: none;
        background: transparent !important;
    }}
    h2 {{
        color: #1e3a8a;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 5px;
        margin-top: 26px;
        font-size: 14pt;
        page-break-after: avoid;
    }}
    h3 {{
        color: #0f172a;
        font-size: 11.5pt;
        margin-top: 16px;
        page-break-after: avoid;
    }}
    table {{
        width: 100%;
        border-collapse: collapse;
        margin: 14px 0;
        font-size: 9.5pt;
        page-break-inside: avoid;
    }}
    th, td {{
        border: 1px solid #cbd5e1;
        padding: 7px 10px;
        text-align: left;
    }}
    th {{
        background: #f1f5f9;
        font-weight: 600;
        color: #0f172a;
    }}
    tr:nth-child(even) {{
        background: #f8fafc;
    }}
    blockquote {{
        border-left: 4px solid #2563eb;
        background: #f0f7ff;
        margin: 14px 0;
        padding: 10px 16px;
        color: #1e3a8a;
        border-radius: 0 6px 6px 0;
        font-size: 10pt;
    }}
    code {{
        background: #f1f5f9;
        color: #0f172a;
        padding: 2px 5px;
        border-radius: 4px;
        font-family: Consolas, monospace;
        font-size: 9pt;
    }}
    ul, ol {{
        padding-left: 20px;
    }}
    li {{
        margin-bottom: 4px;
    }}
    hr {{
        border: none;
        border-top: 1px solid #e2e8f0;
        margin: 20px 0;
    }}
</style>
</head>
<body>

<div class="header-cover">
    <div class="badge">Youth Entrepreneurs Challenge (YEC) 2027 · Detailed Project Report</div>
    <h1>QUANBIT</h1>
    <div class="subtitle">AI-Based Interactive Quantum Algorithm Learning Platform</div>
    
    <div class="meta-box">
        <table>
            <tr><td><strong>Team Name:</strong> OptiMind</td><td><strong>Theme:</strong> Education & Skill Development</td></tr>
            <tr><td><strong>Startup Entity:</strong> REVERSUN</td><td><strong>Project Stage:</strong> Pilot Tested / Working Prototype</td></tr>
            <tr><td><strong>Live Platform:</strong> https://www.quanbit.tech/</td><td><strong>Video Demo:</strong> https://youtu.be/7j56qHWI42Q</td></tr>
        </table>
    </div>
</div>

{html_body}

</body>
</html>
"""

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(styled_html)

    # Convert HTML to PDF using headless Edge
    edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    if not os.path.exists(edge_exe):
        edge_exe = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

    cmd = [
        edge_exe,
        "--headless",
        "--disable-gpu",
        f"--print-to-pdf={pdf_path}",
        "--no-pdf-header-footer",
        html_path
    ]
    subprocess.run(cmd, check=True)
    print(f"Successfully generated clean Detailed Project Report PDF: {pdf_path}")

if __name__ == "__main__":
    generate_pdf_report()
