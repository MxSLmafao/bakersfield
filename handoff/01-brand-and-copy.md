# 01 — Brand, voice and copy

Everything in this file is final and approved, unless it is marked "draft".

## 1. The brief (as the client gave it)

- A website for a bakery brand named **Bakersfield**.
- The logo is a **pixelated croissant with a French moustache** on it.
- Purpose: **brand showcase**. No shop, no ordering, no menu.
- One scroll page first. Interactive. Next.js.
- Pixel style: **soft 16-bit** (soft pixel edges and gentle shading, not harsh 8-bit).
- Video: 720p or lower, so files are small but look good enough.
- Later requests, in order:
  1. Optimise for mobile devices.
  2. A separate version with a **realistic first-person view** of making the croissant, at `/pov`.
  3. More polished and premium, in an Apple-like style, with **liquid glass buttons**.
  4. All animation images as WebP, small, and fast to load.

## 2. Logo

- File: `assets/brand/logo-mark-source.jpg` (1024×1024). Served as `public/brand/logo-mark.webp` (512×512).
- A golden pixel croissant, seen from the front, with a dark brown curled moustache, on plain cream.
- How it was made: `02-asset-generation.md`, section 4.
- Favicon: `src/app/icon.png` (64×64) and `src/app/apple-icon.png` (180×180), cropped to the croissant. These stay PNG.

## 3. Palette

The seven brand colours were measured from the logo pixels. They were not chosen by eye.

| Token | Name | Hex | Role |
|---|---|---|---|
| `--cream` | Cream | `#F6E7CA` | Page background, hero |
| `--butter` | Butter | `#FAD488` | Highlight |
| `--honey` | Honey | `#F9B35F` | Croissant light |
| `--amber` | Amber | `#EA9346` | Croissant mid |
| `--bake` | Bake | `#D06C2E` | Croissant deep, focus ring |
| `--crust` | Crust | `#A8572D` | Accent, beat numbers |
| `--ink` | Mustache | `#462217` | All text, dark glass |
| `--stage` | Stage | `#F7E3B8` | Background of the pixel story. It equals the background of the pixel frames after normalisation. |

`--stage` is not a logo colour. It is the measured background of the generated pixel frames.
The frame pipeline forces every frame to this exact colour (`03-frame-pipeline.md`).

All glass, shadow, radius and easing tokens are in `05-design-and-motion.md`.

## 4. Typography

| Role | Family | Package | Rule |
|---|---|---|---|
| Display | **Pixelify Sans** (400, 700) | `@fontsource/pixelify-sans` | Large sizes only: wordmark, beat numbers, beat titles on `/`. On `/pov` it is used for the wordmark **only**. |
| Body and UI | **DM Sans** (variable) | `@fontsource-variable/dm-sans` | All running text, buttons, labels, and the titles on `/pov`. |

- Both fonts are SIL Open Font License. They are loaded from npm packages, **not** from Google's servers and **not** with `next/font/google`.
- `font-variant-ligatures: no-common-ligatures` is set on `:root`. Reason: the "fi" ligature of Pixelify Sans looks like a capital "A". Without this rule, "The finishing touch" reads as "The Anishing touch".
- No third typeface.

## 5. Voice

- Warm, plain and proud. Short sentences.
- British spelling in the copy: "moustache". The file and slug names use "mustache".
- **Never invent facts.** No opening hours, prices, addresses, years, awards, team names or product claims. The client gave none. The call-to-action link is a placeholder (`href="#"`) with the comment `TODO: real contact details from client`.
- No captions under images. No claims about the footage.

## 6. Copy for `/` (pixel version) — use exactly

Page metadata: title `Bakersfield`, description `Bakersfield is a bakery. Follow the croissant from flour to oven.`

| # | Slug | Title | Body |
|---|---|---|---|
| 01 | `hero` | Bakersfield | A croissant with character. |
| 02 | `ingredients` | Four simple things | Flour, butter, water and yeast. Every croissant starts here. |
| 03 | `dough` | Into the dough | The four come together and the dough turns smooth. |
| 04 | `lamination` | Layer by layer | Butter is folded in, again and again. Each fold makes new layers. |
| 05 | `proof` | Time to rise | The croissant takes its shape. Then it rests and grows. |
| 06 | `bake` | Golden in the oven | The oven glows. The croissant turns a deep golden brown. |
| 07 | `mustache` | The finishing touch | One fine French moustache. Now it is a Bakersfield. |
| 08 | `visit` | Come say bonjour | The croissant is ready. So are we. |

Other strings on `/`:

- Skip link: `Skip to content`
- Hero scroll hint: `Scroll`
- Logo alt text: `Bakersfield logo: a pixel croissant with a moustache`
- Story section label: `The croissant story`
- Visit button: `Come say bonjour` (`href="#"`)
- Visit secondary link: `See the baker's view` (`href="/pov"`)
- Footer: `© Bakersfield <year>` (the year is computed at build time)
- Rail navigation label: `Beats`. Each dot label: `<n>. <beat title>`.

## 7. Copy for `/pov` (first-person version) — use exactly

Page metadata: title `Bakersfield — the baker's view`, description
`Follow a Bakersfield croissant from flour to oven, filmed from the baker's side of the counter.`

| # | Slug | Title | Body |
|---|---|---|---|
| 01 | hero | Bakersfield | From the baker's side of the counter. |
| 02 | `ingredients` | Four simple things | Flour, butter, water and yeast. Nothing else is needed. |
| 03 | `dough` | Into the dough | Water meets flour. A few turns, and it comes together. |
| 04 | `lamination` | Layer by layer | Butter is folded in, again and again. This is where the flakes come from. |
| 05 | `proof` | Shape and rest | One cut, one roll. Then time does the work. |
| 06 | `bake` | Into the oven | It rises, it opens, it turns gold. |
| 07 | `mustache` | The finishing touch | One fine moustache, in dark chocolate. Now it is a Bakersfield. |
| — | outro | Come say bonjour | The croissant is ready. So are we. |

Other strings on `/pov`:

- Beat counter format: `02 / 07` … `07 / 07`
- Hero scroll hint: `Scroll`
- Story alt text: `A first-person view of a croissant being made on a marble worktop, from flour to a golden bake.`
- Outro button: `Come say bonjour` (`href="#"`)
- Outro secondary link: `See the pixel version` (`href="/"`)
- Footer: `© Bakersfield <year>`
- Rail navigation label: `Story steps`. Each dot label: `<beat title>, step <n> of 6`.

## 8. Status of the copy

All copy was written as a draft for the client and has not been changed by the client. The
client has not supplied contact details. Keep the text exactly as above for an identical
rebuild.
