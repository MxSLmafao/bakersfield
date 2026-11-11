"""Normalise the pixel-art frames and encode them as WebP.

Why: each generated clip has a slightly different cream background tint. The
page background behind the frames is one flat colour (--stage, #F7E3B8). If the
tints differ, a faint square shows around the frame. This script measures the
background of every frame from its four corners and applies a per-channel gain
so the background becomes exactly the stage colour.

Usage: python3 normalise_pixel.py WORK_DIR OUT_DIR
  WORK_DIR/f/<slug>/NNNN.png  -> OUT_DIR/frames/<slug>/NNNN.webp     (720 px, quality 50)
  WORK_DIR/s/<slug>/NNNN.png  -> OUT_DIR/frames-sm/<slug>/NNNN.webp  (480 px, quality 48)
The last frame of each slug is copied to poster.webp.
"""
import glob
import os
import shutil
import sys

import numpy as np
from PIL import Image

WORK, OUT = sys.argv[1], sys.argv[2]
STAGE = np.array([0xF7, 0xE3, 0xB8], float)  # --stage

# (work sub-folder, output folder, WebP quality, corner sample size in px)
SETS = [
    ("f", "frames", 50, 24),
    ("s", "frames-sm", 48, 16),
]

for sub, dst, quality, k in SETS:
    for path in sorted(glob.glob(os.path.join(WORK, sub, "*", "*.png"))):
        slug = os.path.basename(os.path.dirname(path))
        name = os.path.basename(path)[:-4]
        a = np.asarray(Image.open(path).convert("RGB")).astype(float)
        corners = np.concatenate(
            [
                a[:k, :k].reshape(-1, 3),
                a[:k, -k:].reshape(-1, 3),
                a[-k:, :k].reshape(-1, 3),
                a[-k:, -k:].reshape(-1, 3),
            ]
        )
        background = np.median(corners, axis=0)
        out = np.clip(a * (STAGE / background), 0, 255).astype("uint8")
        target = os.path.join(OUT, dst, slug)
        os.makedirs(target, exist_ok=True)
        Image.fromarray(out).save(os.path.join(target, name + ".webp"), quality=quality, method=6)

    for folder in sorted(glob.glob(os.path.join(OUT, dst, "*"))):
        count = len(glob.glob(os.path.join(folder, "0*.webp")))
        shutil.copy(os.path.join(folder, "%04d.webp" % count), os.path.join(folder, "poster.webp"))
        print(dst, os.path.basename(folder), count)
