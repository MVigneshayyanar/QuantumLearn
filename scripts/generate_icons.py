import os
import subprocess
import shutil

PUBLIC_DIR = r"c:\QuanBit\public"
ICONS_DIR = os.path.join(PUBLIC_DIR, "icons")
ARTIFACT_DIR = r"C:\Users\vicky\.gemini\antigravity-ide\brain\bd965a90-bb51-4554-a123-3ae88de5aff5"
SCRATCH_DIR = os.path.join(ARTIFACT_DIR, "scratch")

os.makedirs(ICONS_DIR, exist_ok=True)
os.makedirs(SCRATCH_DIR, exist_ok=True)

# SVG templates
SVG_BRAND = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="1.5" fill="#4f46e5" stroke="none" />
  <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
  <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
</svg>'''

SVG_WHITE = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="1.5" fill="#ffffff" stroke="none" />
  <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
  <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
</svg>'''

SVG_GRADIENT = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="qgrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <circle cx="12" cy="12" r="1.5" fill="url(#qgrad)" stroke="none" />
  <path stroke="url(#qgrad)" d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
  <path stroke="url(#qgrad)" d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
</svg>'''

# Save SVGs
svg_files = {
    "brand": os.path.join(SCRATCH_DIR, "icon-brand.svg"),
    "white": os.path.join(SCRATCH_DIR, "icon-white.svg"),
    "gradient": os.path.join(SCRATCH_DIR, "icon-gradient.svg"),
}

with open(svg_files["brand"], "w", encoding="utf-8") as f:
    f.write(SVG_BRAND)
with open(svg_files["white"], "w", encoding="utf-8") as f:
    f.write(SVG_WHITE)
with open(svg_files["gradient"], "w", encoding="utf-8") as f:
    f.write(SVG_GRADIENT)

# Also save transparent SVGs to public
with open(os.path.join(PUBLIC_DIR, "icon-no-bg.svg"), "w", encoding="utf-8") as f:
    f.write(SVG_BRAND)
with open(os.path.join(PUBLIC_DIR, "icon-white-no-bg.svg"), "w", encoding="utf-8") as f:
    f.write(SVG_WHITE)

sizes = [1024, 512, 256, 128, 64, 32]

print("Rendering PNGs...")
for variant, svg_path in svg_files.items():
    for size in sizes:
        out_name = f"icon-{variant}-{size}.png"
        out_path = os.path.join(ICONS_DIR, out_name)
        cmd = f'npx -y @resvg/resvg-js-cli --fit-width {size} --fit-height {size} "{svg_path}" "{out_path}"'
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error rendering {out_name}:", res.stderr)
        else:
            print(f"Generated: {out_name} ({size}x{size})")

# Copy the standard primary files directly to public/ and artifacts
primary_brand = os.path.join(ICONS_DIR, "icon-brand-512.png")
primary_white = os.path.join(ICONS_DIR, "icon-white-512.png")
primary_grad = os.path.join(ICONS_DIR, "icon-gradient-512.png")

shutil.copy(primary_brand, os.path.join(PUBLIC_DIR, "icon-no-bg.png"))
shutil.copy(primary_white, os.path.join(PUBLIC_DIR, "icon-white-no-bg.png"))
shutil.copy(primary_brand, os.path.join(PUBLIC_DIR, "icon-transparent.png"))

# Artifact copies for visual presentation
shutil.copy(primary_brand, os.path.join(ARTIFACT_DIR, "icon_no_bg_brand.png"))
shutil.copy(primary_white, os.path.join(ARTIFACT_DIR, "icon_no_bg_white.png"))
shutil.copy(primary_grad, os.path.join(ARTIFACT_DIR, "icon_no_bg_gradient.png"))

print("All icon PNGs successfully generated!")
