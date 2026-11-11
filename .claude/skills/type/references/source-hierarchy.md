# Source hierarchy

Every skill in this pack resolves conflicts with the same ordered list. When two
sources disagree, the higher-numbered rule loses.

1. **Accessibility standards and browser behavior** — WCAG 2.2, MDN, actual
   rendering. A rule that fails WCAG or does not render is wrong regardless of
   which book it came from.
2. **User and product context** — reading distance, device, content type,
   audience, brand constraints, existing design system.
3. **Thinking with Type** (Lupton, 3rd ed. 2024) — typographic foundations.
4. **Web Typography** (Rutter, 2017) — web implementation.
5. **Flexible Typesetting** (Brown, 2018) — responsive and fluid reasoning.
6. **Detail in Typography** (Hochuli, 2008) — microtypography, reading quality.
7. **Typographic Systems** (Elam, 2007) — spatial composition.
8. **The supporting books** — Coles, Lupton (*Type on Screen*), Latin,
   Santa Maria, Stocks.
9. **Style trends and subjective convention** — lowest authority. Never cite a
   trend against any rule above it.

## Why this order

The books are print-era and pre-date current browser behavior. They are
authoritative on **judgment** — what makes text readable, what makes a
composition hold together, why a typeface reads as unobtrusive or editorial. They
are *not* authoritative on **implementation**: Rutter (2017) describes
`font-display` as "a nascent CSS property under development," and both Rutter and
Santa Maria recommend Web Font Loader. Both statements were true when written and
are obsolete now.

**Books teach judgment. Current standards teach implementation.**

## Living sources — always check before emitting code

| Source | Owns |
|---|---|
| [MDN CSS Fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts) | `@font-face`, font loading, variable fonts, OpenType features, current browser support |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | contrast, resize, text spacing, images of text |
| [web.dev fonts](https://web.dev/learn/performance/optimize-web-fonts) | subsetting, preloading, variable-font tradeoffs, CLS |
| [W3C Internationalization](https://www.w3.org/International/) | non-Latin scripts, vertical text, bidi |

## The rule about numbers

Never encode a bare constant as a universal.

> ❌ "Body text should always be 16px."

Encode the decision procedure and its inputs instead:

> ✅ Determine body-text size from the typeface's apparent size, x-height, target
> device, reading distance, content density, user needs, and available line
> length. Treat 16px as a common browser-oriented starting point, not a universal
> optimum. Validate readability, zoom behavior, line length, and hierarchy in the
> rendered context.

Where the corpus itself disagrees, say so and give the reasoning, not an average.
Measure is the standing example — see `references/corpus-conflicts.md`.
