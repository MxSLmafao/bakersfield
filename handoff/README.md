# Bakersfield — handoff packages

This folder holds two different packages. Choose one. Do not mix them.

| Package | Where | The other model gets | The result |
|---|---|---|---|
| **From scratch** | `from-scratch/` | An empty repository, the same skills, tools, working method and client messages that the original model had. No code, no pictures, no prompts from the original. | A new site of the same kind. Its own design, code and pictures. |
| **Exact copy** | This folder (files `00`–`10`, `reference/`, `scripts/`) | The finished source code, the saved pictures, and a full specification. | The same site. |

- To let another model **do the project again itself**, go to `from-scratch/README.md`. Give the model only that folder.
- To **reproduce the finished site**, read on.

The rest of this file is about the exact-copy package.

- **Start here:** give `00-MASTER-PROMPT.md` to the model.
- **Ground truth for the code:** `reference/SOURCE.md` (every source file, complete).
- **Ground truth for the pictures:** the files in `assets/` and `public/`, checked by `reference/ASSETS.sha256`.

## What can be reproduced exactly, and what cannot

| Part | Exact copy possible? | How |
|---|---|---|
| Source code (33 source files and 6 config files) | **Yes** | Recreate from `reference/SOURCE.md`. Compare file by file. |
| Dependencies | **Yes** | `package.json` pins exact versions. Use the repository's `package-lock.json`. |
| Animation frames (1,170 WebP files) | **Yes** | Copy `public/`, or run `scripts/build-frames.sh` on the saved clips. The script was run and all 1,170 files matched the originals byte for byte. |
| Served logo | **Yes** | `scripts/build-brand-images.py`. Verified identical. |
| Logo, stills and clips (the generated source media) | **No, not by generating again** | AI image and video generation is not deterministic. The same prompt gives a similar picture, not the same pixels. For an exact copy, **use the saved files** in `assets/`. The prompts are in `02-asset-generation.md` for the case where you must generate again. |
| Deployment | **Yes** | `08-deploy.md`. |

So there are two modes:

- **Mode A — exact copy.** Give the model this folder plus `assets/` and `public/`. The result can be identical.
- **Mode B — from scratch.** Give the model this folder only. The code can be identical. The pictures will be new, in the same style.

The fastest way to get an exact copy is still to clone the repository. This package is for a
rebuild from a description.

## Files

| File | Content |
|---|---|
| `00-MASTER-PROMPT.md` | The prompt to give to the model. Rules, modes, definition of done. |
| `01-brand-and-copy.md` | The brief, palette, fonts, voice, and every string of copy. |
| `02-asset-generation.md` | Every image and video prompt, with model, parameters, order and review criteria. |
| `03-frame-pipeline.md` | How clips become WebP frame sets. Deterministic and verified. |
| `04-architecture.md` | Stack, file tree, every component, formula and constant. Written from the code. |
| `05-design-and-motion.md` | Every design token, layout, breakpoint and animation. Written from the code. |
| `06-build-prompts.md` | The build in nine phases, with one prompt per phase and its checks. |
| `07-verification.md` | Acceptance tests for both routes at seven viewports. |
| `08-deploy.md` | Vercel settings, steps, and the two blockers that were met. |
| `09-decisions-and-pitfalls.md` | Why things are as they are. Sixteen errors and their fixes. Known limits. |
| `10-skills-and-tools.md` | The design skills and tools that were used, with their sources. |
| `reference/SOURCE.md` | Complete source code in one file. Generated. |
| `reference/ASSET-MANIFEST.md` | Size, format and checksum of every binary asset. Generated. |
| `reference/ASSETS.sha256` | All 1,205 asset files in `sha256sum` format. Generated. |
| `scripts/build-frames.sh` | Clips to frame sets. |
| `scripts/normalise_pixel.py` | Background normalisation and WebP encoding of the pixel frames. |
| `scripts/build-brand-images.py` | Logo source to served WebP logo. |
| `scripts/make-source-snapshot.sh` | Regenerates `reference/SOURCE.md`. |
| `scripts/make-asset-manifest.sh` | Regenerates the manifest and the checksum list. |

## Where the binary files are

| Folder | Content | Needed for |
|---|---|---|
| `assets/brand/` | Logo source, brand sheet | Mode A |
| `assets/scenes/` | 7 pixel stills | History, and Mode B reference |
| `assets/pov/` | 9 POV stills (and 3 rejected test stills) | History, and Mode B reference |
| `assets/video/pixel/`, `assets/video/pov/` | The 12 source clips (47 MB) | Rebuilding the frames |
| `public/frames/`, `public/frames-sm/` | Pixel frame sets | The site |
| `public/pov/`, `public/pov-sm/` | POV frame sets | The site |
| `public/brand/` | Served logo | The site |
| `src/app/icon.png`, `src/app/apple-icon.png` | Favicon files | The site |

## How to use the package

1. Decide the mode (A or B).
2. Give the model `00-MASTER-PROMPT.md` and this folder. In Mode A, give it `assets/` and `public/` too.
3. Let it work through the phases in `06-build-prompts.md`.
4. Accept the result only when the checks in `07-verification.md` pass and the file-by-file comparison with `reference/SOURCE.md` shows no difference.

Check a copy of the assets:

```bash
sha256sum -c handoff/reference/ASSETS.sha256
```

Rebuild the frames from the clips:

```bash
bash handoff/scripts/build-frames.sh
```

## Keep the package current

`reference/SOURCE.md`, `reference/ASSET-MANIFEST.md` and `reference/ASSETS.sha256` are
generated. After any change to the code or the assets, run:

```bash
bash handoff/scripts/make-source-snapshot.sh
```

```bash
bash handoff/scripts/make-asset-manifest.sh
```

`04-architecture.md`, `05-design-and-motion.md` and `07-verification.md` describe the code at
the commit named at the top of `reference/SOURCE.md`. If the code changes, they need an
update by hand. `reference/SOURCE.md` wins where they disagree.

## State of the original at the time of this package

- Live: `https://bakersfield-ten.vercel.app` (pixel version) and `https://bakersfield-ten.vercel.app/pov` (first-person version).
- Stack: Next.js 15.5.28, React 19.3.1, TypeScript 5.9.3, GSAP 3.15.0, Lenis 1.3.27, CSS Modules.
- Not tested on real phones, Safari or Firefox. See `09-decisions-and-pitfalls.md`, section 3.
