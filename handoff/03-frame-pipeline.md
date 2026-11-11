# 03 — Frame pipeline: clips to WebP frame sets

The site does not play video. It draws still frames on a canvas, and scroll position chooses
the frame. This file says how the frames are cut from the clips.

This step is **deterministic and verified**: running `scripts/build-frames.sh` on the saved
clips reproduced all 1,170 committed frame files byte for byte (SHA-256 compared), with the
tool versions in section 5.

## 1. Run it

From the repository root:

```bash
bash handoff/scripts/build-frames.sh
```

```bash
python3 handoff/scripts/build-brand-images.py
```

The first command writes `public/frames`, `public/frames-sm`, `public/pov` and `public/pov-sm`.
The second writes `public/brand/logo-mark.webp`. To write the frames to another folder, give
it as an argument: `bash handoff/scripts/build-frames.sh /some/other/dir`.

## 2. Inputs and outputs

Clip to slug mapping, the same for both versions:
`1 ingredients · 2 dough · 3 lamination · 4 proof · 5 bake · 6 mustache`

| Set | Input | Frame selection (ffmpeg `select`) | Size | Frames per slug | Encoder and quality | Total |
|---|---|---|---|---|---|---|
| `public/frames/<slug>/` | `assets/video/pixel/cN.mp4` (120 frames) | `not(mod(n,2))` | 720×720 | 60 | Pillow WebP `quality=50, method=6`, after normalisation | 360 frames + 6 posters, 3.63 MB |
| `public/frames-sm/<slug>/` | same | `not(mod(n,3))+eq(n,119)` | 480×480 | 41 | Pillow WebP `quality=48, method=6`, after normalisation | 246 frames + 6 posters, 1.45 MB |
| `public/pov/<slug>/` | `assets/video/pov/vN.mp4` (150 frames) | `not(mod(n,3))+eq(n,149)` | 960×540 | 51 | ffmpeg `libwebp -quality 45 -compression_level 6` | 306 frames + 6 posters, 5.62 MB |
| `public/pov-sm/<slug>/` | same | `not(mod(n,4))+eq(n,149)` | 640×360 | 39 | ffmpeg `libwebp -quality 44 -compression_level 6` | 234 frames + 6 posters, 2.38 MB |

Rules for every set:

- Scale filter: `scale=W:H:flags=lanczos`, with `-vsync vfr`.
- File names: `0001.webp`, `0002.webp`, … (1-based, four digits, no gaps).
- `poster.webp` in each folder is a **copy of the last frame** of that folder.
- The `+eq(n,LAST)` term adds the final frame of the clip. This matters: the last frame of one
  segment must equal the first frame of the next, so the join is invisible. The pixel desktop
  set does not include frame 119 (it ends on frame 118); this is how the site was built, and
  the join is still not visible.
- Each folder has frames + 1 poster, so the file counts are 61, 42, 52 and 40 per slug.
- All four sets together are 1,170 files and 13.09 MB. Exact byte counts are in `reference/ASSET-MANIFEST.md`.

## 3. Background normalisation (pixel version only)

Problem: each generated pixel clip has a slightly different cream background (for example
`#F5E5BD` in one clip and `#F9E1B3` in another). The frames are drawn on a flat page colour.
A tint difference shows as a faint square around the frame.

Fix (`scripts/normalise_pixel.py`), applied to every pixel frame before WebP encoding:

1. Take four corner blocks of the frame (24×24 px for the 720 px set, 16×16 px for the 480 px set).
2. Compute the per-channel **median** of those pixels. This is the frame's background colour.
3. Multiply every pixel by `target / background`, per channel, where target is `#F7E3B8`.
4. Clip to 0–255 and encode.

The gain is a few percent, so the table and croissant colours do not change visibly. The CSS
token `--stage` is the same `#F7E3B8`, and the CSS also fades the outer edge of the frame with
a mask, so no edge shows.

The POV frames are not normalised. They are photographs that fill the whole frame.

## 4. Why these numbers

- **720p source, smaller frames:** the client asked for 720p or lower, small but good enough.
- **Two sets per version:** phones and slow connections get the `-sm` set. See `04-architecture.md` for how the site chooses.
- **Quality values:** tested on sample frames. Pixel `q72 → q50` and POV `q62 → q45` saved about 21% in size with PSNR still above 36 dB. No visible blocks or bands on the flat cream or the marble.
- **Frame counts:** fewer frames on phones, because a phone story is shorter in scroll length (85 vh per beat against 130 vh).

Measured trade-off table (average KB per frame, PSNR in dB):

| Set | Quality | KB | PSNR |
|---|---|---|---|
| Pixel 720 | 72 | 12.7 | 39.5 |
| Pixel 720 | 60 | 11.0 | 38.6 |
| Pixel 720 | **50** | 9.9 | 37.9 |
| Pixel 720 | 40 | 8.7 | 37.1 |
| POV 960×540 | 62 | 19.2 | 37.2 |
| POV 960×540 | 52 | 16.8 | 36.6 |
| POV 960×540 | **45** | 15.2 | 36.2 |
| POV 960×540 | 38 | 13.5 | 35.6 |

## 5. Tool versions used

| Tool | Version |
|---|---|
| ffmpeg | 6.1.1 (Ubuntu build, with libwebp) |
| Python | 3.13 |
| Pillow | 12.3.0 |
| numpy | 2.5.3 |

Other versions give frames that look the same but may not be byte-identical. If you need
byte-identical files, copy `public/frames*` and `public/pov*` from the repository instead of
rebuilding them.

## 6. If the frames change

Every image URL in the site carries `?v=<ASSET_VERSION>` (`src/lib/asset-version.ts`, now
`'2'`), and the frames are served with a one-year immutable cache. If you change any frame
or the logo, **increase `ASSET_VERSION`** and the two hardcoded `?v=2` values in
`src/components/pov/PovOutro.module.css`. If you do not, returning visitors keep the old files.
