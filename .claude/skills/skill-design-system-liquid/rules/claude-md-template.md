# [プロジェクト名]

> このファイルは **Liquid Glass 系プロジェクト**の `CLAUDE.md` テンプレート。
> `[...]` の部分をプロジェクトに合わせて書き換えてください。
> フラット系プロジェクトには `../design-system/CLAUDE_template.md` を使用。

---

## プロジェクト概要

**目的**: [このプロジェクトが解決する課題・提供する価値]
**対象ユーザー**: [利用者]
**制作物タイプ**: [Webアプリ / ダッシュボード / プレゼン / レポート]
**デザイン系統**: **Liquid Glass**（半透明 + backdrop-blur ベース）

---

## デザインルール

このプロジェクトは **instyle.group デザインシステム — Liquid Glass Edition** に完全準拠する。
詳細仕様: [`design.md`](./design.md) を参照。

### 必須ルール（常に守ること）

**ガラス材質（Liquid の核）**
- すべての面要素は **半透明（alpha < 1.0）+ `backdrop-filter` + 1px 白系ボーダー + 上端スペキュラハイライト** の 4 点セット
- 使う glass material は 4 種類のみ：
  - `--glass-light`（純白系）/ `--glass-warm`（暖色系・標準）
  - `--glass-tinted`（アクセント色）/ `--glass-dark`（ダーク）
- **scene-bg（楕円グラデ背景）を必ずページ最下層に敷く**

**カラー**
- ベース色は CSS 変数 `--color-*` を使用（ハードコード禁止）
- 不透明色は status / text 用のみ。面要素は必ず glass token を使う
- 同画面で 4 種以上の glass material を使わない

**タイポグラフィ**
- フォント: `Gen Interface JP`（本文）+ `Gen Interface JP Display`（見出し h1〜h4）
- タイプスケールは **モジュラースケール Perfect Fourth 1.333 / base 14px**（Flat 版は 1.25 で別物）：Display 59 / H1 44 / H2 33 / H3 25 / H4 19 / Body 14 / Small 11 / Caption 8 px
- 最小フォントサイズ: `0.6875rem (11px)` ／ Caption (8px) はチャート目盛り専用
- **明朝体は使わない**。eyebrow / 見出し / ステップ番号などには tracked sans（`font-size: 0.625rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;`）を使う

**ハイライト色 `--color-highlight: #E2DD2A`**
- **本文中で立たせたい語句のポイントマーキング専用**（蛍光ペン風）
- 実装: `mark, .mark { background: linear-gradient(180deg, transparent 60%, var(--color-highlight) 60%); padding: 0 2px; }`
- 1 ページに 2〜3 箇所まで
- CTA / アイコン背景 / glass-panel の塗り / バッジなど面要素には**使わない**

**スペーシング**
- 8px グリッド（4, 8, 12, 16, 24, 32, 48, 64, 96px）
- 余白は大きめに取る（特に glass-panel の padding は 36px 推奨）

**Border radius（Liquid 専用スケール・クロソイド式 必須）**
- 全要素の角丸は **連続曲率 superellipse（クロソイド式）** を使う。円弧角丸は使わない
- `--corner-shape: superellipse(2.5)` を定義し `*` セレクタで全要素にデフォルト適用
- 大きめ radius のパネル（`glass-panel` / `dashboard` / `canon-slide` 等）は `--corner-shape-hard: superellipse(3.5)` で iOS 感を強める
- 小さい要素（input、material tile）: `--r-sm: 10px`
- カード標準: `--r: 16px`
- 大カード: `--r-lg: 24px`
- セクションラッパー（glass-panel）: `--r-xl: 32px`
- ボタン・バッジ・ナビ: `--r-pill: 999px`（pill は stadium 形なので corner-shape は無効）
- 未対応ブラウザは通常 `border-radius` にフォールバック

**コントラスト原則（Liquid 版）**
- 区切りは「色の段差」ではなく「半透明レイヤー＋blur」で表現する
- ボーダーは `var(--color-border)` のような不透明色を使わず、**`rgba(255,255,255,0.55〜0.82)` の半透明白**を使う
- 影は `--glass-shadow-sm/md/lg`（多層）を使い、blur と highlight とセットで配置

