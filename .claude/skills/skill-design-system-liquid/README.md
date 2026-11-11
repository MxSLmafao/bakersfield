# skill-design-system-liquid

A Claude Code skill that teaches Claude how to build UIs in the **instyle.group
"Liquid Glass" design system** — warm-neutral palette, four translucent glass
materials, backdrop-filter blur, specular highlights, and an ambient scene-bg.

> Sister skill: [`skill-design-system-flat`](https://github.com/sasaki-ta-instyle/skill-design-system-flat)
> for the flat / contrast-based variant of the same brand.

---

## What you get

- **Auto-trigger**: ask Claude for "liquid glass dashboard" / "ガラスデザインで〜"
  and the skill fires automatically.
- **Drop-in CSS**: `rules/tokens.css` + `rules/snippets.css` cover tokens and
  the main components (panel / card / button / input / scene-bg / mark).
- **Full spec**: `rules/design.md` is the 700+ line reference — Claude reads it
  on demand when deeper detail is needed.
- **Project bootstrap template**: `rules/claude-md-template.md` is a starting
  `CLAUDE.md` for new projects that adopt this system.
- **Brand assets**: logo / favicon / OGP image included in `assets/`.
- **Live preview**: open `examples/preview.html` in a browser to see what the
  target looks like.

---

## Install

```bash
git clone https://github.com/sasaki-ta-instyle/skill-design-system-liquid \
  ~/.claude/skills/skill-design-system-liquid
```

That's it. Start a Claude Code session and the skill is available.

> Skills under `~/.claude/skills/` are picked up by Claude Code on session
> start. No extra registration required.

---

## Use

In any Claude Code session, ask in natural language:

- "Liquid Glass で営業ダッシュボードのモック作って"
- "Build a liquid-glass landing page with a hero and 3-feature grid"
- "ガラスデザインのスライドを 5 枚生成して"

The skill kicks in via description match and Claude will follow the rules in
`SKILL.md` and copy the CSS in `rules/` as needed.

For a new project that should adopt the system long-term, ask Claude to
"bootstrap a new project with skill-design-system-liquid" — it will set up
`CLAUDE.md`, `tokens.css`, `snippets.css`, fonts, and the scene-bg for you.

---

## File layout

```
skill-design-system-liquid/
├── SKILL.md                  ← Claude reads this
├── README.md                 ← you are here
├── LICENSE
│
├── rules/
│   ├── design.md             ← full spec (700+ lines)
│   ├── tokens.css            ← all CSS variables
│   ├── snippets.css          ← component snippets
│   └── claude-md-template.md ← starter CLAUDE.md for new projects
│
├── assets/
│   ├── ig_logo_2026.svg
│   ├── ig_favicon_2026.png
│   └── ig_ogp_2026-100.jpg
│
└── examples/
    └── preview.html          ← reference implementation
```

---

## Preview

Open `examples/preview.html` in any modern browser (Chrome / Edge / Safari).
You should see warm neutral gradients with translucent panels stacked on top.

If the corners look like circular arcs instead of squircles, your browser
doesn't yet ship `corner-shape: superellipse(...)` — that's a graceful
visual fallback only, no functional impact.

---

## License

- **Code & spec docs**: MIT (see `LICENSE`).
- **Brand assets** (`assets/ig_*`): © 2026 instyle.group. The logo, favicon,
  and OGP image are provided for use **inside instyle.group projects**. Do
  not use them to represent another brand.

---

## Credit

Built by the instyle.group Creative Team. Pairs with
[`skill-design-system-flat`](https://github.com/sasaki-ta-instyle/skill-design-system-flat).
