---
name: skill-design-system-liquid
description: Apply the instyle.group "Liquid Glass" design system — warm-neutral base with four translucent glass materials (light/warm/tinted/dark), backdrop-filter blur, 1px specular highlights, superellipse corner-shape, and an ambient scene-bg behind every page. Use this when the user asks to build a UI with "liquid"/"liquid glass"/"frosted glass"/"リキッド"/"ガラスデザイン"/"半透明 backdrop blur" aesthetics, when a project's CLAUDE.md declares this design system, or when generating dashboards, landing pages, or slides that should look like Apple-style glass UI in the instyle.group brand voice.
---

# instyle.group Liquid Glass Design System

This skill makes Claude generate UIs that follow the instyle.group **Liquid
Glass** specification — warm neutral palette, translucent panels with
backdrop-filter, specular highlights, continuous-curvature corners, and an
ambient gradient backdrop.

> Sister skill: `skill-design-system-flat` for the flat / contrast-based variant
> of the same brand. They are mutually exclusive — pick the one the user asks
> for, never mix tokens.

---

## Quick rules — must follow in every output

### 1. Glass material (the core)

Every surface is **translucent + backdrop-filter + 1px white-ish border + specular highlight inset**. Use one of four materials — never invent ad-hoc `rgba(...)` fills.

| Token            | Use                              |
|------------------|----------------------------------|
| `--glass-light`  | Brightest panels                 |
| `--glass-warm`   | Default panels (most common)     |
| `--glass-tinted` | Accent panels (sparingly)        |
| `--glass-dark`   | Sidebar / nav / primary buttons  |

Cap on diversity: **at most three glass materials per screen.**

### 2. Scene background (REQUIRED)

The first child of `<body>` must be `<div class="scene-bg"></div>`. Without
it, glass panels look dead. The class is defined in `rules/snippets.css`.

### 3. Typography

- `--font-sans: 'Gen Interface JP', sans-serif` for body text and
  `--font-display: 'Gen Interface JP Display', 'Gen Interface JP', sans-serif`
  for headings (h1–h4). Gen Interface JP handles both Latin and Japanese.
- Modular type scale **Perfect Fourth (1.333) on a 14px base** (Display 59 /
  H1 44 / H2 33 / H3 25 / H4 19 / Body 14 / Small 11 / Caption 8).
- Min font-size 11px. Caption 8px is for chart axis labels only.
- **Do not use serif / Mincho.** For eyebrow labels, step numbers and small
  caps, use the tracked-sans `.eyebrow` style instead.

### 4. Borders / dividers

No `border: 1px solid var(--color-border)`. Use **`rgba(255,255,255,.55–.82)`**
and let the blur+highlight do the separation.

### 5. Radius — superellipse, not circular

- Apply `corner-shape: var(--corner-shape)` (= `superellipse(2.5)`) to
  every element via `*` selector. Tokens.css does this for you.
- Sizes: `--r-sm: 10px` / `--r: 16px` / `--r-lg: 24px` / `--r-xl: 32px`
  / `--r-pill: 999px`.
- Pills are stadium-shaped — `corner-shape` has no effect there, that's fine.
- Large panels (`.glass-panel`, `.dashboard`, `.canon-slide`) get
  `--corner-shape-hard` for an iOS feel.

### 6. Highlight color `#E2DD2A`

**Inline text marker only.** Use it through `<mark>` or `.mark`. Never use
it for CTA fills, badges, icon backgrounds, sidebar tints, or panel
washes. 2–3 uses per page maximum.

### 7. Spacing & motion

- 8px grid: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`. Glass panels prefer
  generous padding (≥ 36px).
- Default ease: `--ease-out`. Spring (`--ease-spring`) is for special
  moments only. All transitions ≤ 400ms.
- Hover convention: `translateY(-1px) + shadow strengthens`.

### 8. Accessibility

- Maintain ≥ 4.5:1 contrast against the *worst-case backdrop* under each
  glass surface (the scene-bg gradients can shift contrast a lot).
- Always provide a `@supports not (backdrop-filter: blur(1px))` fallback
  with opaque colors. The snippets.css block already includes one.

---

## Files in this skill

| Path | Purpose |
|------|---------|
| `rules/tokens.css`          | Full CSS variable set. **Copy into the project.** |
| `rules/snippets.css`        | Component snippets (panel, card, btn, input, scene-bg). |
| `rules/design.md`           | Full 700+ line spec. Read this when the quick rules are not enough. |
| `rules/claude-md-template.md` | Template for the project's own `CLAUDE.md`. |
| `assets/ig_logo_2026.svg`   | instyle.group logo (use at height ~14px in headers). |
| `assets/ig_favicon_2026.png`| Favicon. |
| `assets/ig_ogp_2026-100.jpg`| OGP image (1200×630). |
| `examples/preview.html`     | Reference implementation. Open in a browser to see the target. |

---

## Bootstrap a new project (5 steps)

1. Copy `rules/claude-md-template.md` to the project root as `CLAUDE.md`,
   replace the `[...]` placeholders with project specifics.
2. Copy `rules/tokens.css` and `rules/snippets.css` into the project's
   stylesheet folder, import them before any component CSS.
3. Add `<div class="scene-bg"></div>` as the first child of `<body>`.
4. Load the font in `<head>` (Gen Interface JP ships body + Display in
   one stylesheet):
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@0.1.2/all.css">
   ```
5. Drop in the brand favicon/logo from `assets/` if the project carries the
   instyle.group identity.

---

## When you need full detail

`rules/design.md` is the authoritative specification (700+ lines). Read it
when you need:

- Color rationale, contrast tables, dark-glass behavior
- Component variations beyond the snippets (nav, table, chart, form)
- Layout / grid / breakpoint patterns
- Motion patterns and edge cases
- Accessibility specifics and fallback strategy

---

## Common mistakes to avoid

- ❌ Forgetting `scene-bg` — glass goes flat
- ❌ Using `border: 1px solid var(--color-border)` style hairlines
- ❌ Filling panels or CTAs with `#E2DD2A`
- ❌ Stacking 4+ glass materials on one screen
- ❌ Using serif / Mincho fonts (the system is sans-only)
- ❌ Hardcoding hex colors instead of tokens
- ❌ Round-arc `border-radius` only — must pair with `corner-shape`

---

*Skill version 1.0 · instyle.group Creative Team*
