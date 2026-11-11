# 07 - Verification checklist

Purpose: a rebuilder can run these checks against a copy of the site to prove it matches the original. Numbers marked "derived" come from reading the code. Numbers marked "measured" were taken by running a production build of the original (`next build` then `next start`) in headless Google Chrome driven by Playwright 1.63 (fine pointer, no touch, `deviceScaleFactor` 1, fast local network) in a scratch copy of the repository. Where a check differs between derived and measured, both are stated.

Selectors in this file are read from the code: home story `#story`; POV story `section[aria-labelledby="pov-story-title"]` (the POV story `<section>` has no `id`); caption panels are the parent `div` of each `h2[id$="-title"]` inside `#story` (home) and of each `h3` inside the POV story section; progress cells are `[data-state]` inside the story (`past`, `current`, `future`). CSS class names are hashed by CSS Modules, so do not select by class.

---

## 1. Build and static checks

Run from the repository root:

| Command | Expected |
|---|---|
| `npm install` | installs the exact pinned versions in `package.json` |
| `npm run lint` (`eslint src eslint.config.mjs next.config.mjs`) | no output, exit 0 |
| `npx tsc --noEmit --incremental false` | no output, exit 0 |
| `npm run build` (`next build`) | succeeds. Route table: `/` (static, ~5.85 kB page JS, 153 kB first load), `/_not-found`, `/apple-icon.png`, `/icon.png`, `/pov` (static, ~5.91 kB, 153 kB first load); shared first-load JS 102 kB. All routes prerendered (`○ Static`). |
| `npm run start` (`next start -p 3000`) | serves on port 3000 |

Routes: exactly two pages, `/` and `/pov`. `/icon.png` and `/apple-icon.png` come from `src/app/icon.png` (64x64) and `src/app/apple-icon.png` (180x180). Any other path is the Next 404.

Page metadata to check in the served HTML:

| Route | `<title>` | `<meta name="description">` |
|---|---|---|
| `/` | `Bakersfield` | `Bakersfield is a bakery. Follow the croissant from flour to oven.` |
| `/pov` | `Bakersfield — the baker's view` (em dash, straight apostrophe) | `Follow a Bakersfield croissant from flour to oven, filmed from the baker's side of the counter.` |

Both: `<html lang="en">`, `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>`, `<meta name="theme-color" content="#f6e7ca"/>`, apple web app title `Bakersfield`, status bar style `default`, a `link rel="icon"` (`sizes="64x64"`) and `link rel="apple-touch-icon"` (`sizes="180x180"`), and a first element `<a class="skip-link" href="#main">Skip to content</a>` in `<body>`.

Home preload tags in `<head>` (React 19 `preload()` output; checked in the built HTML):
`<link rel="preload" href="/frames/ingredients/0001.webp?v=2" as="image" fetchPriority="low" media="(min-width: 768px)"/>` and `<link rel="preload" href="/frames-sm/ingredients/0001.webp?v=2" as="image" fetchPriority="low" media="(max-width: 767px)"/>`, plus `<link rel="preload" as="image" href="/brand/logo-mark.webp?v=2" fetchPriority="high"/>` (from the hero image). `/pov` has no `preload()` calls of its own.

---

## 2. Cache headers (from `next.config.mjs`, measured with `curl -I` against `next start`)

| Path | Expected `Cache-Control` |
|---|---|
| `/frames/<slug>/<file>.webp` (e.g. `/frames/bake/0001.webp?v=2`) | `public, max-age=31536000, immutable` |
| `/frames-sm/<slug>/<file>.webp` | `public, max-age=31536000, immutable` |
| `/brand/logo-mark.webp` | `public, max-age=31536000, immutable` |
| `/pov/<slug>/<file>.webp` (e.g. `/pov/bake/0001.webp?v=2`) | `public, max-age=31536000, immutable` |
| `/pov-sm/<slug>/<file>.webp` | `public, max-age=31536000, immutable` |
| `/` page HTML | must NOT contain `immutable`. Measured with `next start`: `s-maxage=31536000` (Next default for prerendered pages). Measured on the live Vercel deployment: `public, max-age=0, must-revalidate`. |
| `/pov` page HTML | must NOT contain `immutable` and must not match the `/pov/:slug/:file(.+\.webp)` rule (it does not: that rule needs two more path segments ending in `.webp`). Measured with `next start`: `s-maxage=31536000`. Measured on the live Vercel deployment: `public, max-age=0, must-revalidate`. |
| `/icon.png`, `/apple-icon.png` | Next default for metadata image routes (not from `next.config.mjs`), measured `public, immutable, no-transform, max-age=31536000` (URL carries a content hash query). |