**Glass Panel（セクションラッパー）**
```css
background: rgba(243,241,238,.50);
backdrop-filter: saturate(200%) blur(24px);
border: 1px solid rgba(255,255,255,.62);
box-shadow: var(--glass-hl), var(--glass-shadow);
border-radius: 32px;
padding: 36px;
/* 上端スペキュラ：::before で 1px の linear-gradient を必ず追加 */
```

**カード**
```css
background: rgba(243,241,238,.56);
backdrop-filter: saturate(180%) blur(16px);
border: 1px solid rgba(255,255,255,.72);
box-shadow: var(--glass-hl), var(--glass-shadow-sm);
border-radius: 16px;
padding: 24px;
```

**ボタン（Primary・dark glass）**
```css
background: rgba(32,33,26,.82);
backdrop-filter: blur(16px);
color: var(--color-text-inv);
border: 1px solid rgba(255,255,255,.14);
border-radius: 999px;
padding: 10px 22px;
box-shadow: var(--glass-hl-d), 0 4px 16px rgba(53,54,45,.28);
```

**ボタン（Secondary・warm glass）**
```css
background: rgba(243,241,238,.65);
backdrop-filter: blur(16px);
color: var(--color-text);
border: 1px solid rgba(255,255,255,.78);
border-radius: 999px;
padding: 10px 22px;
box-shadow: var(--glass-hl), var(--glass-shadow-sm);
```

**インプット**
```css
background: rgba(255,255,255,.55);
backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,.78);
border-radius: 10px;
padding: 10px 16px;
box-shadow: inset 0 1px 0 rgba(255,255,255,.85), 0 2px 8px rgba(53,54,45,.06);
```

**アニメーション**
- 標準 ease: `--ease-out: 250ms cubic-bezier(.4, 0, .2, 1)`
- spring（限定使用）: `--ease-spring: 380ms cubic-bezier(.34, 1.56, .64, 1)`
- ホバーは `translateY(-1px)` ＋ shadow 強調が定番
- Duration は 400ms 以下

**アクセシビリティ**
- 半透明背景の上でもコントラスト比 4.5:1 以上を確保
- `@supports not (backdrop-filter: blur(1px))` で fallback の不透明色を必ず指定

---

## 技術スタック

- **フレームワーク**: [React / Next.js / Vanilla HTML+CSS]
- **スタイリング**: [Tailwind CSS / CSS Variables / CSS Modules]
- **チャートライブラリ**: [Recharts / Chart.js / D3]
- **アイコン**: lucide-react

---

## ファイル構成

```
./
├── CLAUDE.md          ← このファイル
├── design.md          ← デザイン詳細仕様（Liquid Glass）
├── index.html         ← エントリーポイント
└── src/
    ├── styles/
    │   ├── tokens.css       ← CSS変数（color + glass + radius + ease）
    │   ├── glass.css        ← glass-panel / card / btn / nav
    │   └── components.css   ← その他
    └── components/
```

---

## CSS変数（tokens.css に定義）

