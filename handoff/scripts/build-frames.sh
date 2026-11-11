#!/usr/bin/env bash
# Rebuild every animation frame set from the source clips.
#
# Usage:   handoff/scripts/build-frames.sh [OUT_DIR]
# Default: OUT_DIR=public  (writes public/frames, public/frames-sm, public/pov, public/pov-sm)
#
# Needs: ffmpeg with libwebp, python3 with Pillow and numpy.
# Run from the repository root. Source clips are read from assets/video/.
#
# Clip -> slug mapping (same for both versions):
#   1 ingredients, 2 dough, 3 lamination, 4 proof, 5 bake, 6 mustache
set -euo pipefail

OUT="${1:-public}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIXEL_SRC="assets/video/pixel"   # c1.mp4 .. c6.mp4, 960x960, 30 fps, 4 s, 120 frames
POV_SRC="assets/video/pov"       # v1.mp4 .. v6.mp4, 1280x720, 30 fps, 5 s, 150 frames
WORK="$(mktemp -d)"
SLUGS=(ingredients dough lamination proof bake mustache)

for idx in 0 1 2 3 4 5; do
  slug="${SLUGS[$idx]}"
  n=$((idx + 1))

  # ---- Pixel version: PNG intermediates, normalised and encoded by Python ----
  mkdir -p "$WORK/f/$slug" "$WORK/s/$slug"
  # Desktop: every 2nd frame -> 60 frames, 720x720.
  ffmpeg -v error -y -i "$PIXEL_SRC/c$n.mp4" \
    -vf "select='not(mod(n,2))',scale=720:720:flags=lanczos" -vsync vfr \
    "$WORK/f/$slug/%04d.png"
  # Phone: every 3rd frame plus the last frame -> 41 frames, 480x480.
  ffmpeg -v error -y -i "$PIXEL_SRC/c$n.mp4" \
    -vf "select='not(mod(n,3))+eq(n,119)',scale=480:480:flags=lanczos" -vsync vfr \
    "$WORK/s/$slug/%04d.png"

  # ---- POV version: encoded straight to WebP by ffmpeg ----
  mkdir -p "$OUT/pov/$slug" "$OUT/pov-sm/$slug"
  # Desktop: every 3rd frame plus the last frame -> 51 frames, 960x540, quality 45.
  ffmpeg -v error -y -i "$POV_SRC/v$n.mp4" \
    -vf "select='not(mod(n,3))+eq(n,149)',scale=960:540:flags=lanczos" -vsync vfr \
    -c:v libwebp -quality 45 -compression_level 6 "$OUT/pov/$slug/%04d.webp"
  # Phone: every 4th frame plus the last frame -> 39 frames, 640x360, quality 44.
  ffmpeg -v error -y -i "$POV_SRC/v$n.mp4" \
    -vf "select='not(mod(n,4))+eq(n,149)',scale=640:360:flags=lanczos" -vsync vfr \
    -c:v libwebp -quality 44 -compression_level 6 "$OUT/pov-sm/$slug/%04d.webp"
  # Poster = last frame of the segment.
  cp "$OUT/pov/$slug/0051.webp" "$OUT/pov/$slug/poster.webp"
  cp "$OUT/pov-sm/$slug/0039.webp" "$OUT/pov-sm/$slug/poster.webp"
done

# Pixel version: normalise the background colour, encode WebP, write posters.
python3 "$HERE/normalise_pixel.py" "$WORK" "$OUT"

echo "Frame sets written to $OUT/{frames,frames-sm,pov,pov-sm}"
echo "Intermediate PNG files are in $WORK (safe to delete by hand)."