Every `.webp` response during a full page session (measured: 104 responses on `/pov` at 1440x900) has exactly `public, max-age=31536000, immutable`. `poweredByHeader: false` means no `X-Powered-By` header.

Every image URL requested by the page must carry `?v=2` (`ASSET_VERSION = '2'`). Measured: after a full scroll at 390x844 on both routes, 0 of the `.webp` requests lacked `?v=2`. This includes the hero images, posters, frame URLs, the logo, and the `/pov` outro background (`url('/pov/ingredients/0001.webp?v=2')` / `url('/pov-sm/ingredients/0001.webp?v=2')` in CSS, which is hard-coded).

---

## 3. Which frame folder and how many frames

Rules (derived from `src/lib/device.ts` and the story components):
- Small set (`/frames-sm`, `/pov-sm`) is used when `wantsSmallFrames()` is true: `PHONE_QUERY` matches (`(max-width: 767px), (max-width: 932px) and (max-height: 500px)`), or `navigator.connection.saveData === true`, or `effectiveType` is `slow-2g`, `2g` or `3g`. Otherwise the full set (`/frames`, `/pov`).
- Frames load only for the focus segment and the next one. At page load the focus segment is segment 0 (`ingredients`), so segments 0 and 1 (`ingredients`, `dough`) are fetched completely and nothing else.
- Frames per segment: home full 60, home small 41, POV full 51, POV small 39. Plus `poster.webp` in the first folder (used by the poster `<img>`), plus `brand/logo-mark.webp` (hero logo on `/`, tile in the POV hero).
- Derivation of distinct `.webp` URLs at load (after network idle):
  - Home, full set: `2 x 60` frames `+ 1` poster `+ 1` logo = `122`. (The preloaded `0001.webp` is the same URL as frame 1, so it adds nothing.)
  - Home, small set: `2 x 41 + 1 + 1 = 84`.
  - POV, full set: `2 x 51 + 1 + 1 = 104` (the hero image is frame `0001`, same URL; the story poster is `/pov/ingredients/poster.webp`).
  - POV, small set: `2 x 39 + 1 + 1 = 80`.
- After scrolling through the whole story slowly (each segment focused for about a second): every frame loads: home full `6 x 60 + 2 = 362`, home small `6 x 41 + 2 = 248`, POV full `6 x 51 + 2 = 308`, POV small `6 x 39 + 2 = 236`. All four values were measured exactly. A fast jump can skip middle segments (the loader only fetches the focus segment and the one after it), so lower totals after a fast jump are expected.
- The first requests in the log: home starts `0001, 0002, ...` of `/frames/ingredients/`; POV starts with the first frame of the next segment (`/pov/dough/0001.webp`) then `ingredients/0001...` (edge frame first).
- No-frame cases: reduced motion loads no frames (section 8).

### 3.1 Per-viewport expectations (measured, production build, fine pointer, headless Chrome)

`pin length` = `Math.round(vh * k * 6)` with `k = 1.3`, or `0.85` when `PHONE_QUERY` matches; `vh = window.innerHeight` for a fine pointer. `pin start` is the pin spacer's document top. `docH` is `document.documentElement.scrollHeight`.

**Route `/`**

| Viewport | Frame folder requested | Distinct `.webp` at load | Pin length | Pin start | docH | Notes |
|---|---|---|---|---|---|---|
| 1440x900 | `/frames` (`ingredients` 61 incl. poster, `dough` 60) | 122 | 7020 | 1026 | 9846 | Lenis active (`html.lenis`); canvas backing store 774x774 |
| 1920x1080 | `/frames` | 122 | 8424 | 1231.19 | 11815 | |
| 768x1024 | `/frames` | 122 | 7987 | 1167.36 | 11202 | tablet portrait: side-by-side layout, rail overlaps card edge |
| 430x932 | `/frames-sm` (`ingredients` 42 incl. poster, `dough` 41) | 84 | 4753 | 1062.47 | 7679 | rail hidden |
| 390x844 | `/frames-sm` | 84 | 4304 | 962.16 | 6954 | |
| 320x568 | `/frames-sm` | 84 | 2897 | 647.52 | 4681 | |
| 844x390 | `/frames-sm` | 85 (84 plus the unused full `0001.webp`) | 1989 | 613.19 | 3502 | console warning, see section 9 |

