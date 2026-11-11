# 10 — Skills and tools that were used

The site was built by an AI coding agent with these skills installed in `.claude/skills/`.
The skills are instruction files. They shaped the design decisions. A rebuild does not need
them if it follows the specification, but they explain where the rules came from.

## 1. Skills, their sources, and what was taken from each

| Skill (folder) | Source | What it gave to this project |
|---|---|---|
| `3d-animation-landing` | npm `claude-skill-3d-animation-landing` | The canvas frame-sequence technique: a sticky canvas, frames chosen by scroll progress, smooth scroll, performance rules. The base of both stories. |
| `scrollytelling-brand-site` | `github.com/abdelrhman2007/scrollytelling-brand-site` | "A story, not sections": one metaphor (the croissant is made from scratch) and one beat per screen. Never invent facts. Reduced-motion fallback for every pinned section. Responsive audit at fixed widths. Measure, do not guess. |
| `scroll-world` | `github.com/oso95/scroll-world` | The chaining method for clips: generate stills, then clips between stills, so consecutive clips share a frame and join with no cut. |
| `apple-design` | `github.com/emilkowalski/skills` (`skills/apple-design`) | Motion and material principles for the polish pass: spring-like easing, interruptible transitions, depth by soft shadow, restraint, reduced motion. |
| `apple-design-dickwu` | `github.com/dickwu/apple-design-skill` | Review lens (Human Interface Guidelines): hit targets of 44 px, contrast, safe areas. |
| `skill-design-system-liquid` | `github.com/sasaki-ta-instyle/skill-design-system-liquid` | **Only** the glass material recipe: translucent fill, `backdrop-filter` with saturate and blur, 1 px light border, inset specular highlight, soft shadow, superellipse corners, and an opaque fallback. Its brand (fonts, logo, highlight colour, `CLAUDE.md` template) was **not** used. |
| `taste-skill` | `github.com/leonxlnx/taste-skill` | Quality bar: plain copy, one section per screen, equal edges, no captions under visuals, quiet micro-interactions, real fonts. |
| typography set (`typeface-pairing`, `typeface-selection`, `hierarchy-and-scale`, `motion-typography`, and 17 more) | `github.com/jpoindexter/typography-skills` | The pairing rule: the second typeface must earn its place, and the body face does the reading work. Result: Pixelify Sans for display only, DM Sans for everything else. |
| `higgsfield-*` (9 skills) | `github.com/higgsfield-ai/skills` | Reference for image and video generation workflows. |
| `higgsfield-*` (36 skills) and `higgsfield` | `github.com/OSideMedia/higgsfield-ai-prompt-skill` | Reference for prompt structure: camera, subject, action, setting, style, light, and a list of exclusions. |

Note: the `emilkowalski/skills` repository has 18 skills. Only `apple-design` was installed,
because the client linked that one file. Two skills declare the name `apple-design`; the
second is installed in the folder `apple-design-dickwu`.

## 2. Generation tools

| Tool | Models | Use |
|---|---|---|
| Higgsfield MCP `generate_image` | `ag/gemini-3.1-flash-image`, `qwen-image-3.0-pro`, `wan2.7-image-pro` | Logo, stills, still edits |
| Higgsfield MCP `generate_video` / `get_video_task` | `wan3.0-video` | All clips |

A clip took about one minute to render. Poll `get_video_task` with the task id. The video URL
that the service returns is valid for 24 hours, so download each clip at once. The clips are
saved in `assets/video/`.

## 3. Build and test tools

| Tool | Use |
|---|---|
| Node 22, npm 10 | Build |
| ffmpeg 6.1 with libwebp | Frame extraction, contact sheets |
| Python 3 with Pillow and numpy | Background normalisation, WebP encoding, palette measurement |
| Playwright with Chromium | Screenshots at fixed viewports, request and console checks |
| Vercel MCP | Project creation, deployment state |

## 4. Project instruction file

`CLAUDE.md` at the repository root has one standing rule from the client: chat messages to
the client are written in ASD-STE100 (Simplified Technical English) at about 75% compliance.
Code, files, commands and commit messages stay in normal English. This rule is about how the
agent talks to the client. It has no effect on the site.
