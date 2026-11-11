# 06 — Build prompts, phase by phase

The build is split into nine phases. Each phase has a prompt, the files it produces, and the
checks that must pass before the next phase starts.

Use one of two methods:

- **One model:** give it `00-MASTER-PROMPT.md`, then give it one phase prompt at a time.
- **Orchestrator and workers:** the orchestrator keeps the master prompt and gives each phase
  prompt to a worker. The orchestrator looks at the screenshots of each phase before it commits.

Every phase prompt assumes the worker can read the `handoff/` folder. In each prompt, "the
source" means `handoff/reference/SOURCE.md`.

The phases are in dependency order. The original was built in a different order (scaffold,
story refactor, mobile pass, polish pass, POV route, small fixes, caching). This order builds
the final state directly.

---

## Phase 0 — Project setup

**Produces:** `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.mjs`,
`eslint.config.mjs`, `.gitignore`, the folder tree.

```text
Set up the project for the Bakersfield site. Read handoff/04-architecture.md sections on the
stack, configuration and file tree, and the matching files in the source.

1. Create package.json, tsconfig.json, next.config.mjs, eslint.config.mjs and .gitignore so
   that they match the source exactly. Use the exact dependency versions. Do not add or
   upgrade a package.
2. Run npm install.
3. Create the folder tree for src/ and public/ as the architecture file lists it.
4. If you were given assets/ and public/ (Mode A), put them in place and check every file
   against handoff/reference/ASSET-MANIFEST.md (sha256 and size).
   If not (Mode B), stop here and do Phase 1 first.

Checks: npm install finishes with no error. `node -v` is 22 or later. The manifest check
passes, or you report each file that does not match.
Report: versions installed, manifest result, anything you could not match.
```

## Phase 1 — Assets (Mode B only)

**Produces:** `assets/brand/`, `assets/scenes/`, `assets/pov/`, `assets/video/`.

```text
Generate the logo, the stills and the clips. Follow handoff/02-asset-generation.md exactly:
the same models, the same parameters, the same prompts, in the same order.

Method (section 3 of that file):
- Make each still by editing the still before it. Save each still as a JPEG (quality 93),
  host it at a public URL, and use that URL as the reference for the next edit and as the
  first or last frame of a clip.
- Make each clip with a first frame and a last frame, so that the last frame of clip N is the
  first frame of clip N+1.

Review every still and every clip with the criteria in section 11 before you use it. Make a
contact sheet of each clip and look at it. If a result fails, change the prompt as little as
possible and try again. Record every retry.

Download each clip at once. The service URL expires after 24 hours. Save the clips as
assets/video/pixel/c1.mp4 … c6.mp4 and assets/video/pov/v1.mp4 … v6.mp4.

Tell the user the count of images and clips you made, and stop to ask before you spend much
more than the totals in section 10 of that file.

Checks: 7 pixel stills, 9 POV stills, 6 + 6 clips. Pixel clips are 960x960, 120 frames. POV
clips are 1280x720, 150 frames. No hands in any POV clip.
Report: every prompt that you changed and why. State clearly that the assets are new and are
not the same pixels as the original.
```

## Phase 2 — Frames and brand images

**Produces:** `public/frames/`, `public/frames-sm/`, `public/pov/`, `public/pov-sm/`,
`public/brand/logo-mark.webp`, `src/app/icon.png`, `src/app/apple-icon.png`.

```text
Build the served images. Read handoff/03-frame-pipeline.md.

1. Run: bash handoff/scripts/build-frames.sh
2. Run: python3 handoff/scripts/build-brand-images.py
3. Mode A: copy src/app/icon.png and src/app/apple-icon.png from the original.
   Mode B: make a 64x64 and a 180x180 PNG from the logo, cropped to the croissant.

Checks: the frame counts per slug are 60 (frames), 41 (frames-sm), 51 (pov), 39 (pov-sm),
each with a poster.webp. Frame sizes are 720x720, 480x480, 960x540, 640x360. In Mode A,
compare every file with the manifest. If your ffmpeg or Pillow version differs from the file
and the checksums differ, copy the original frames instead.
Report: counts, total size per set, and the result of the manifest comparison.
```

## Phase 3 — Global styles, layout and content

**Produces:** `src/app/globals.css`, `src/app/layout.tsx`, `src/content/beats.ts`,
`src/content/pov.ts`, `src/lib/asset-version.ts`, `src/lib/device.ts`, `src/lib/segments.ts`,
`src/lib/scroll.ts`, `src/lib/beat-store.ts`, `src/lib/pov-store.ts`.

```text
Create the global layer of the Bakersfield site. Read handoff/01-brand-and-copy.md, the token
tables in handoff/05-design-and-motion.md, and sections on content, lib and layout in
handoff/04-architecture.md. Then write each file so that it matches the source.

- globals.css: every custom property with its exact value, every global rule, the
  @supports fallback, and the ligature rule.
- layout.tsx: font imports from the two @fontsource packages, metadata, the viewport export,
  the skip link, and SmoothScroll (you will write that component in Phase 4; leave the import).
- content files: the types and all copy, exactly as in 01-brand-and-copy.md.
- lib files: every function and constant, exactly as in the source.

Do not change a value because another value looks better. Copy exactly.

Checks: TypeScript compiles these files. Compare each file with the source and list any
difference.
```

## Phase 4 — Frame engine and the pixel story (`/`)

**Produces:** `src/components/SmoothScroll.tsx`, `ScrollSequence.tsx` + CSS,
`StorySection.tsx` + CSS, `Hero.tsx` + CSS, `ProgressRail.tsx` + CSS, `RevealOnView.tsx` + CSS,
`Visit.tsx` + CSS, `src/app/page.tsx`.