**Route `/pov`**

| Viewport | Frame folder requested | Distinct `.webp` at load | Pin length | Pin start | docH |
|---|---|---|---|---|---|
| 1440x900 | `/pov` (`ingredients` 52 incl. poster, `dough` 51) | 104 | 7020 | 900 | 9720 |
| 1920x1080 | `/pov` | 104 | 8424 | 1080 | 11664 |
| 768x1024 | `/pov` | 104 | 7987 | 1024 | 11059 |
| 430x932 | `/pov-sm` (`ingredients` 40 incl. poster, `dough` 39) | 80 | 4753 | 932 | 7549 |
| 390x844 | `/pov-sm` | 80 | 4304 | 844 | 6836 |
| 320x568 | `/pov-sm` | 80 | 2897 | 568 | 4601 |
| 844x390 | `/pov-sm` | 80 | 1989 | 390 | 3159 |

(`docH` on `/` = pin start + 100svh + pin length + 100svh visit section, e.g. 1026 + 900 + 7020 + 900 = 9846. On `/pov` the same with pin start = 100svh hero, e.g. 900 + 900 + 7020 + 900 = 9720.) Home pin start is fractional because the lead band is `14svh` (`0.14 x 900 = 126`, plus the 900px hero = 1026). At 844x390 the home hero is taller than the viewport (content plus `72px`/`104px` padding), so the pin start is 613.19 rather than `1.14 x 390`.

On a real touch device (`pointer: coarse`) `vh` is the `100svh` height (smallest viewport) and Lenis is not started. Measured with an emulated touch phone (`hasTouch`, `isMobile`, scale 3, 390x844): no `html.lenis`, pin length 4304, canvas backing store 716x716 (358px frame x DPR cap 2).

Canvas backing-store sizes (measured): home 1440x900 -> `774 x 774`; POV 1440x900 -> `1440 x 900`; derived: small set caps the longer side at `2 x nativeWidth` = 960 (home) or 1280 (POV).

### 3.2 Layout checks per viewport (derived from CSS, geometry in `05-design-and-motion.md`)

| Viewport | Home story | POV story |
|---|---|---|
| 1440x900 | frame 774x774 left, card 448 wide right, 43.2 gap, 8-dot rail at right edge (x about 1382-1428) | full-bleed footage, caption card bottom-left (left 64.8, bottom 54, width 400), 6-dot rail right edge |
| 1920x1080 | frame 928.8, gap 56, card 448 | caption left 72, bottom 64 |
| 768x1024 | frame 414.72, gap 23.04, card 280, rail visible | portrait layout: 16:9 frame full width (432px tall) with copy underneath on cream, no rail |
| 430x932 | stacked: frame 398 square (lifted 79.6), card 100% wide up to 520, no rail | portrait stacked, frame 430x241.9 |
| 390x844 | frame 358 (lifted 71.6) | frame 390x219.4, stage padding top 33.76, bottom 101.28 |
| 320x568 | frame 261.28 (lifted 52.26) | frame 320x180 |
| 844x390 | row: frame 335.4 left, card 354.48 right, no rail | full-bleed footage, caption card left `max(16px, safe-left)`, bottom `max(14px, safe-bottom)`, width 264 (`min(264px, 40vw)`), no rail; hero pill bottom-right |

---

## 4. Deep links

Pin spacer maths (both routes): `y(i) = start + (i + 0.005) / 6 * length`, `i` = 0..5 in the order `ingredients, dough, lamination, proof, bake, mustache`. Measured at 1440x900 after opening the URL with the hash and waiting 1.5 s: `scrollY` equals the formula exactly and exactly one panel is visible, the matching one.