```css
:root {
  /* ── Base palette ───────────────────────────────── */
  --color-bg:          #EDE9E0;
  --color-surface:     #F3F1EE;
  --color-surface-2:   #E6E2D7;
  --color-surface-3:   #E1DCD0;

  --color-text:         #35362D;
  --color-text-muted:   #82837A;
  --color-text-light:   #C4C1B0;
  --color-text-inv:     #F3F1EE;

  --color-success:     #7BB785;
  --color-warning:     #D4772C;
  --color-error:       #C6292C;
  --color-info:        #38537B;
  --color-highlight:   #E2DD2A;   /* マーカー・強調背景・小面積アクセント */

  /* ── Glass material tokens ──────────────────────── */
  --glass-light:    rgba(255, 255, 255, 0.55);
  --glass-warm:     rgba(243, 241, 238, 0.58);
  --glass-tinted:   rgba(196, 193, 176, 0.42);
  --glass-dark:     rgba( 32,  33,  26, 0.78);

  --glass-border-l: rgba(255, 255, 255, 0.80);
  --glass-border-w: rgba(255, 255, 255, 0.62);
  --glass-border-d: rgba(255, 255, 255, 0.13);

  --glass-blur-sm:  saturate(180%) blur(16px);
  --glass-blur:     saturate(200%) blur(24px);
  --glass-blur-lg:  saturate(220%) blur(40px);

  --glass-shadow-sm: 0 2px 12px  rgba(53,54,45,.09), 0 1px 4px  rgba(53,54,45,.07);
  --glass-shadow:    0 8px 32px  rgba(53,54,45,.11), 0 2px 8px  rgba(53,54,45,.08);
  --glass-shadow-lg: 0 20px 64px rgba(53,54,45,.16), 0 4px 16px rgba(53,54,45,.10);

  --glass-hl:    inset 0 1px 0 rgba(255,255,255,.90), inset 0 -1px 0 rgba(0,0,0,.055);
  --glass-hl-d:  inset 0 1px 0 rgba(255,255,255,.18), inset 0 -1px 0 rgba(0,0,0,.22);

  /* ── Radii ──────────────────────────────────────── */
  --r-sm:   10px;
  --r:      16px;
  --r-lg:   24px;
  --r-xl:   32px;
  --r-pill: 999px;

  /* ── Corner shape（クロソイド式 / Squircle）─────── */
  --corner-shape:      superellipse(2.5);  /* 標準 */
  --corner-shape-soft: superellipse(2);    /* 丸寄り */
  --corner-shape-hard: superellipse(3.5);  /* スクエア寄り（大パネル向け） */

  /* ── Typography & motion ────────────────────────── */
  --font-sans:    'Gen Interface JP', sans-serif;
  --font-display: 'Gen Interface JP Display', 'Gen Interface JP', sans-serif;

  --ease-out:    250ms cubic-bezier(.4, 0, .2, 1);
  --ease-spring: 380ms cubic-bezier(.34, 1.56, .64, 1);
}

/* 全要素にクロソイド式角丸をデフォルト適用 */
* { corner-shape: var(--corner-shape); }

/* 見出しは Display を当てる */
h1, h2, h3, h4 { font-family: var(--font-display); }

/* 大きめ radius のパネルは hard 指数で iOS 感を強める */
.glass-panel, .dashboard, .canon-slide {
  corner-shape: var(--corner-shape-hard);
}
```

---

## Ambient scene 背景（必須）

`<body>` の最初に挿入：

```html
<div class="scene-bg"></div>
```

```css
.scene-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: #EDE9E0;
  overflow: hidden;
  pointer-events: none;
}
.scene-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 72% 65% at  8%  6%, rgba(196,193,176,.58) 0%, transparent 55%),
    radial-gradient(ellipse 55% 55% at 94% 10%, rgba(230,226,215,.65) 0%, transparent 52%),
    radial-gradient(ellipse 52% 68% at 78% 88%, rgba(196,193,176,.42) 0%, transparent 55%),
    radial-gradient(ellipse 66% 46% at 18% 92%, rgba(230,226,215,.52) 0%, transparent 55%),
    radial-gradient(ellipse 42% 42% at 50% 48%, rgba(243,241,238,.32) 0%, transparent 52%);
}
.page-header, .container, footer { position: relative; z-index: 1; }
```

---

## フォント読み込み（HTML head）

```html
<!-- Gen Interface JP（本文 + Display を一括配信） -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@0.1.2/all.css">
```

---

## 制作上の注意点

- [プロジェクト固有の注意点があればここに追記]
- データはモックで構わないが、実際の業務に近い現実的な数値・ラベルを使う
- 日本語と英語が混在する場合、フォントの混在に注意
- Liquid 系では **scene-bg を忘れない**（無いと glass のっぺり）
- `backdrop-filter` 非対応ブラウザの fallback を必ず入れる

---

*テンプレートバージョン: Liquid 1.0 | instyle.group Creative Team*
