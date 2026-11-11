"""Build the served logo from the logo source.

Usage (from the repository root): python3 handoff/scripts/build-brand-images.py

  assets/brand/logo-mark-source.jpg (1024x1024)
    -> public/brand/logo-mark.webp  (512x512, WebP quality 82, method 6)

The favicon files src/app/icon.png (64x64) and src/app/apple-icon.png (180x180)
were cropped by hand to the croissant and are kept in the repository as they
are. Copy them; do not regenerate them. They must stay PNG.
"""
from PIL import Image

src = Image.open("assets/brand/logo-mark-source.jpg").convert("RGB")
src.resize((512, 512), Image.LANCZOS).save("public/brand/logo-mark.webp", quality=82, method=6)
print("wrote public/brand/logo-mark.webp")