| Route | URL | Expected `window.scrollY` (1440x900) | Visible panel |
|---|---|---|---|
| `/` | `/#beat-ingredients` | 1032 | `Four simple things` (`02`) |
| `/` | `/#beat-dough` | 2202 | `Into the dough` |
| `/` | `/#beat-lamination` | 3372 | `Layer by layer` |
| `/` | `/#beat-proof` | 4542 | `Time to rise` |
| `/` | `/#beat-bake` | 5712 | `Golden in the oven` |
| `/` | `/#beat-mustache` | 6882 | `The finishing touch` |
| `/pov` | `/pov#pov-ingredients` | 906 | `Four simple things` (`02 / 07`) |
| `/pov` | `/pov#pov-dough` | 2076 | `Into the dough` |
| `/pov` | `/pov#pov-lamination` | 3246 | `Layer by layer` |
| `/pov` | `/pov#pov-proof` | 4416 | `Shape and rest` |
| `/pov` | `/pov#pov-bake` | 5586 | `Into the oven` |
| `/pov` | `/pov#pov-mustache` | 6756 | `The finishing touch` |

Other deep-link rules:
- Home `#beat-hero` and `#beat-visit` are not handled by the story code; the browser jumps to the elements with those ids (`section#beat-hero`, `section#beat-visit`).
- Home in-page links (`a[href^="#beat-"]`: hero Scroll pill `#beat-ingredients`, rail dots) are intercepted by `SmoothScroll` and scrolled via Lenis (`duration: 1.2`) or `window.scrollTo({ behavior: 'smooth' })` when Lenis is off. Left click only, no modifier keys.
- POV: `hashchange` re-runs the jump; `a[href^="#pov-"]` clicks (hero Scroll pill `#pov-ingredients`) and rail buttons scroll to `y(i)`; with reduced motion the `#pov-<slug>` target is the `li` in the list, native jump.
- Rail clicks: home rail has 8 links (`#beat-hero ... #beat-visit`); POV rail has 6 buttons; after the scroll ends the clicked dot is the active one (`aria-current="step"`).

---

## 5. Exactly-one-copy-panel invariant

At rest, exactly one caption panel has `visibility: visible` and `opacity` > 0.99. Measured at 1440x900 on both routes: scrolling to the middle of each segment (`p = (i + 0.5) / 6`, waiting 900 ms) shows panel `i` only and exactly one progress cell with `data-state="current"`. After a burst of seven jumps 40 ms apart (`0.05, 0.95, 0.3, 0.75, 0.1, 0.6, 0.5`) plus 1.2 s wait, exactly one panel remained (index 3, since `0.5 * 6 = 3.0` resolves to segment 3 through the `1e-9` epsilon).

During a transition at most two panels are visible: the incoming one and the previous one (home out-tween 0.18 s, POV 0.16 s). All other panels are set to `autoAlpha: 0` at once.

Check code:

```js
const visible = await page.evaluate((sel) =>
  [...document.querySelectorAll(sel)].map(h => h.parentElement)
    .filter(p => getComputedStyle(p).visibility !== 'hidden' && +getComputedStyle(p).opacity > 0.99).length,
  route === '/' ? '#story h2[id$="-title"]' : 'section[aria-labelledby="pov-story-title"] h3');
// expect visible === 1 after a 1 s wait
```

Zone checks: before the pin (`scrollY < start`) all six progress cells are `data-state="future"`; after the pin (`scrollY >= start + length`) all are `future` again (`zone !== 'story'`). Home rail active dot (0-based index): `0` in the hero zone, `segment + 1` in the story zone, `7` in the visit zone (`active = zone === 'hero' ? 0 : zone === 'visit' ? LAST : segment + 1`).

---

## 6. Frame-engine behaviours to verify

1. `canvas` exists inside the story media box on both routes with `role="img"` and `aria-label` equal to the story alt text; it has the `hidden` attribute until the first frame decodes; the poster `<img>` is removed once frames show.
2. Scrolling inside a segment changes the drawn frame; with a segment's mid-progress the frame index is `offset + round(0.5 * (count - 1))` (home full: segment-local frame 29 or 30 of 0..59, depending on float rounding of `0.5 * 59 = 29.5`).
3. POV cross-fade windows: global progress `(0.66, 0.673333)` (proof to bake) and `(0.826667, 0.84)` (bake to mustache). At `p = 0.6667` the canvas shows a 50% blend of the last proof frame and the first bake frame (`alpha = smoothstep(0.5) = 0.5`). Outside windows the output is a single frame. Scrubbing back through a window reverses the blend.
4. No drawing happens while idle: at most one `requestAnimationFrame` is scheduled per target change (inspect by wrapping `requestAnimationFrame`; none while the page is not scrolling).
5. Frames are fetched only after the stage is within `150%` of the viewport (`rootMargin: '150% 0px 150% 0px'`); concurrency 6 (full set) and 4 (small set).
6. If the poster file is missing the story shows the decorative logo on the stage colour instead of an image (alt `""`).