```text
Build the pixel route "/". Read in handoff/04-architecture.md: the frame engine, the scroll
and pin logic, SmoothScroll, and the page composition. Read in handoff/05-design-and-motion.md:
the CSS module of each component, the layout per viewport, and the motion inventory. Then
write each file so that it matches the source.

Points that must be exact (the architecture file gives the formulas):
- progress -> segment -> frame index mapping, and its rounding
- canvas sizing, the device pixel ratio cap, contain fit, image smoothing
- redraw only when the frame index changes; no animation loop when idle
- loading: nothing until the stage is near the viewport; then the focus segment and the next
  one only; more when the segment changes; the nearest loaded frame is drawn while one loads
- the small frame set on phones and slow connections, chosen once on mount
- pin length per beat on desktop and on phones, from the stable viewport height
- the copy panel tweens, and the rule that exactly one panel is visible after any scroll
- deep links #beat-<slug>, with the target slightly inside the segment
- reduced motion: no pin, no frames, a list of six stills with copy
- Lenis only on fine pointers
- the visit card is visible when JavaScript is off

Checks: npm run lint and npm run build pass. Then run the checks for "/" in
handoff/07-verification.md at 1440x900, 390x844 and 320x568, take the screenshots, and LOOK at
them. Compare with the description in 05. Fix what differs.
Report: check results, screenshot paths, differences from the source, what you did not test.
```

## Phase 5 — The first-person story (`/pov`)

**Produces:** `src/app/pov/page.tsx`, `src/components/pov/PovHero.tsx` + CSS,
`PovSequence.tsx` + CSS, `PovStory.tsx` + CSS, `PovOutro.tsx` + CSS.

```text
Build the route "/pov". Read the POV parts of handoff/04-architecture.md and
handoff/05-design-and-motion.md, then write each file so that it matches the source.

PovSequence is a copy of ScrollSequence with these additions. The architecture file lists every
difference:
- a fit option: cover or contain
- cross-fades at the two hard cuts (the start of the bake segment and of the mustache
  segment), driven by scroll progress so they work in both directions; the three seamless
  joins must not cross-fade
- edge frames of neighbour segments are loaded first, so the cross-fade has both pictures

Layout: full-bleed cover in landscape with a glass caption panel; in portrait a 16:9 frame on
top with the copy below, the group centred a little above the middle of the screen.

Checks: lint and build pass, and "/" still works. Run the "/pov" checks in
handoff/07-verification.md at 1440x900, 768x1024, 390x844, 844x390 and 320x568. Take a
screenshot in the middle of a cross-fade and look at it. LOOK at all screenshots.
Report: as in Phase 4.
```

## Phase 6 — Image loading and caching

**Produces:** changes in `next.config.mjs`, `src/app/page.tsx`, and every place that builds
an image URL. If you followed the source in the earlier phases, this phase is a check only.

```text
Check the loading behaviour against handoff/04-architecture.md and handoff/08-deploy.md:

- next.config.mjs sends "public, max-age=31536000, immutable" for the WebP files under
  /frames/, /frames-sm/, /brand/, /pov/<slug>/ and /pov-sm/<slug>/, and does NOT send it for
  the HTML of "/" and "/pov".
- Every frame, poster and logo URL is built with withVersion(), and the CSS background URLs in
  PovOutro.module.css carry the same ?v= value.
- "/" preloads the first frame of the first segment, once per screen size, with low priority,
  with the same URL that the frame loader requests.
- The hero logo has fetchPriority high, explicit width and height, and no lazy loading.
- The two links between the versions are plain <a> elements.

Checks: start the production server and run the header checks and the request checks in
handoff/07-verification.md. On a reload, every image must come from the browser cache. The
console must have no "preloaded but not used" warning.
```

## Phase 7 — Full verification

```text
Run every check in handoff/07-verification.md on a clean production build
(npm run build, then npm run start). Before you start the server, make sure no older server
process holds the port.

Then compare your src/ tree with handoff/reference/SOURCE.md, file by file. List every
difference, with the reason. A rebuild is exact only when this list is empty.

Report: a table with one row per check (pass or fail), the list of differences, the paths of
all screenshots, and a plain list of what you did not test (for example real phones, Safari).
```

## Phase 8 — Deploy (only when the user asks)

```text
Deploy as handoff/08-deploy.md describes. Do not deploy until Phase 7 passes and the user says
to deploy. After the deploy, check the live URL: both routes return 200, the image paths
return the immutable cache header, and the HTML does not.
```

---

## Brief template for a worker

The original build gave each worker a brief with these parts. Use the same parts.

```text
1. Context: what the site is, what exists now, what this pass must change.
2. Read first: the exact files and handoff sections to read before any edit.
3. Tasks: numbered, each with exact values. Say "use exactly this text" for copy.
4. Do not touch: the files and folders that are out of scope. Say "do not commit, do not
   push, do not deploy".
5. Verify: build and lint; start the production server on a named port; a Playwright script
   with the viewports and scroll positions to capture; "READ the screenshots yourself and
   judge them"; stop the server.
6. Report back: files changed, check results, screenshot paths, and what is untested or
   uncertain.
```

Rules for the orchestrator:

- Give a worker either a task on shared files, or new files only. Two workers must not edit
  the same file at the same time. If they must run at the same time, one works in an isolated
  git worktree and writes only new files.
- Look at the worker's screenshots before you commit. Do not accept a report alone.
- If a worker says that a command was denied, do not run that command for it. Tell the user.
- Commit only reviewed work. On this project the working branch deploys to production.
