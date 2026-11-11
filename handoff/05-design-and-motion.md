# 05 - Design and motion

All values come from the CSS files in `/home/user/bakersfield/src`. CSS files are `src/app/globals.css` and the CSS Modules next to each component. Class names below are the module's local names (Next hashes them at build time). Colour contrast ratios were computed from the hex values with the WCAG formula.

---

## 1. Global CSS (`src/app/globals.css`)

### 1.1 Custom properties on `:root`

`color-scheme: light;` (comment: the brand is light and warm, only the light scheme is used; no dark mode exists).

**Colour**

| Property | Value | Note |
|---|---|---|
| `--cream` | `#f6e7ca` | page background |
| `--stage` | `#f7e3b8` | story stage background; "Matches the frame background" |
| `--butter` | `#fad488` | |
| `--honey` | `#f9b35f` | selection, progress fill, wordmark shadow |
| `--amber` | `#ea9346` | defined, not used elsewhere in CSS |
| `--bake` | `#d06c2e` | focus ring, progress current end colour |
| `--crust` | `#a8572d` | beat numbers (home), hover |
| `--ink` | `#462217` | text colour |
| `--warm-mid` | `#f7e6c2` | "Between stage and cream. The calm base of the Visit section." |
| `--bg` | `var(--cream)` | body background |
| `--fg` | `var(--ink)` | body colour |
| `--surface` | `var(--butter)` | defined, not used |
| `--accent` | `var(--bake)` | defined, not used |
| `--accent-strong` | `var(--crust)` | `.num` colour (home) |
| `--focus` | `var(--bake)` | global focus ring colour |

**Fonts**

| Property | Value |
|---|---|
| `--font-display` | `'Pixelify Sans', ui-monospace, monospace` |
| `--font-body` | `'DM Sans Variable', system-ui, -apple-system, 'Segoe UI', sans-serif` |

**Type scale** (display sizes fluid; comment says "body steps are fixed to the same ratio")

| Property | Value |
|---|---|
| `--text-small` | `clamp(0.875rem, 0.85rem + 0.12vw, 0.9375rem)` |
| `--text-body` | `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)` |
| `--text-lead` | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` |
| `--text-label` | `clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)` |
| `--text-card-title` | `clamp(1.875rem, 1.3rem + 2.2vw, 3.25rem)` |
| `--text-title` | `clamp(2.25rem, 1.2rem + 4.5vw, 5.5rem)` (defined, not used by any rule) |
| `--text-display` | `clamp(3.5rem, 1.5rem + 9vw, 11rem)` |
| `--text-num` | `clamp(2rem, 1.2rem + 2vw, 3.25rem)` |

**Tracking**

| Property | Value |
|---|---|
| `--track-display` | `-0.01em` (defined, not used) |
| `--track-lead` | `-0.005em` |
| `--track-body` | `0` |
| `--track-small` | `0.01em` |

**Glass**

| Property | Value |
|---|---|
| `--glass-warm` | `rgba(255, 248, 232, 0.55)` |
| `--glass-light` | `rgba(255, 255, 255, 0.6)` |
| `--glass-ink` | `rgba(70, 34, 23, 0.9)` |
| `--glass-border` | `rgba(255, 255, 255, 0.7)` |
| `--glass-border-ink` | `rgba(255, 240, 220, 0.26)` |
| `--glass-hl` | `inset 0 1px 0 rgba(255, 255, 255, 0.85)` |
| `--glass-hl-ink` | `inset 0 1px 0 rgba(255, 232, 200, 0.28), inset 0 -1px 0 rgba(0, 0, 0, 0.16)` |
| `--glass-blur` | `saturate(180%) blur(18px)` |
| `--glass-blur-sm` | `saturate(170%) blur(12px)` |
| `--glass-warm-solid` | `#fbf1de` (opaque stand-in) |
| `--glass-light-solid` | `#fffaf0` (opaque stand-in) |
| `--glass-ink-solid` | `#4a2a1e` (opaque stand-in) |

**Shadow** (comment: tinted with ink, never grey)

| Property | Value |
|---|---|
| `--shadow-soft` | `0 1px 2px rgba(70, 34, 23, 0.06), 0 8px 22px -12px rgba(70, 34, 23, 0.22)` |
| `--shadow-lift` | `0 2px 4px rgba(70, 34, 23, 0.08), 0 16px 34px -14px rgba(70, 34, 23, 0.4)` |
| `--shadow-panel` | `0 1px 1px rgba(70, 34, 23, 0.05), 0 10px 28px -14px rgba(70, 34, 23, 0.26), 0 36px 70px -40px rgba(70, 34, 23, 0.3)` |

**Radius**

| Property | Value |
|---|---|
| `--r-sm` | `10px` (defined, not used) |
| `--r` | `16px` |
| `--r-lg` | `24px` |
| `--r-pill` | `999px` |

**Easing**