---

## 7. No horizontal scroll

At all seven viewports on both routes, `document.documentElement.scrollWidth === document.documentElement.clientWidth` (measured: 1440, 1920, 768, 430, 390, 320, 844 all equal). `body` has `overflow-x: hidden; overflow-x: clip`.

---

## 8. Reduced motion (`prefers-reduced-motion: reduce`)

Measured with Playwright `reducedMotion: 'reduce'` at 1440x900 and 390x844:
- No `canvas`, no `.pin-spacer`, no `html.lenis` class on either route. No frame requests.
- Home: `#story` is `<section id="story" aria-label="The croissant story">` containing an `<ol>` of 6 `li#beat-<slug>`, each with a lazy still (`/frames/<slug>/poster.webp?v=2` or `/frames-sm/...` on phones), the number, an `h2` and the body. The 8-dot rail still shows at >= 768 wide and follows the item in view (IntersectionObserver band `-45%`). Network: only the logo, the preloaded `0001.webp`, and the lazy posters (measured 4 `.webp` URLs on the first screen, up to 8 total after scrolling to the end).
- POV: a `section[aria-labelledby="pov-story-title"]` with `ol > li#pov-<slug>` (6), each a lazy still (`/pov/<slug>/poster.webp?v=2`, `/pov-sm/...` on phones) with `02 / 07` style numbers; no rail. Measured 5 to 6 `.webp` at load, 8 total.
- Hero animations become 300 ms opacity fades (home) or none (POV hero `.rise` is only defined under `no-preference`). The home visit card is never armed, so it is simply visible.
- Programmatic scrolls use `behavior: 'auto'`.

---

## 9. Console

Expected on every route and viewport: no errors, no `pageerror`. The original is NOT free of "preloaded but not used" warnings in these cases (reproduced):
- `/` at 844x390 (short landscape phone): `The resource .../frames/ingredients/0001.webp?v=2 was preloaded using link preload but not used within a few seconds from the window's load event...`
- `/` with reduced motion at 1440x900 (`.../frames/ingredients/0001.webp?v=2`) and at 390x844 (`.../frames-sm/ingredients/0001.webp?v=2`).
- Same mechanism for data-saver / 2g-3g connections on `/` (not tested).
No warning on `/pov` in any tested case, and none on `/` at 1440x900, 1920x1080, 768x1024, 430x932, 390x844, 320x568 with motion enabled (measured, 8 s wait). A rebuild that is meant to be warning-free must change the preload logic; a rebuild that must match exactly keeps these warnings.

---

## 10. No-JavaScript behaviour

With JavaScript disabled (Playwright `javaScriptEnabled: false`):
- Home visit card: the server HTML has `data-shown="false"` and no `data-armed`, so the card, the `Come say bonjour` button (`a[href="#"]`, visible, measured box about 219 x 57 at 1440x900, opacity 1) and the `See the baker's view` link are visible. `RevealOnView` hides content only when its client script arms it.
- POV outro: CTA visible (measured about 220 x 52).
- Both pages render hero, poster and first caption panel (the first `.panel` is visible by CSS); no pin, no frames. The hero entrance animations are CSS and still run.

---

## 11. Accessibility smoke checks

- First Tab stops on `Skip to content` (slides to `translateY(0)`, `min-height: 48px`); Enter jumps to `#main`.
- Home: nav `Beats` with 8 links labelled `1. Bakersfield` ... `8. Come say bonjour`; the active one has `aria-current="step"`. POV: nav `Story steps` with 6 buttons labelled `Four simple things, step 1 of 6` ... `The finishing touch, step 6 of 6`.
- Hit targets: rail links/buttons 44x44; CTA buttons >= 52px tall; secondary links >= 44px tall; hero scroll pills >= 44px tall.
- Heading order: home `h1` (hero) then `h2`s; POV `h1`, hidden `h2` `How a Bakersfield croissant is made`, `h3` captions, `h2` outro.
- Colour pairs: see the contrast table in `05-design-and-motion.md` (`--ink` on `--cream` 11.46:1).

---

## 12. Playwright skeleton (CommonJS)

This script was run unchanged (apart from the browser path and port) against a production build. It computes the story scroll position for a given progress on each route and takes screenshots. `Playwright` must have a Chromium available (here `executablePath` was set to a system Chrome). Create the `shots/` folder first.

```js
// verify.js  -  run:  mkdir -p shots && BASE_URL=http://localhost:3000 node verify.js
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const ROUTES = {
  '/':    { story: '#story', hash: '#beat-' },
  '/pov': { story: 'section[aria-labelledby="pov-story-title"]', hash: '#pov-' },
};
const VIEWPORTS = [[1440, 900], [1920, 1080], [768, 1024], [430, 932], [390, 844], [320, 568], [844, 390]];

/** Story pin start (document y) and pin length (px), read from the GSAP pin spacer. */
async function storyBounds(page, route) {
  return page.evaluate((sel) => {
    const section = document.querySelector(sel);
    const spacer = section.parentElement; // GSAP wraps the pinned section in .pin-spacer
    return {
      start: spacer.getBoundingClientRect().top + window.scrollY,
      length: spacer.offsetHeight - section.offsetHeight,
    };
  }, ROUTES[route].story);
}

/** Scroll to global story progress p (0..1) and let the panel tweens finish. */
async function scrollToProgress(page, route, p) {
  const { start, length } = await storyBounds(page, route);
  await page.evaluate((y) => window.scrollTo(0, y), start + p * length);
  await page.waitForTimeout(1000);
}

(async () => {
  const browser = await chromium.launch();
  for (const route of Object.keys(ROUTES)) {
    for (const [width, height] of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      const problems = [];
      page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push(m.text()); });
      page.on('pageerror', (e) => problems.push(String(e)));
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      // middle of each of the six segments: p = (i + 0.5) / 6
      for (const [i, p] of [0.0833, 0.25, 0.4167, 0.5833, 0.75, 0.9167].entries()) {
        await scrollToProgress(page, route, p);
        await page.screenshot({ path: `shots/${route === '/' ? 'home' : 'pov'}-${width}x${height}-seg${i + 1}.png` });
      }
      console.log(route, width + 'x' + height, 'console problems:', problems);
      await context.close();
    }
  }
  await browser.close();
})();
```

Notes for using it:
- Expected output: empty `problems` arrays except `/` at 844x390 (preload warning, section 9). 88 screenshots (2 routes x 7 viewports x 6).
- Progress for a specific beat start (what deep links use): `(i + 0.005) / 6`. Progress to land in the middle of segment `i`: `(i + 0.5) / 6`.
- Pin spacer class: GSAP names it `pin-spacer`; the section is its only child. `length` should equal `Math.round(vh * k * 6)` from section 3.1; assert that equality as a test of the pin formula.
- To test the stable-viewport branch use `browser.newContext({ viewport, hasTouch: true, isMobile: true, deviceScaleFactor: 3 })`: Lenis must not start and `pinLength` uses `100svh`.
- To test reduced motion use `browser.newContext({ viewport, reducedMotion: 'reduce' })`.
- Network assertions: `page.on('request', r => /\.webp/.test(r.url()) && urls.add(r.url()))`, then compare `urls.size` with section 3.1, and check every URL ends with `?v=2`.
- Header assertions: `page.on('response', r => /\.webp/.test(r.url()) && r.headers()['cache-control'] === 'public, max-age=31536000, immutable')`.
- Lenis drives smooth wheel scrolling only; `window.scrollTo` jumps are applied directly and ScrollTrigger follows. If you use `page.mouse.wheel`, wait for Lenis (about 1.1 s) before reading state.

---

## 13. Pass/fail summary list

1. `npm run lint` and `tsc` clean; `next build` passes with two static page routes.
2. Titles, descriptions, viewport and theme colour match section 1.
3. Cache headers match section 2; HTML not immutable; all image URLs end `?v=2`.
4. Per-viewport frame folder, load count, pin length match section 3.1.
5. All twelve deep links land on the formula position with one panel visible.
6. After fast scrolling, one panel visible; progress cells and rail match the segment.
7. Reduced motion: list of stills, no canvas, no Lenis, no frame requests.
8. No JS: visit CTA and POV CTA visible.
9. No horizontal scroll at the seven viewports.
10. Console: no errors; the preload warnings in section 9 occur only in the listed cases.
11. Visual check: compare screenshots from section 12 with the layout table in section 3.2.