| Property | Value |
|---|---|
| `--ease-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

**Layout**

| Property | Value |
|---|---|
| `--gutter` | `16px` |
| `--touch` | `44px` (minimum hit target) |

Note: the POV CSS files reference these tokens with fallbacks, e.g. `var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1))`. Because `--ease-out` is defined globally, the fallback values are never used; the effective POV easings are `cubic-bezier(0.4, 0, 0.2, 1)` and `cubic-bezier(0.34, 1.56, 0.64, 1)`.

### 1.2 Global rules (in file order)

| Selector | Declarations |
|---|---|
| `*, *::before, *::after` | `box-sizing: border-box;` |
| `html` | `-webkit-text-size-adjust: 100%; text-size-adjust: 100%;` |
| `html.lenis, html.lenis body` | `height: auto;` |
| `.lenis.lenis-smooth` | `scroll-behavior: auto !important;` |
| `.lenis.lenis-stopped` | `overflow: hidden;` |
| `body` | `margin: 0; background-color: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: var(--text-body); line-height: 1.6; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; overflow-x: hidden; overflow-x: clip; font-variant-ligatures: no-common-ligatures;` |
| `img, canvas` | `display: block; max-width: 100%;` |
| `[hidden]` | `display: none !important;` |
| `a, button` | `-webkit-tap-highlight-color: transparent; touch-action: manipulation;` (comment: no double-tap zoom delay, no grey flash; press states are shown instead) |
| `h1, h2, h3, p` | `margin: 0;` |
| `h1, h2, h3` | `text-wrap: balance;` |
| `p` | `text-wrap: pretty;` |
| `[id]` | `scroll-margin-top: var(--gutter);` |
| `::selection` | `background: var(--honey); color: var(--ink);` |
| `:focus-visible` | `outline: 2px solid var(--focus); outline-offset: 3px;` |

**Ligature rule and why.** `font-variant-ligatures: no-common-ligatures;` on `body` (inherited). The code comment: "Pixelify Sans draws its "fi" ligature like an "A". Keep letters separate." Without it, words such as "finishing" and "fine" render the "fi" pair as a glyph that looks like "A" in the pixel font. The rule must stay on `body` so it reaches all Pixelify text (wordmark, titles, numbers).

`overflow-x: hidden; overflow-x: clip;` is a progressive pair: `clip` replaces `hidden` where supported, and prevents horizontal scroll without creating a scroll container.

**`.skip-link`** (class used in `layout.tsx`): `position: absolute; top: var(--gutter); left: var(--gutter); z-index: 100; min-height: 48px; display: inline-flex; align-items: center; padding: 0 22px; border-radius: var(--r-pill); background: var(--glass-ink); color: var(--cream); border: 1px solid var(--glass-border-ink); box-shadow: var(--glass-hl-ink), var(--shadow-lift); font-weight: 700; transform: translateY(-200%); transition: transform 300ms var(--ease-out);`. `.skip-link:focus { transform: translateY(0); }`. Inside `@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))`: `-webkit-backdrop-filter: var(--glass-blur-sm); backdrop-filter: var(--glass-blur-sm);`.

**`.sr-only`** (defined, unused by components): `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;`.

**`@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`**: on `:root` it re-points `--glass-warm: var(--glass-warm-solid); --glass-light: var(--glass-light-solid); --glass-ink: var(--glass-ink-solid);` (opaque surfaces).

**Reduced motion (global):** `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`.

---

## 2. Typography

Families: **Pixelify Sans** (`--font-display`, weight 700 only in use) for the wordmark, section/card titles on the home page, beat numbers on the home page. **DM Sans Variable** (`--font-body`) for all running text, buttons, labels, and all text on `/pov` except the hero wordmark. Body inherits `font-size: var(--text-body)`, `line-height: 1.6`.

Resolved clamp values at 1440 / 1920 / 768 / 430 / 390 / 320 / 844 (px) viewport widths, computed from the expressions:

| Token | 1440 | 1920 | 768 | 430 | 390 | 320 | 844 |
|---|---|---|---|---|---|---|---|
| `--text-display` | 153.6 | 176 | 93.12 | 62.7 | 59.1 | 56 | 99.96 |
| `--text-card-title` | 52 | 52 | 37.7 | 30.26 | 30 | 30 | 39.37 |
| `--text-num` | 48 | 52 | 34.56 | 32 | 32 | 32 | 36.08 |
| `--text-lead` | 22 | 22 | 19.84 | 18.15 | 18 | 18 | 20.22 |
| `--text-body` | 18 | 18 | 17.12 | 16.27 | 16.18 | 16 | 17.31 |
| `--text-small` | 15 | 15 | 14.52 | 14.12 | 14.07 | 14 | 14.61 |
| `--text-label` | 17 | 17 | 16.9 | 16.22 | 16.14 | 16 | 17 |

### 2.1 Home page text roles

| Role (selector) | Family | Size | Weight | Line-height | Letter-spacing | Other |
|---|---|---|---|---|---|---|
| Hero wordmark (`Hero .wordmark`) | display | `var(--text-display)`; at `max-width: 767px`: `clamp(2.25rem, 1.2rem + 7.4vw, 3.5rem)` with `white-space: nowrap` | 700 | `0.92` | `-0.015em` | `color: var(--ink); text-shadow: 4px 4px 0 var(--honey);` |
| Hero tagline (`.tagline`) | body | `var(--text-lead)` | inherited (400) | `1.5` | `var(--track-lead)` | `max-width: 28ch; color: var(--ink)` |
| Hero scroll pill (`.scroll`) | body | `var(--text-small)` | 700 | inherited `1.6` | `0.04em` | |
| Beat number (`StorySection .num`) | display | `var(--text-num)`; `1.75rem` on `max-width: 767px`; `1.5rem` on short landscape phones | 700 | `1` | `0.04em` | `font-variant-numeric: tabular-nums; color: var(--accent-strong)` (crust) |
| Card title (`StorySection .title`) | display | `var(--text-card-title)`; `1.6rem` on phones; `1.5rem` on short landscape | 700 | `1.05` | inherited | `margin-top: 14px` (phone `8px`, short landscape `6px`); `color: var(--ink)` |
| Card body (`StorySection .body`) | body | `var(--text-body)`; `1rem` on phones and short landscape | 400 | `1.55` (short landscape `1.45`) | `var(--track-body)` (0) | `margin-top: 18px` (phone `10px`, short landscape `8px`); `max-width: 34ch` |
| Visit number (`Visit .num`) | display | `var(--text-num)` | 700 | `1` | `0.04em` | tabular-nums; crust |
| Visit title (`Visit .title`) | display | `clamp(2rem, 1.3rem + 3vw, 3.75rem)` | 700 | `1.05` | inherited | `margin-top: 14px` |
| Visit body (`Visit .body`) | body | `var(--text-body)` | 400 | `1.55` | inherited | `margin-top: 18px; max-width: 34ch` |
| Visit button (`.button`) | body | `var(--text-label)` | 700 | inherited | `0.01em` | |
| Visit secondary link (`.secondaryLink`) | body | `var(--text-label)` | 500 | inherited | inherited | underline, `text-decoration-thickness: 1px; text-underline-offset: 5px` |
| Visit footer (`.foot`) | body | `var(--text-small)` | 400 | inherited | `var(--track-small)` | centred |

Computed home sizes: hero wordmark 153.6px at 1440, 176px at 1920 (max), 93.12 at 768, 99.96 at 844 (landscape phone, not covered by the phone rule), and by the phone rule 51.02 at 430, 48.06 at 390, 42.88 at 320. Visit title: 60 at 1440/1920, 43.84 at 768, 33.7 at 430, 32.5 at 390, 32 at 320.

### 2.2 POV page text roles (all DM Sans except the wordmark)

| Role (selector) | Family | Size | Weight | Line-height | Letter-spacing | Other |
|---|---|---|---|---|---|---|
| Hero wordmark (`PovHero .wordmark`) | display (`var(--font-display, 'Pixelify Sans', monospace)`) | `clamp(2.25rem, 1.4rem + 3.4vw, 4.25rem)` | 700 | `1` | `0.01em` | `color: var(--ink, #462217)` |
| Hero line (`.line`) | body | `clamp(1.0625rem, 1rem + 0.5vw, 1.375rem)` | 400 | `1.4` | `-0.005em` | `max-width: 28ch; text-wrap: balance` |
| Hero scroll pill (`.scroll`) | body | `0.9375rem` | 600 | inherited | `0.01em` | |
| Caption number (`PovStory .num`) | body | `0.75rem` (short landscape `0.6875rem`) | 600 | inherited | `0.16em` | `text-transform: uppercase; font-variant-numeric: tabular-nums; color: #8a4522; margin: 0 0 10px` (short landscape `margin-bottom: 6px`) |
| Caption title (`.title`) | body | `clamp(1.75rem, 1.25rem + 1.5vw, 2.625rem)`; portrait: `clamp(1.875rem, 1.2rem + 3.4vw, 2.5rem)`; short landscape `1.5rem` | 600 | `1.04` | `-0.035em` | `margin: 0 0 10px` (short landscape `0 0 6px`); `text-wrap: balance` |
| Caption body (`.body`) | body | `clamp(1rem, 0.95rem + 0.2vw, 1.0625rem)`; short landscape `0.9375rem` | 400 | `1.5` (short landscape `1.4`) | inherited | `margin: 0; max-width: 34ch; text-wrap: pretty` |
| Outro title (`PovOutro .title`) | body | `clamp(2.25rem, 1.2rem + 4.2vw, 4.5rem)` | 600 | `1.02` | `-0.04em` | `text-wrap: balance` |
| Outro body (`.body`) | body | `clamp(1.0625rem, 1rem + 0.4vw, 1.3125rem)` | 400 | `1.45` | inherited | `max-width: 34ch; text-wrap: balance` |
| Outro CTA (`.cta`) | body | `1.0625rem` | 600 | inherited | `0.005em` | |
| Outro secondary (`.secondary`) | body | `1rem` | 500 | inherited | inherited | underlined |
| Outro footer (`.footer`) | body | `0.875rem` | 400 | inherited | inherited | `color: #6b4636; padding-top: 24px; text-align: center` |

Computed POV sizes: hero wordmark 68px at 1440/1920, 48.51 at 768, 37.02 at 430, 36 at 390/320, 51.1 at 844. Caption title (default rule) 41.6 at 1440, 42 at 1920, 31.52 at 768, 28 at 390; portrait rule 40 at 768, 33.82 at 430, 32.46 at 390, 30.08 at 320. Outro title 72 at 1440/1920, 51.46 at 768, 37.26 at 430, 36 at 390/320.

---

## 3. Component CSS modules

Notation: "token" = a `var(--...)` from section 1. Everything is quoted from the files.

### 3.1 `src/components/Hero.module.css` (home hero)

Visual: a full-screen warm cream section with a soft yellow glow behind a centred, floating pixel logo (edges feathered to transparent), a big pixel-font "Bakersfield" with a hard honey drop shadow, a one-line tagline, and a small light-glass "Scroll" pill at the bottom centre.

- `.hero`: `position: relative; isolation: isolate; min-height: 100vh; min-height: 100svh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 72px var(--gutter) 104px; text-align: center; overflow: hidden;`
- `.hero::before` (ambient glow): `content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(42% 38% at 50% 36%, rgba(250, 212, 136, 0.5), rgba(250, 212, 136, 0) 100%), radial-gradient(60% 34% at 50% 100%, rgba(249, 179, 95, 0.16), rgba(249, 179, 95, 0) 100%);`
- `.inner`: `position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: clamp(12px, 2vh, 24px);`
- `.mark`: `width: clamp(160px, 28vw, 300px); aspect-ratio: 1; animation: logoIn 640ms var(--ease-spring) both;`
- `.logo`: `width: 100%; height: 100%; object-fit: contain; -webkit-mask-image: radial-gradient(closest-side, #000 78%, transparent 100%); mask-image: radial-gradient(closest-side, #000 78%, transparent 100%); animation: bob 5s ease-in-out 900ms infinite;`
- `.wordmark`: `font-family: var(--font-display); font-weight: 700; font-size: var(--text-display); line-height: 0.92; letter-spacing: -0.015em; color: var(--ink); text-shadow: 4px 4px 0 var(--honey); animation: fadeUp 480ms var(--ease-out) 80ms both;`
- `.tagline`: `max-width: 28ch; font-size: var(--text-lead); line-height: 1.5; letter-spacing: var(--track-lead); color: var(--ink); animation: fadeUp 480ms var(--ease-out) 200ms both;`
- `.scroll` (pill): `position: absolute; z-index: 1; bottom: calc(14px + env(safe-area-inset-bottom, 0px)); left: 50%; transform: translateX(-50%); min-height: var(--touch); display: inline-flex; align-items: center; gap: 10px; padding: 0 18px 0 20px; border-radius: var(--r-pill); background: var(--glass-light); border: 1px solid var(--glass-border); box-shadow: var(--glass-hl), var(--shadow-soft); color: var(--ink); text-decoration: none; font-weight: 700; font-size: var(--text-small); letter-spacing: 0.04em; animation: fade 440ms var(--ease-out) 360ms both; transition: box-shadow 300ms var(--ease-out), background-color 300ms var(--ease-out); -webkit-backdrop-filter: var(--glass-blur-sm); backdrop-filter: var(--glass-blur-sm);`
- `.scroll:focus-visible { outline-offset: 4px; }`
- `.arrow` (CSS chevron): `width: 8px; height: 8px; margin-top: -3px; border-right: 2px solid var(--ink); border-bottom: 2px solid var(--ink); transform: rotate(45deg); animation: nudge 2.4s ease-in-out 1.2s infinite;`
- `@media (hover: hover)`: `.scroll:hover { background-color: rgba(255, 255, 255, 0.72); box-shadow: var(--glass-hl), var(--shadow-lift); }`
- Keyframes: `logoIn` (`from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: none; }`), `fadeUp` (`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; }`), `fade` (`from { opacity: 0; } to { opacity: 1; }`), `bob` (`0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); }`), `nudge` (`0%, 100% { transform: translate(0, -2px) rotate(45deg); } 50% { transform: translate(0, 2px) rotate(45deg); }`).
- `@media (max-width: 767px)`: `.wordmark { font-size: clamp(2.25rem, 1.2rem + 7.4vw, 3.5rem); white-space: nowrap; }` (stays on one line from 320px wide) and `.scroll { -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }` (lighter blur, no saturate, performance).
- `@media (prefers-reduced-motion: reduce)`: `.mark, .wordmark, .tagline, .scroll { animation: fade 300ms linear both; } .logo, .arrow { animation: none; } .scroll { transition: none; }`

### 3.2 `src/components/StorySection.module.css` (home story)

Visual: a full-screen warm "stage" (`--stage`). Desktop: a square animation frame on the left (edges faded by a mask) and a warm glass card on the right (number, title, body, six-segment progress bar), both centred as a pair. Phone portrait: frame on top (lifted up), card below. Short landscape phone: frame left, card right. Above the section is a 14svh gradient band from cream to stage.

- `.lead`: `height: 14svh; background: linear-gradient(to bottom, var(--cream), var(--stage));`
- `.section`: `position: relative; height: 100vh; height: 100svh; width: 100%; overflow: hidden; background: var(--stage);`
- `@media (min-width: 768px) { .section { background: radial-gradient(22% 60% at 82% 50%, rgba(250, 212, 136, 0.6), rgba(250, 212, 136, 0) 100%), var(--stage); } }` (glow behind the card; kept clear of the frame, which sits left of x = 58%).
- `.anchor`: `position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: hidden; pointer-events: none;`
- `.stage`: `position: relative; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; gap: clamp(20px, 3vw, 56px); padding: 0 var(--gutter);`
- `.media`: `position: relative; flex: 0 0 auto; width: min(86svh, 54vw); aspect-ratio: 1; contain: layout paint; -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent); -webkit-mask-composite: source-in; mask-image: <same two gradients>; mask-composite: intersect;` (the two gradients intersect so all four edges fade over 6%).
- `.poster`: `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain;`
- `.picture`: `display: contents;`
- `.copy, .card` (shared glass): `position: relative; background: var(--glass-warm); border: 1px solid var(--glass-border); border-radius: var(--r-lg); box-shadow: var(--glass-hl), var(--shadow-panel); -webkit-backdrop-filter: var(--glass-blur); backdrop-filter: var(--glass-blur);`
- `@supports (corner-shape: superellipse(2))`: `.copy, .card { corner-shape: superellipse(2.5); }`
- `.copy`: `flex: 0 1 auto; width: clamp(280px, 34vw, 448px); min-width: 0; padding: clamp(24px, 2.6vw, 40px);`
- `.panels`: `display: grid;`. `.panel`: `grid-area: 1 / 1; visibility: hidden; opacity: 0;`. `.panel:first-child`: `visibility: visible; opacity: 1;` (all six panels share one grid cell so the card keeps the height of the tallest panel; before JS the first panel shows).
- `.num`, `.title`, `.body`: see section 2.1 table.
- `.bar`: `margin-top: 30px; display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px;`
- `.cell`: `position: relative; height: 6px; overflow: hidden; border-radius: var(--r-pill); background: rgba(70, 34, 23, 0.12); box-shadow: inset 0 1px 1px rgba(70, 34, 23, 0.1);`
- `.cell::after`: `content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 0; opacity: 0; border-radius: inherit; background: var(--honey); transition: width 480ms var(--ease-out), opacity 280ms var(--ease-out);`
- `.cell[data-state='past']::after`: `width: 100%; opacity: 1;`. `.cell[data-state='current']::after`: `width: 100%; opacity: 1; background: linear-gradient(90deg, var(--honey), var(--bake));`
- Reduced-motion list: `.list { position: relative; background: var(--stage); padding: 56px var(--gutter) 72px; }`, `.listInner { list-style: none; margin: 0 auto; padding: 0; max-width: 880px; display: grid; gap: 56px; }`, `.item { display: grid; gap: 24px; justify-items: center; }`, `.still { width: min(100%, 560px); height: auto; aspect-ratio: 1; object-fit: contain; <same two-gradient mask as .media> }`, `.card { width: min(100%, 560px); padding: clamp(24px, 2.6vw, 40px); }` (plus the shared glass rule above).
- `@media (max-width: 767px)` (phone portrait): `.stage { flex-direction: column; justify-content: center; gap: 12px; padding: 12px var(--gutter) calc(12px + env(safe-area-inset-bottom, 0px)); }`; `.media { --size: min(calc(100vw - 2 * var(--gutter)), 46svh); width: var(--size); transform: translateY(calc(var(--size) * -0.2)); margin-bottom: calc(var(--size) * -0.2); }` (the top of the square is empty cream; the frame is lifted by 20% of its size and the bottom margin cancels the shift so the card stays where it was); `.copy { width: 100%; max-width: 520px; padding: 18px 20px; border-radius: var(--r); -webkit-backdrop-filter: var(--glass-blur-sm); backdrop-filter: var(--glass-blur-sm); }`; `.num { font-size: 1.75rem; }`; `.title { margin-top: 8px; font-size: 1.6rem; }`; `.body { margin-top: 10px; font-size: 1rem; }`; `.bar { margin-top: 16px; }`.
- `@media (max-width: 932px) and (max-height: 500px)` (short landscape phone): `.stage { flex-direction: row; gap: 16px; padding: 12px var(--gutter) calc(12px + env(safe-area-inset-bottom, 0px)); }`; `.media { width: min(86svh, 46vw); }`; `.copy { width: clamp(240px, 42vw, 380px); padding: 16px 18px; border-radius: var(--r); }`; `.num { font-size: 1.5rem; }`; `.title { margin-top: 6px; font-size: 1.5rem; }`; `.body { margin-top: 8px; font-size: 1rem; line-height: 1.45; }`; `.bar { margin-top: 12px; }`. (The copy keeps the base `--glass-blur`; the lighter blur is only in the `max-width: 767px` block.)
- `@media (prefers-reduced-motion: reduce) { .cell::after { transition: none; } }`

### 3.3 `src/components/ScrollSequence.module.css`

`.stage { position: relative; width: 100%; height: 100%; overflow: hidden; background: transparent; }`; `.canvas { position: absolute; inset: 0; width: 100%; height: 100%; }`; `.poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }`; `.fallback { position: absolute; inset: 0; display: grid; place-items: center; background: var(--stage); }`; `.logo { width: min(55%, 320px); height: auto; image-rendering: pixelated; }`.

### 3.4 `src/components/ProgressRail.module.css` (home side rail)

Visual: a slim vertical light-glass capsule fixed to the right edge, vertically centred, with eight small round dots; the active dot stretches into a dark ink pill.

- `.rail`: `position: fixed; right: 12px; top: 50%; z-index: 50; transform: translateY(-50%); display: none;`
- `.list`: `list-style: none; margin: 0; padding: 6px 0; display: flex; flex-direction: column; align-items: center; border-radius: var(--r-pill); background: var(--glass-light); border: 1px solid var(--glass-border); box-shadow: var(--glass-hl), var(--shadow-soft); -webkit-backdrop-filter: var(--glass-blur-sm); backdrop-filter: var(--glass-blur-sm);`
- `.link` (44px hit target): `position: relative; width: var(--touch); height: var(--touch); display: flex; align-items: center; justify-content: center; border-radius: var(--r-pill); text-decoration: none;`
- `.dot`: `display: block; width: 9px; height: 9px; border-radius: var(--r-pill); background: rgba(70, 34, 23, 0.3); transition: height 460ms var(--ease-spring), background-color 240ms var(--ease-out);`
- `.link[data-active='true'] .dot { height: 22px; background: var(--ink); }`; `.link:hover .dot { background: var(--crust); }`; `.link[data-active='true']:hover .dot { background: var(--ink); }` (the hover rules are not wrapped in `(hover: hover)`); `.link:focus-visible { outline: 2px solid var(--bake); outline-offset: -4px; }`
- `@media (min-width: 768px) { .rail { display: block; } }`
- `@media (max-width: 932px) and (max-height: 500px) { .rail { display: none; } }` (comment: it would take the copy's space)
- `@media (prefers-reduced-motion: reduce) { .dot { transition: none; } }`
- Total rail height: `6 + 8*44 + 6 + 2 (border) = 366px`. It is `display: none` below 768px wide. Rail width is 46px (44px link + 1px border each side). At 1440 wide it sits clear of the card (card right edge about 1352.6, rail left edge 1382). At 768 wide the rail spans x = 710 to 756 while the card's right edge is about 742.9, so the rail overlaps the card's right edge by about 33px (computed from the layout formulas, not measured in a browser).

### 3.5 `src/components/Visit.module.css` (home closing section)

Visual: a full-screen calm warm section (stage colour fading to a slightly lighter warm tone, with a yellow glow in the middle) with a centred warm-glass card (number 08, title, body, dark glass button, quiet underlined link) and the copyright line under it.

- `.visit`: `position: relative; isolation: isolate; min-height: 100vh; min-height: 100svh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 88px var(--gutter) calc(32px + env(safe-area-inset-bottom, 0px)); background: radial-gradient(56% 44% at 50% 48%, rgba(250, 212, 136, 0.55), rgba(250, 212, 136, 0) 100%), linear-gradient(180deg, var(--stage) 0%, var(--warm-mid) 26%, var(--warm-mid) 100%); content-visibility: auto; contain-intrinsic-size: auto 100svh;`
- `.card`: `width: min(560px, 100%); padding: clamp(28px, 4vw, 52px); background: var(--glass-warm); border: 1px solid var(--glass-border); border-radius: var(--r-lg); box-shadow: var(--glass-hl), var(--shadow-panel); -webkit-backdrop-filter: var(--glass-blur); backdrop-filter: var(--glass-blur); text-align: left;` plus `@supports (corner-shape: superellipse(2)) { .card { corner-shape: superellipse(2.5); } }`.
- `.num`, `.title`, `.body`: section 2.1.
- `.actions { margin-top: 32px; }`; `.card[data-armed='true'] .actions { opacity: 0; transform: translateY(12px); }`; `.card[data-shown='true'] .actions { opacity: 1; transform: none; transition: opacity 520ms var(--ease-out) 180ms, transform 620ms var(--ease-spring) 180ms; }`
- `.button` (dark warm glass pill): `position: relative; isolation: isolate; overflow: hidden; min-height: 52px; display: inline-flex; align-items: center; justify-content: center; padding: 14px 32px; border-radius: var(--r-pill); background: var(--glass-ink); color: var(--cream); border: 1px solid var(--glass-border-ink); box-shadow: var(--glass-hl-ink), var(--shadow-lift); -webkit-backdrop-filter: var(--glass-blur); backdrop-filter: var(--glass-blur); font-family: var(--font-body); font-weight: 700; font-size: var(--text-label); letter-spacing: 0.01em; text-decoration: none; -webkit-tap-highlight-color: transparent; touch-action: manipulation; transition: transform 460ms var(--ease-spring), box-shadow 360ms var(--ease-out), background-color 240ms var(--ease-out);`
- `.button::before` (static gloss): `content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none; background: linear-gradient(180deg, rgba(255, 240, 220, 0.14), rgba(255, 240, 220, 0) 55%);`
- `.button::after` (moving sheen, parked left): `content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none; background: linear-gradient(105deg, rgba(255, 240, 220, 0) 36%, rgba(255, 240, 220, 0.34) 50%, rgba(255, 240, 220, 0) 64%); transform: translateX(-120%);`
- `@media (hover: hover)`: `.button:hover { transform: translateY(-1px); background-color: rgba(70, 34, 23, 0.86); box-shadow: var(--glass-hl-ink), 0 3px 8px rgba(70, 34, 23, 0.24), 0 24px 42px -14px rgba(70, 34, 23, 0.55); } .button:hover::after { transform: translateX(120%); transition: transform 380ms var(--ease-out); }`
- `.button:active { transform: scale(0.97); transition-duration: 100ms; }` (release uses the base 460ms spring); `.button:focus-visible { outline: 2px solid var(--bake); outline-offset: 3px; }`
- `.secondaryLink`: `display: inline-flex; align-items: center; min-height: 44px; margin-top: 8px; padding: 0 8px; color: var(--ink); font-family: var(--font-body); font-size: var(--text-label); font-weight: 500; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 5px; text-decoration-color: rgba(70, 34, 23, 0.4); transition: text-decoration-color 0.25s;` `@media (hover: hover) { .secondaryLink:hover { text-decoration-color: currentColor; } }` `.secondaryLink:focus-visible { outline: 3px solid var(--bake); outline-offset: 3px; border-radius: 6px; }`
- `.foot`: `margin-top: 56px; font-size: var(--text-small); letter-spacing: var(--track-small); color: var(--ink); text-align: center;`
- `@media (max-width: 767px)`: `.visit { padding: 72px var(--gutter) calc(24px + env(safe-area-inset-bottom, 0px)); } .card { padding: 26px 22px; border-radius: var(--r); -webkit-backdrop-filter: var(--glass-blur-sm); backdrop-filter: var(--glass-blur-sm); } .actions { width: 100%; } .button { width: 100%; min-height: 52px; } .secondaryLink { display: flex; justify-content: center; width: 100%; } .button::after { display: none; } .foot { margin-top: 40px; }`
- `@media (prefers-reduced-motion: reduce)`: `.card[data-shown='true'] .actions { transform: none; transition: opacity 240ms linear; } .button, .button:active { transform: none; transition: background-color 200ms linear, box-shadow 200ms linear; } .button:hover { transform: none; } .button::after { display: none; }`

### 3.6 `src/components/RevealOnView.module.css`

`.reveal[data-armed='true'] { opacity: 0; transform: translateY(24px); }`; `.reveal[data-armed='true'][data-shown='true'] { opacity: 1; transform: none; transition: opacity 600ms var(--ease-out), transform 760ms var(--ease-spring); }`; `@media (prefers-reduced-motion: reduce) { .reveal[data-armed='true'][data-shown='true'] { transform: none; transition: opacity 240ms linear; } }`. The element is visible by default (no data attributes -> no rule applies), so the content shows without JavaScript. Hiding is instant (the transition lives on the revealed state only).

### 3.7 `src/components/pov/PovHero.module.css`

Visual: a full-screen photo (the first marble worktop frame, centre-cropped) washed with a cream gradient from the lower-left, with the logo tile, the pixel wordmark "Bakersfield" and the line "From the baker's side of the counter." stacked left-aligned near the bottom-left, and a light-glass "Scroll" pill below (bottom-left; bottom-right on short landscape).

- `.hero`: `position: relative; height: 100vh; height: 100svh; width: 100%; overflow: hidden; background: #efe2c8; color: var(--ink, #462217);`
- `.picture { display: contents; }` (unused class, see 04 quirks)
- `.image`: `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%;`
- `.scrim`: `position: absolute; inset: 0; background: radial-gradient(120% 90% at 0% 100%, rgba(250, 238, 214, 0.94) 0%, rgba(250, 238, 214, 0.82) 38%, rgba(250, 238, 214, 0) 78%), linear-gradient(to top, rgba(250, 238, 214, 0.55), rgba(250, 238, 214, 0) 45%);` (comment: keeps the ink text above 4.5:1)
- `.content`: `position: absolute; left: clamp(20px, 5vw, 80px); right: clamp(20px, 5vw, 80px); bottom: calc(clamp(88px, 14svh, 150px) + env(safe-area-inset-bottom)); display: flex; flex-direction: column; align-items: flex-start; gap: 14px;`
- `.logo`: `width: 52px; height: 52px; border-radius: 14px; box-shadow: 0 2px 10px rgba(70, 34, 23, 0.16);` (HTML attributes say 56x56; CSS overrides to 52x52)
- `.wordmark`, `.line`: section 2.2.
- `.scroll`: `position: absolute; left: clamp(20px, 5vw, 80px); bottom: calc(clamp(24px, 5svh, 44px) + env(safe-area-inset-bottom)); display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 20px 0 22px; border-radius: var(--r-pill, 999px); border: 1px solid rgba(255, 255, 255, 0.7); background: var(--glass-light, rgba(255, 250, 240, 0.55)); -webkit-backdrop-filter: var(--glass-blur, saturate(180%) blur(18px)); backdrop-filter: <same>; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 4px 18px rgba(70, 34, 23, 0.14); color: var(--ink, #462217); font-family: var(--font-body, system-ui, sans-serif); font-size: 0.9375rem; font-weight: 600; letter-spacing: 0.01em; text-decoration: none; transition: transform 0.35s var(--ease-out, ...), box-shadow 0.35s var(--ease-out, ...);`
- `@supports not (backdrop-filter...)`: `.scroll { background: #fbf1dd; }`
- `.scroll:active { transform: scale(0.97); }`; `.scroll:focus-visible { outline: 3px solid var(--bake, #d06c2e); outline-offset: 3px; }`; `@media (hover: hover) { .scroll:hover { transform: translateY(-1px); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 8px 26px rgba(70, 34, 23, 0.2); } }`; `.arrow { flex: none; }`.
- Entrance: `@media (prefers-reduced-motion: no-preference) { .rise { animation: rise 0.8s var(--ease-spring, cubic-bezier(0.22, 1.2, 0.36, 1)) both; animation-delay: var(--d, 0ms); } }`; `@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }`. Under reduced motion `.rise` has no animation at all (elements are simply visible).
- `@media (max-width: 767px) { .scroll { left: 20px; } }`
- `@media (max-height: 500px)` (no orientation condition): `.scroll { left: auto; right: max(20px, env(safe-area-inset-right)); bottom: max(16px, env(safe-area-inset-bottom)); } .content { bottom: calc(28px + env(safe-area-inset-bottom)); gap: 8px; } .logo { width: 40px; height: 40px; border-radius: 11px; }`

Note: `.scroll` with `.rise` animates `transform` (translateY) with `animation ... both`; the `both` fill keeps `transform: none` after the animation, which would override hover/active `transform` only while the animation's end state applies. With fill-mode `both` the animated value `transform: none` persists at the end and overrides the `.scroll:hover { transform }` declaration (animations beat normal declarations), so the hover lift and active squeeze on the POV scroll pill do not visibly apply while motion is allowed (the box-shadow change still applies). This follows from the cascade (animation fill-forwards wins over normal rules); it was not tested in a browser.

### 3.8 `src/components/pov/PovStory.module.css`

Visual (landscape, default): the full-bleed marble footage fills the whole screen; a frosted cream caption card sits at the bottom-left (number "02 / 07", title, body, six thin progress segments); a vertical glass capsule with six dots sits at the right edge, vertically centred. Portrait: see section 4.

- `.srOnly`: standard visually-hidden block (`position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;`).
- `.section`: `position: relative; height: 100vh; height: 100svh; width: 100%; overflow: hidden; background: #efe2c8; color: var(--ink, #462217);`
- `.anchor`: same as home (`position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: hidden; pointer-events: none;`).
- `.stage`: `position: relative; height: 100%; width: 100%;`
- `.media`: `position: absolute; inset: 0; contain: layout paint;`
- `.poster`: `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;`
- `.copy`: `position: absolute; left: clamp(20px, 4.5vw, 72px); bottom: calc(clamp(24px, 6svh, 64px) + env(safe-area-inset-bottom)); width: min(400px, calc(100% - 40px)); padding: clamp(20px, 2.2vw, 30px) clamp(20px, 2.2vw, 30px) clamp(18px, 1.8vw, 24px); border-radius: var(--r-lg, 24px); border: 1px solid rgba(255, 255, 255, 0.7); background: rgba(252, 244, 229, 0.88); -webkit-backdrop-filter: var(--glass-blur, saturate(180%) blur(18px)); backdrop-filter: <same>; box-shadow: var(--glass-hl, inset 0 1px 0 rgba(255, 255, 255, 0.85)), 0 12px 40px rgba(70, 34, 23, 0.2);` (comment: own fill, so the 4.5:1 text contrast does not depend on a shared token). `@supports not (backdrop-filter...)`: `.copy { background: #fcf4e5; }`.
- `.panels { display: grid; }`; `.panel { grid-area: 1 / 1; align-self: start; visibility: hidden; opacity: 0; }`; `.panel:first-child { visibility: visible; opacity: 1; }` (before script runs; script then uses inline styles; inline `height` on `.panels` is animated by GSAP).
- `.num`, `.title`, `.body`: section 2.2.
- `.bar`: `display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-top: 20px;` (short landscape `margin-top: 12px`)
- `.cell`: `height: 3px; border-radius: 2px; background: rgba(70, 34, 23, 0.2); transition: background-color 0.4s var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1));` `.cell[data-state='past'] { background: rgba(70, 34, 23, 0.6); }` `.cell[data-state='current'] { background: var(--bake, #d06c2e); }`
- `.rail`: `position: absolute; right: clamp(12px, 2vw, 28px); top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; padding: 6px 0; border-radius: var(--r-pill, 999px); border: 1px solid rgba(255, 255, 255, 0.6); background: var(--glass-light, rgba(255, 250, 240, 0.5)); -webkit-backdrop-filter: var(--glass-blur, saturate(180%) blur(18px)); backdrop-filter: <same>; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 4px 18px rgba(70, 34, 23, 0.14);` `@supports not (backdrop-filter...) { .rail { background: #fbf1dd; } }`
- `.railButton`: `display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 50%; background: none; cursor: pointer;` `.railButton:focus-visible { outline: 3px solid var(--bake, #d06c2e); outline-offset: -3px; }`
- `.railDot`: `width: 8px; height: 8px; border-radius: 50%; background: rgba(70, 34, 23, 0.4); transition: transform 0.4s var(--ease-out, ...), background-color 0.4s var(--ease-out, ...);` `.railDot[data-active='true'] { background: var(--bake, #d06c2e); transform: scale(1.5); }` `@media (hover: hover) { .railButton:hover .railDot { background: var(--crust, #a8572d); } }` (hover rule comes before... in file order the `[data-active]` rule is earlier; the hover rule has the same-ish specificity plus pseudo-class so it also recolours an active dot to crust on hover.)
- Reduced motion list: `.list { padding: clamp(40px, 8vw, 120px) max(20px, env(safe-area-inset-left)) clamp(40px, 8vw, 120px) max(20px, env(safe-area-inset-right)); background: linear-gradient(to bottom, #f6e7ca, #f8eed8); color: var(--ink, #462217); }`; `.listInner { display: grid; gap: clamp(48px, 8vw, 112px); max-width: 1120px; margin: 0 auto; padding: 0; list-style: none; }`; `.item { display: grid; gap: clamp(20px, 3vw, 40px); align-items: center; scroll-margin-top: 24px; }`; `@media (min-width: 900px) { .item { grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); } }`; `.still { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; border-radius: var(--r-lg, 24px); box-shadow: 0 12px 40px rgba(70, 34, 23, 0.16); }`; `.card { max-width: 420px; }`. In the list, `.num/.title/.body` use the same module rules as the pinned captions (including portrait/short-landscape overrides when those queries match).
- `@media (orientation: portrait)`: see section 4.3 (full declarations).
- `@media (orientation: landscape) and (max-height: 500px)`: see section 4.5.

### 3.9 `src/components/pov/PovSequence.module.css`

`.stage { position: relative; width: 100%; height: 100%; overflow: hidden; background: #efe2c8; }`; `.canvas { position: absolute; inset: 0; width: 100%; height: 100%; }`; `.poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }`; `.poster[data-fit='contain'] { object-fit: contain; }`; `.fallback { position: absolute; inset: 0; display: grid; place-items: center; background: #efe2c8; }`; `.logo { width: min(30%, 200px); height: auto; image-rendering: pixelated; }`.

### 3.10 `src/components/pov/PovOutro.module.css`

Visual: a full-screen cream section over a faint washed-out marble photo; centred title, line, a dark glass pill CTA and a quiet underlined link; small footer at the bottom.

- `.outro`: `position: relative; display: flex; flex-direction: column; min-height: 100vh; min-height: 100svh; padding: clamp(56px, 10svh, 120px) max(24px, env(safe-area-inset-left)) calc(24px + env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-right)); isolation: isolate; overflow: hidden; background: #f6e7ca; color: var(--ink, #462217);`
- `.outro::before`: `content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(to bottom, rgba(248, 238, 216, 0.9), rgba(246, 231, 202, 0.82)), url('/pov/ingredients/0001.webp?v=2') center / cover no-repeat;` (comment: faint marble washed with cream, gives the glass button something to blur; `?v=` must match `ASSET_VERSION`). Phones: `@media (max-width: 767px), (max-width: 932px) and (max-height: 500px) { .outro::before { background: linear-gradient(to bottom, rgba(248, 238, 216, 0.9), rgba(246, 231, 202, 0.82)), url('/pov-sm/ingredients/0001.webp?v=2') center / cover no-repeat; } }`
- `.inner`: `flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 16px;`
- `.title`, `.body`: section 2.2.
- `.actions`: `display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: clamp(16px, 3svh, 32px);`
- `.cta`: `display: inline-flex; align-items: center; justify-content: center; min-height: 52px; padding: 0 34px; border-radius: var(--r-pill, 999px); border: 1px solid rgba(255, 255, 255, 0.22); background: var(--glass-ink, rgba(70, 34, 23, 0.74)); -webkit-backdrop-filter: var(--glass-blur, saturate(180%) blur(18px)); backdrop-filter: <same>; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 6px 20px rgba(70, 34, 23, 0.28); color: #fbf1dd; font-family: var(--font-body, system-ui, sans-serif); font-size: 1.0625rem; font-weight: 600; letter-spacing: 0.005em; text-decoration: none; transition: transform 0.35s var(--ease-out, ...), box-shadow 0.35s var(--ease-out, ...); position: relative;`
- `.cta::before`: `content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(to bottom, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0) 48%);`
- `@supports not (backdrop-filter...) { .cta { background: #462217; border-color: #462217; } }`
- `@media (hover: hover) { .cta:hover { transform: translateY(-1px); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.34), 0 12px 30px rgba(70, 34, 23, 0.36); } }`; `.cta:active { transform: scale(0.97); }`; `.cta:focus-visible { outline: 3px solid var(--bake, #d06c2e); outline-offset: 3px; }`
- `.secondary`: `display: inline-flex; align-items: center; min-height: 44px; padding: 0 8px; color: var(--ink, #462217); font-size: 1rem; font-weight: 500; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 5px; text-decoration-color: rgba(70, 34, 23, 0.4); transition: text-decoration-color 0.25s;` hover (`(hover: hover)`): `text-decoration-color: currentColor`; focus: `outline: 3px solid var(--bake, #d06c2e); outline-offset: 3px; border-radius: 6px;`
- `.footer`: `margin: 0; padding-top: 24px; text-align: center; font-size: 0.875rem; color: #6b4636;`
- `@media (max-width: 767px) { .actions { width: 100%; max-width: 420px; } .cta { width: 100%; } }`
- `@media (max-height: 500px) { .outro { padding-top: 32px; } .inner { gap: 10px; } }`
- There is no `prefers-reduced-motion` rule in this file (the only motion is hover/press transitions, `0.35s`).

---

## 4. Layout per viewport class

Definitions used by CSS and JS: "phone" (JS `PHONE_QUERY`) = `(max-width: 767px), (max-width: 932px) and (max-height: 500px)`. "Desktop" below = everything else (this includes tablet portrait 768 x 1024). `svh` = small viewport height (equal to `innerHeight` in desktop and test browsers).

### 4.1 Home, desktop >= 768 wide, landscape or portrait (e.g. 1440x900, 1920x1080, 768x1024)

- Order in the page: hero (min 100svh) -> `.lead` band (14svh) -> pinned story section (100svh, pinned for `pinLength`) -> visit section (min 100svh) -> footer line inside visit.
- Story: `.stage` is a horizontal flex row, items vertically centred, `justify-content: center`, `gap: clamp(20px, 3vw, 56px)`, side padding 16px. The frame (`.media`) is a square of side `min(86svh, 54vw)` and does not shrink; the copy card (`.copy`) is `clamp(280px, 34vw, 448px)` wide (can shrink). The pair is centred as a group in the viewport.
  - 1440x900: frame 774 x 774, gap 43.2, card 448 (group 1265.2 + 32 padding).
  - 1920x1080: frame 928.8, gap 56, card 448.
  - 768x1024 (tablet portrait): frame `min(880.6, 414.72) = 414.72` square, gap 23.04, card 280. Side by side, not stacked.
- Rail: `ProgressRail` is displayed at `min-width: 768px`: fixed, `right: 12px`, `top: 50%`, 44px-wide column, `z-index: 50`.
- Progress bar: inside the card under the body (`margin-top: 30px`), six `6px`-high cells.
- Card padding `clamp(24px, 2.6vw, 40px)`: 37.4 at 1440 (computed `2.6vw`), 40 at 1920, 24 at 768 (`19.97` clamped up to 24).
- Section background has the glow `radial-gradient(22% 60% at 82% 50%, rgba(250, 212, 136, 0.6), rgba(250, 212, 136, 0) 100%)` over `--stage`.
- Visit: card `min(560px, 100%)`, centred horizontally and vertically in a `min-height: 100svh` flex column with `88px` top padding.

### 4.2 Home, phone portrait (<= 767 wide: 430x932, 390x844, 320x568)

- `.stage` is a column, centred, `gap: 12px`, padding `12px 16px calc(12px + env(safe-area-inset-bottom, 0px))`.
- Frame: `--size = min(100vw - 32px, 46svh)`; square. 430x932: 398; 390x844: 358; 320x568: 261.28. It is translated up by `0.2 * size` (79.6 / 71.6 / 52.26 px) and `margin-bottom: -0.2 * size` keeps the card position unchanged.
- Card: full width up to `520px`, padding `18px 20px`, radius `var(--r)` (16px), blur `--glass-blur-sm`. Title `1.6rem`, number `1.75rem`, body `1rem`.
- Rail hidden (`display: none` by default below 768px).
- Hero wordmark single line (`white-space: nowrap`) at `clamp(2.25rem, 1.2rem + 7.4vw, 3.5rem)`.
- Visit: padding `72px 16px calc(24px + safe-bottom)`, card padding `26px 22px`, full-width button (min-height 52px), full-width centred secondary link, no sheen.
- Pin length uses `0.85` vh per beat: 4753 / 4304 / 2897 px (with `vh = innerHeight`).

### 4.3 Home, short landscape phone (844x390; `max-width: 932px` and `max-height: 500px`)

- Frame left, card right (row), `gap: 16px`, padding `12px 16px calc(12px + safe-bottom)`. Frame side `min(86svh, 46vw)` = 335.4 at 844x390; card `clamp(240px, 42vw, 380px)` = 354.48; card padding `16px 18px`, radius 16px.
- Rail hidden. Pin length uses the phone value (`0.85`): 1989 at height 390.
- The hero is taller than the viewport here (min-height 100svh, content taller); the wordmark uses the desktop `--text-display` size (99.96px) because `max-width: 767px` does not match.

### 4.4 POV, desktop landscape (>= 768 wide, landscape, height > 500; e.g. 1440x900, 1920x1080)

- Pin section 100svh. `.media` is `position: absolute; inset: 0`, so the canvas is the full viewport; frames are drawn with centre-crop cover (16:9 frames).
- Caption card (`.copy`): absolute, `left: clamp(20px, 4.5vw, 72px)` (64.8 at 1440, 72 at 1920), `bottom: calc(clamp(24px, 6svh, 64px) + env(safe-area-inset-bottom))` (54 at 900, 64 at 1080), `width: min(400px, calc(100% - 40px))`, padding `clamp(20px, 2.2vw, 30px)` sides and top, `clamp(18px, 1.8vw, 24px)` bottom.
- Rail: absolute, `right: clamp(12px, 2vw, 28px)`, `top: 50%`, translated `-50%`, one column of six 44px buttons (`6 + 6*44 + 6 + 2 = 278px` tall).
- Progress bar inside the caption card, `margin-top: 20px`, six `3px` cells.

### 4.5 POV, portrait (`orientation: portrait`; covers 430x932, 390x844, 320x568 and 768x1024)

Full declarations in `PovStory.module.css`:
- `.stage { display: flex; flex-direction: column; justify-content: flex-start; gap: clamp(20px, 4svh, 40px); padding: calc(env(safe-area-inset-top) + clamp(24px, 4svh, 40px)) 0 calc(env(safe-area-inset-bottom) + clamp(24px, 4svh, 40px) + 8svh); background: linear-gradient(to bottom, #f1e4ca, #f8eed8); }` (comment: bottom padding is `8svh` larger than the top; the auto margins below then centre the frame and copy at about 46% of the height; if the group is taller than the stage the auto margins fall to 0 and it sits top-aligned).
- `.media { position: relative; inset: auto; flex: none; width: 100%; margin-top: auto; aspect-ratio: 16 / 9; -webkit-mask-image: linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent); mask-image: <same>; }` (soft top and bottom edge into the cream surface).
- `.copy { position: static; width: 100%; max-width: 520px; margin: 0 auto auto; padding: 0 max(24px, env(safe-area-inset-left)) 0 max(24px, env(safe-area-inset-right)); border: 0; border-radius: 0; background: none; -webkit-backdrop-filter: none; backdrop-filter: none; box-shadow: none; }` (no glass: the copy sits directly on the cream gradient).
- `.title { font-size: clamp(1.875rem, 1.2rem + 3.4vw, 2.5rem); }`; `.rail { display: none; }`.
- Frame height = width * 9/16: 430 -> 241.9, 390 -> 219.4, 320 -> 180, 768 -> 432. Frame spans the full width (no side margins). Stage padding-top at 390x844: `clamp(24, 33.76, 40) = 33.76`; padding-bottom `33.76 + 67.52 = 101.28`; gap `33.76`.
- Because 768x1024 matches `orientation: portrait`, tablet portrait uses this stacked layout on `/pov` (but the side-by-side layout on the home page).

### 4.6 POV, short landscape (`orientation: landscape` and `max-height: 500px`; 844x390)

`.copy { left: max(16px, env(safe-area-inset-left)); bottom: max(14px, env(safe-area-inset-bottom)); width: min(264px, 40vw); padding: 12px 14px 10px; border-radius: 18px; }` (it keeps the glass recipe from the default rule, only geometry changes); `.num { margin-bottom: 6px; font-size: 0.6875rem; }`; `.title { margin-bottom: 6px; font-size: 1.5rem; }`; `.body { font-size: 0.9375rem; line-height: 1.4; }`; `.bar { margin-top: 12px; }`; `.rail { display: none; }`. Footage is full-bleed (cover) behind it. At 844x390 the card is `min(264, 337.6) = 264px` wide. The `PovHero` also switches at `max-height: 500px` (scroll pill moves to bottom-right, logo shrinks to 40px, content bottom `28px + safe-area`, gap 8px).

### 4.7 POV hero and outro per class

- Hero is `100svh` with the image cover-cropped (`object-position: 50% 50%`). Text block left-aligned at `left: clamp(20px, 5vw, 80px)`, bottom `clamp(88px, 14svh, 150px) + safe-bottom` (126 at 900, 150 max). Scroll pill at the same left, bottom `clamp(24px, 5svh, 44px) + safe-bottom`; phones: `left: 20px`.
- Outro: `min-height: 100svh`; content centred; horizontal padding `max(24px, safe-area)`; `<= 767px` actions full width (max 420px) and full-width CTA; `max-height: 500px`: padding-top 32px and gap 10px.

---

## 5. Motion inventory

`--ease-out` = `cubic-bezier(0.4, 0, 0.2, 1)`; `--ease-spring` = `cubic-bezier(0.34, 1.56, 0.64, 1)`.

### 5.1 Home

| Animation | Trigger | Properties: from -> to | Duration / delay | Easing | Reduced motion |
|---|---|---|---|---|---|
| Hero logo wrapper `logoIn` (`.mark`) | page load (CSS) | `opacity 0 -> 1`, `transform scale(0.92) -> none` | `640ms` / `0` | `var(--ease-spring)` | `fade` 300ms linear, `both` |
| Hero logo float `bob` (`.logo`) | page load, infinite | `translateY(0) -> -5px -> 0` | `5s`, delay `900ms` | `ease-in-out` | `animation: none` |
| Wordmark `fadeUp` | page load | `opacity 0 -> 1`, `translateY(12px) -> none` | `480ms` / `80ms` | `var(--ease-out)` | `fade` 300ms linear (no delay) |
| Tagline `fadeUp` | page load | same | `480ms` / `200ms` | `var(--ease-out)` | `fade` 300ms linear |
| Scroll pill `fade` | page load | `opacity 0 -> 1` | `440ms` / `360ms` | `var(--ease-out)` | `fade` 300ms linear; `transition: none` |
| Scroll chevron `nudge` (`.arrow`) | page load, infinite | `translate(0,-2px) rotate(45deg) <-> translate(0,2px) rotate(45deg)` | `2.4s`, delay `1.2s` | `ease-in-out` | `animation: none` |
| Scroll pill hover | `(hover: hover)` | `background-color -> rgba(255,255,255,0.72)`, `box-shadow -> var(--glass-hl), var(--shadow-lift)` | transition `300ms` both | `var(--ease-out)` | `transition: none` |
| Hero entrance end time | | all done by `800ms` (scroll pill: `360 + 440`) | | | |
| Story copy panel in (GSAP) | segment change while pinned | `autoAlpha 0 -> 1`, `y 14 -> 0`, `filter blur(6px) -> blur(0px)` (desktop only; phones `filter: 'none'`), `clearProps: 'filter'` | `0.42s` / `0` | `back.out(1.2)` | The pinned story is not used under reduced motion (list renders instead) |
| Story copy panel out (GSAP) | previous panel | `autoAlpha -> 0`, `y -> -8` | `0.18s` | `power1.in` | n/a |
| Other panels | segment change | `gsap.set(autoAlpha: 0, y: 0)` (instant) | 0 | - | n/a |
| Progress bar cell | `data-state` change | `.cell::after` `width 0 -> 100%` (480ms `--ease-out`), `opacity 0 -> 1` (280ms `--ease-out`); `past` fill `--honey`; `current` fill `linear-gradient(90deg, var(--honey), var(--bake))` | `480ms` / `280ms` | `var(--ease-out)` | `transition: none` |
| Rail dot | active change | `height 9px -> 22px` (460ms `--ease-spring`), `background-color rgba(70,34,23,0.3) -> var(--ink)` (240ms `--ease-out`) | | | `transition: none` |
| Rail dot hover | pointer hover (not gated) | `background -> var(--crust)` (inactive) | `240ms` | `--ease-out` | `transition: none` |
| Visit reveal (`RevealOnView`) | first time `threshold: 0.15` visible, only if armed (below fold at mount, JS on, no reduced motion, IO available) | `opacity 0 -> 1`, `transform translateY(24px) -> none` | `600ms` opacity, `760ms` transform | `--ease-out`, `--ease-spring` | `transform: none; transition: opacity 240ms linear` (but armed is never set under reduced motion, so the card is simply visible) |
| Visit actions arrive | after card shown, when armed | `.actions` `opacity 0 -> 1`, `translateY(12px) -> none` | `520ms` opacity / `620ms` transform, both delay `180ms` | `--ease-out`, `--ease-spring` | `transform: none; transition: opacity 240ms linear` |
| CTA hover | `(hover: hover)` | `transform translateY(-1px)`, `background-color rgba(70,34,23,0.86)`, shadow `var(--glass-hl-ink), 0 3px 8px rgba(70,34,23,0.24), 0 24px 42px -14px rgba(70,34,23,0.55)` | `transform 460ms`, `box-shadow 360ms`, `background-color 240ms` | spring / out / out | `transform: none; transition: background-color 200ms linear, box-shadow 200ms linear` |
| CTA sheen | `(hover: hover)` hover | `::after` `translateX(-120%) -> translateX(120%)` | `380ms` (set on the hover state, so the return is instant) | `--ease-out` | `display: none` (also none on phones) |
| CTA press | `:active` | `transform scale(0.97)`, `transition-duration: 100ms` | `100ms` | spring | `transform: none` |
| CTA release | leave `:active` | back to `none` via base transition `transform 460ms var(--ease-spring)` | `460ms` | spring | n/a |
| Secondary link hover | `(hover: hover)` | `text-decoration-color rgba(70,34,23,0.4) -> currentColor` | `0.25s` | default (`ease`) | no rule |
| Skip link | `:focus` | `transform translateY(-200%) -> 0` | `300ms` | `--ease-out` | no rule |
| Smooth scroll | wheel / anchor | Lenis `duration: 1.1`, easing `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`; programmatic anchor scroll `duration: 1.2` | | | Lenis not started; `window.scrollTo` with `behavior: 'auto'` |

### 5.2 POV

| Animation | Trigger | Properties: from -> to | Duration / delay | Easing | Reduced motion |
|---|---|---|---|---|---|
| Hero entrance `rise` | page load, `.rise` on logo (`--d: 0ms`), wordmark (`70ms`), line (`140ms`), scroll pill (`260ms`) | `opacity 0 -> 1`, `translateY(14px) -> none`, fill `both` | `0.8s`, delay = `--d` | `var(--ease-spring, cubic-bezier(0.22, 1.2, 0.36, 1))` (effective: `cubic-bezier(0.34, 1.56, 0.64, 1)`) | animation only inside `(prefers-reduced-motion: no-preference)`, so no animation under reduce |
| Hero pill hover / press | `(hover: hover)` / `:active` | hover: `translateY(-1px)` + `box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 26px rgba(70,34,23,0.2)`; active: `scale(0.97)` | `transform 0.35s`, `box-shadow 0.35s` | `--ease-out` | none; see the animation-fill note in 3.7 |
| Caption panel in (GSAP) | segment change | `autoAlpha 0 -> 1` (0.4s, `power2.out`) and `y 18 -> 0` (0.8s, `back.out(1.5)`); delay `0.08s` if a previous panel is fading out, else `0` | | | not used under reduced motion (list) |
| Caption panel out (GSAP) | previous panel | `autoAlpha -> 0`, `y -> -8` | `0.16s` | `power1.in` | n/a |
| Caption box height (GSAP) | segment change | `.panels` inline `height -> incoming panel offsetHeight`; first panel: `gsap.set`; later: `gsap.to(..., { duration: 0.5, ease: 'power3.out', overwrite: true })`; refit with `gsap.set` on refresh | `0.5s` | `power3.out` | n/a |
| Progress cell | `data-state` change | `background-color`: `rgba(70,34,23,0.2)` (future) / `rgba(70,34,23,0.6)` (past) / `var(--bake, #d06c2e)` (current) | `0.4s` | `--ease-out` | no reduced rule (colour only) |
| Rail dot | active change | `transform scale(1) -> scale(1.5)`, `background rgba(70,34,23,0.4) -> var(--bake, #d06c2e)` | `0.4s` | `--ease-out` | no rule |
| Rail dot hover | `(hover: hover)` | `background -> var(--crust, #a8572d)` | `0.4s` | `--ease-out` | no rule |
| Cross-fade at cuts (canvas) | scroll progress inside a cut window | canvas `globalAlpha` of the incoming frame `0 -> 1` with `smoothstep`, quantised to 48 steps; scrubs both directions | no time: driven by scroll across `0.0133` of global progress | `t*t*(3-2*t)` | engine not mounted under reduced motion |
| Outro CTA hover / press | `(hover: hover)` / `:active` | hover: `translateY(-1px)` + shadow `inset 0 1px 0 rgba(255,255,255,0.34), 0 12px 30px rgba(70,34,23,0.36)`; active: `scale(0.97)` | `transform 0.35s`, `box-shadow 0.35s` | `--ease-out` | no rule |
| Secondary link hover | `(hover: hover)` | `text-decoration-color -> currentColor` | `0.25s` | default | no rule |

### 5.3 Both pages: smooth scroll and reveal

- Lenis smooth scrolling only for non-reduced-motion, non-coarse-pointer sessions. No `scroll-behavior: smooth` is set in CSS.
- POV outro and hero have no reveal-on-view; only the home Visit card uses `RevealOnView`.

---

## 6. Glass material recipes

All glass uses a translucent fill + `backdrop-filter` blur + 1px light border + inset top highlight + ink-tinted shadow. Opaque fallbacks apply when `backdrop-filter` is unsupported.

| Element | Fill | Blur | Border | Highlight | Shadow | Opaque fallback |
|---|---|---|---|---|---|---|
| Home story card `.copy`, Visit/list `.card` | `var(--glass-warm)` = `rgba(255, 248, 232, 0.55)` | `var(--glass-blur)` = `saturate(180%) blur(18px)`; phone portrait: `var(--glass-blur-sm)` = `saturate(170%) blur(12px)` | `1px solid var(--glass-border)` = `rgba(255,255,255,0.7)` | `--glass-hl` `inset 0 1px 0 rgba(255,255,255,0.85)` | `--shadow-panel` | global `@supports not` re-points `--glass-warm` to `#fbf1de` (the blur declarations still exist but have no effect) |
| Home hero scroll pill, rail capsule (`.list`) | `var(--glass-light)` = `rgba(255,255,255,0.6)` | `var(--glass-blur-sm)`; hero pill on phones: `blur(10px)` | `1px solid var(--glass-border)` | `--glass-hl` | `--shadow-soft` (hover pill: `--shadow-lift`) | `--glass-light` -> `#fffaf0` |
| Home visit button `.button`, skip link | `var(--glass-ink)` = `rgba(70,34,23,0.9)` | `var(--glass-blur)` (skip link: `--glass-blur-sm`, only inside `@supports`) | `1px solid var(--glass-border-ink)` = `rgba(255,240,220,0.26)` | `--glass-hl-ink` (top `rgba(255,232,200,0.28)`, bottom inner `rgba(0,0,0,0.16)`) + gloss `::before` `linear-gradient(180deg, rgba(255,240,220,0.14), rgba(255,240,220,0) 55%)` + sheen `::after` on hover | `--shadow-lift` | `--glass-ink` -> `#4a2a1e` |
| POV caption `.copy` (landscape) | `rgba(252, 244, 229, 0.88)` (own value, not a token) | `var(--glass-blur, saturate(180%) blur(18px))` | `1px solid rgba(255,255,255,0.7)` | `var(--glass-hl, ...)` | `0 12px 40px rgba(70,34,23,0.2)` | `@supports not`: `background: #fcf4e5`. In portrait the glass is removed entirely (`background: none; backdrop-filter: none; box-shadow: none; border: 0`) |
| POV hero scroll pill, rail | `var(--glass-light, ...)` (hero pill and rail) | `var(--glass-blur, ...)` | hero pill `1px solid rgba(255,255,255,0.7)`; rail `1px solid rgba(255,255,255,0.6)` | `inset 0 1px 0 rgba(255,255,255,0.85)` | `0 4px 18px rgba(70,34,23,0.14)` | `@supports not`: `background: #fbf1dd` |
| POV outro CTA | `var(--glass-ink, rgba(70,34,23,0.74))` (effective `rgba(70,34,23,0.9)`) | `var(--glass-blur, ...)` | `1px solid rgba(255,255,255,0.22)` | `inset 0 1px 0 rgba(255,255,255,0.28)` + `::before` gloss `linear-gradient(to bottom, rgba(255,255,255,0.22), rgba(255,255,255,0) 48%)` | `0 6px 20px rgba(70,34,23,0.28)` | `@supports not`: `background: #462217; border-color: #462217` |

Corner shape: home cards add `corner-shape: superellipse(2.5)` under `@supports (corner-shape: superellipse(2))`. POV elements do not.

Every glass element also relies on something behind it to blur: the home hero glow and stage glow, the visit radial glow, the POV footage, and the washed marble photo in the outro.

---

## 7. Accessibility properties as implemented

**Document**: `<html lang="en">`; skip link `Skip to content` -> `#main` (first focusable element; hidden above the viewport until focused; min-height 48px). Each page has one `<main id="main">`.

**Landmarks and names**
- Home: hero `section aria-labelledby="hero-title"` (the `h1`); story `section aria-label="The croissant story"`; visit `section aria-labelledby="visit-title"` (the `h2`); rail `nav aria-label="Beats"` with `ol > li > a` each `aria-label="<n>. <title>"` and `aria-current="step"` on the active one; beat numbers and the progress bar are `aria-hidden="true"`; the `lead` band is `aria-hidden`; story `h2`s are `id="beat-<slug>-title"`.
- POV: hero `aria-labelledby="pov-hero-title"` (`h1`); story `aria-labelledby="pov-story-title"` (a visually hidden `h2` "How a Bakersfield croissant is made"); caption titles are `h3`; rail `nav aria-label="Story steps"` with real `<button type="button">` elements, `aria-label="<title>, step <n> of 6"`, `aria-current="step"` on the active one; outro `aria-labelledby="pov-outro-title"`.
- Images: home hero logo has descriptive alt (`Bakersfield logo: a pixel croissant with a moustache`); the story canvas is `role="img"` with `aria-label` = alt text (`A croissant being made, from simple ingredients to a golden bake.` / `A first-person view of a croissant being made on a marble worktop, from flour to a golden bake.`); the poster `<img>` carries the same alt while it shows; hero backdrop, logo tiles, list stills and the fallback logo are `alt=""` (decorative).
- Hidden-panel handling: GSAP `autoAlpha: 0` sets `visibility: hidden`, so non-current panels are not read by screen readers. Because all six panels exist in the DOM, the current one is the only one exposed.

**Focus**: global `:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }` (colour `#d06c2e`). Overrides: hero scroll pill `outline-offset: 4px`; rail links (home) `outline: 2px solid var(--bake); outline-offset: -4px`; POV rail buttons `outline: 3px solid var(--bake, #d06c2e); outline-offset: -3px`; visit button `2px / 3px`; secondary links and POV pills `3px solid var(--bake) / 3px` (links `border-radius: 6px`). Contrast of `#d06c2e` against cream `#f6e7ca` is 2.93:1 (below the 3:1 non-text guidance; documented, not changed).

**Hit targets**: `--touch: 44px` used for the hero pill (`min-height`), the home rail links (44 x 44), POV rail buttons (44 x 44), POV hero pill (`min-height: 44px`), secondary links (`min-height: 44px`); primary buttons `min-height: 52px`; skip link `min-height: 48px`. Visible dots inside rails are 9px (home) / 8px (POV) but the clickable area is 44px.

**Motion**: `prefers-reduced-motion: reduce` turns off Lenis, the pinned story and frame loading (a static list with one still and card per beat), hero/visit animations become opacity fades or are removed, and `RevealOnView` never arms. Touch (`pointer: coarse`) also skips Lenis.

**Contrast pairs (computed, WCAG)**

| Text on background | Ratio |
|---|---|
| `--ink` `#462217` on `--cream` `#f6e7ca` | 11.46 |
| `--ink` on `--stage` `#f7e3b8` | 11.08 |
| `--ink` on `--warm-mid` `#f7e6c2` | 11.36 |
| `--ink` on `#fbf1de` (glass-warm solid) | 12.48 |
| `--ink` on `#f8eed8` (POV list/portrait end colour) | 12.13 |
| `--crust` `#a8572d` on `--stage` (home beat number, large text) | 4.09 |
| `--crust` on `#fbf1de` | 4.61 |
| `#8a4522` on `#fcf4e5` (POV number, 12px caps) | 6.5 |
| `#8a4522` on `#f1e4ca` (POV portrait surface) | 5.65 |
| `#6b4636` on `#f6e7ca` (POV outro footer) | 6.73 |
| `--cream` `#f6e7ca` on ink glass over cream (`rgba(70,34,23,0.9)` ~ `#583629`) | 8.71 |
| `#fbf1dd` on `#462217` (POV CTA fallback) | 12.47 |
| `--cream` on `--glass-ink-solid` `#4a2a1e` (skip link fallback) | 10.48 |

POV hero text sits on a cream scrim (`rgba(250,238,214,0.94)` at the lower-left); the code comment states it keeps ink text above 4.5:1. POV caption fill `rgba(252,244,229,0.88)` is chosen "so the 4.5:1 text contrast does not depend on a shared token".

**Other**: `touch-action: manipulation` and transparent tap highlight on all `a` and `button`; `scroll-margin-top: 16px` on all `[id]`; `text-wrap: balance` on headings, `pretty` on paragraphs; no autoplaying video or audio; links to `#` (CTA) are placeholders (TODO in source).

---

## 8. Known quirks (design/motion)

1. `--amber`, `--surface`, `--accent`, `--r-sm`, `--text-title`, `--track-display` and the global `.sr-only` are defined but unused.
2. POV CSS files use `var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1))` and `var(--ease-spring, cubic-bezier(0.22, 1.2, 0.36, 1))` with fallbacks that differ from the global token values; the global tokens always win, so the fallbacks are dead values.
3. POV hero `.rise` animations use `animation-fill-mode: both`, so the finished `transform: none` keeps overriding the `:hover` / `:active` `transform` on the scroll pill (see 3.7). Not verified in a browser.
4. Home rail hover rules are not inside `@media (hover: hover)`; POV rail hover is.
5. Home `.arrow`'s negative `margin-top: -3px` plus `nudge` translate offsets are visual alignment hacks for the rotated border chevron.
6. `PovHero.logo` HTML `width/height` 56 differs from the CSS 52px (CSS wins).
7. `Hero .scroll` uses `transform: translateX(-50%)` for centring and a `fade` animation that has no transform, so there is no conflict (the hover rule does not change `transform`).
8. The `StorySection` `.picture` rule uses `display: contents` so the `<img>` positions against `.media`; the reduced-motion list uses the same `.picture` class around `.still`, so the `still` image becomes a direct grid child of `.item` (works because `justify-items: center` applies to it).
9. At `max-width: 767px` the home `.copy` switches to `--glass-blur-sm`; at short landscape widths 768 to 932 it keeps the full blur (`18px`).
