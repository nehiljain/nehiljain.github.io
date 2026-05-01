---
version: "alpha"
name: Nehil Jain — Sketchnotes
description: A personal-brand sketchnote system for explaining technical concepts (GPUs, ML systems, distributed compute) as one-page hand-drawn notes, in the tradition of Mike Rohde. Canonical theme is "Macchiato Rose on Cabin Sketch"; the system also supports 13 alternate palettes and 13 alternate font sets.

colors:
  primary: "#f4dbd6"
  secondary: "#c6a0f6"
  tertiary: "#a6da95"
  neutral: "#cad3f5"

typography:
  h1:
    fontFamily: "Cabin Sketch"
    fontSize: 96px
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: 1px
  h2:
    fontFamily: "Cabin Sketch"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: 1px
  h3:
    fontFamily: "Cabin Sketch"
    fontSize: 22px
    fontWeight: 700
    letterSpacing: 0.5px
  body-lg:
    fontFamily: "Patrick Hand"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.35
  body-md:
    fontFamily: "Patrick Hand"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.35
  body-sm:
    fontFamily: "Patrick Hand"
    fontSize: 21px
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "Cabin Sketch"
    fontSize: 13px
    fontWeight: 700
    letterSpacing: 1.3px
  script:
    fontFamily: "Caveat"
    fontSize: 34px
    fontWeight: 700

rounded:
  sm: 6px
  md: 14px
  full: 9999px

spacing:
  xs: 6px
  sm: 14px
  md: 28px
  lg: 36px
  xl: 64px

components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xl}"
  badge:
    backgroundColor: "{colors.neutral}"
    textColor: "#1e2030"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  formula-card:
    backgroundColor: "#1e1e2e"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  note-bullet:
    backgroundColor: "{colors.neutral}"
    textColor: "#1e2030"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  note-bullet-accent:
    backgroundColor: "{colors.primary}"
    textColor: "#1e2030"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  highlight:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    padding: "0 2px"
  takeaway:
    backgroundColor: "transparent"
    textColor: "{colors.neutral}"
    padding: "{spacing.md} 0 0 0"
---

## Overview

This is a sketchnote system for one-page visual explainers of technical concepts. The aesthetic is hand-drawn, paper-feeling, and slightly imperfect — modeled directly on Mike Rohde's *The Sketchnote Handbook* principles:

- **Ideas, not art.** The page exists to make a complex idea click in 30 seconds. Every element earns its place by either being signal or being a wayfinding cue (a number, an arrow, a bullet) that guides the eye through the signal.
- **Hand-drawn imperfection is the message.** Subtle rotations on titles, badges, and bullets, plus SVG turbulence filters on lines and text, communicate "a person thought this through with a pen" — the opposite of slide-deck polish. Imperfection should be felt, not noticed.
- **Hierarchy through size and weight, not color.** The display title screams. The subtitle whispers. Numbered notes are the body. The takeaway closes the loop. Color is reserved for *one* accent (`primary`) plus a small set of categorical colors used inside the diagram itself.
- **Five visual ingredients per page, max:** title + badge, subtitle, one focal diagram (usually SVG), numbered notes, and a TL;DR footer. If a sixth element wants in, cut something.

The canonical theme is **Macchiato Rose** (Catppuccin-derived dark "paper" with muted rosewater accent) paired with the **Cabin Sketch** font set. The system also ships 13 alternate palettes and 13 alternate font sets, swapped at runtime via `data-palette` and `data-font` attributes on `<body>`. See *Themes* below.

## Colors

The four spec slots map to the canonical Macchiato Rose palette:

- `primary: #f4dbd6` — **rosewater accent.** The single warm hue on the page. Used for title color, takeaway emphasis, alt bullet backgrounds, the highlight band behind key phrases, and the main diagram curve. This is the color the eye lands on first.
- `secondary: #c6a0f6` — **mauve.** Used for diagram callouts and labels (e.g. "peak FLOPS", workload markers). Always paired with `primary` so the eye reads "two things matter here."
- `tertiary: #a6da95` — **green.** Reserved for axes, positive arrows, and "growth" semantics inside diagrams.
- `neutral: #cad3f5` — **ink.** Body text, note bullets, the badge, separators. This is the "pen color" of the system.

The page itself ("paper") sits underneath everything at `#1e2030` with a layered radial gradient (`#24273a` → `#1e2030` → `#181926`) and a faint dot grid at 26px intervals — meant to feel like a Catppuccin-tinted Leuchtturm sketchbook page.

The diagram layer also uses three categorical accents that sit *outside* the four spec slots (they're used only inside SVG callouts, never in the chrome):

- `red: #f0c6c6` — roof lines, ridge points, "danger / limit" semantics.
- `amber: #eed49f` — "memory bound" / "compute bound" zone labels and slope arrows.
- `purple: #c6a0f6` — workload markers and identifiers (also acts as `secondary`).

## Typography

Three font families do all the work. The display family changes per theme; the others are fixed:

- **Display (`h1`, `h2`, `h3`, `caption`)**: Cabin Sketch — a friendly hatched display face that already looks like it was drawn with a marker. Used for the title, the badge, all-caps labels (`"DECODE"`, `"PREFILL"`, `"TL;DR"`), and the small uppercase formula label.
- **Body (`body-lg`, `body-md`, `body-sm`)**: Patrick Hand — a clean handwritten sans for the subtitle, numbered note paragraphs, and the takeaway sentence.
- **Script**: Caveat (700 weight) — used sparingly for the inline `& the` connector inside the title, the formula numerator/denominator, and SVG callout labels.

The size ramp is wide on purpose: `h1` at 96px shouts at the reader from across the room, `body-sm` at 21px is comfortable for paragraphs, and `caption` at 13px is the only "small print" allowed. The line-height on display text is tight (`0.92`) so the two-line title reads as one block.

The title carries two specific transforms that aren't in the YAML because they're *aesthetic*, not tokens: line 1 rotates `-1deg`, line 2 rotates `-0.5deg` and shifts `+40px` right. Together this gives the off-the-baseline-handwritten feel.

## Layout

The page is a fixed-aspect "sheet" — `min(1180px, 100%)` wide, `padding: 56px 64px 72px`. It centers in the viewport with a dark page chrome around it (`#181926`), so the paper feels like an artifact resting on a desk.

Inside the page, the layout is:

```
┌──────────────────────────────────────────────────┐
│  [TITLE l1]                            [BADGE]   │
│  [TITLE l2]                                      │
│  [SUBTITLE]                                      │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ [FORMULA CARD]   │  │ ❶ note               │  │
│  │ [SVG DIAGRAM]    │  │ ❷ note               │  │
│  │                  │  │ ❸ note               │  │
│  │                  │  │ ❹ note (alt bullet)  │  │
│  │                  │  │ ❺ note               │  │
│  │                  │  │ ❻ note               │  │
│  │                  │  │ ❼ note (alt bullet)  │  │
│  └──────────────────┘  └──────────────────────┘  │
│                                                  │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│  [TL;DR TAKEAWAY]                                │
└──────────────────────────────────────────────────┘
```

The body grid is `1.15fr 1fr` — the diagram column is slightly wider because it carries more visual weight per square inch. Gap between columns is `36px` (`spacing.lg`); vertical rhythm between notes is `18px`.

Spacing tokens exist for `xs/sm/md/lg/xl`, but the system is forgiving: pad and gap should *feel* generous; sketchnotes breathe.

## Elevation & Depth

Shadows are used sparingly and are always **offset, hand-stamped style** — never soft Material-style ambient shadows. Two recipes:

- **Page shadow** (the "paper resting on a desk" effect):
  `0 1px 0 rgba(255,255,255,0.05) inset, 0 30px 60px -20px rgba(0,0,0,0.55), 0 8px 18px -10px rgba(0,0,0,0.4)`
- **Stamped element shadow** (badge, formula card, note bullet) — a hard offset, no blur:
  `4px 5px 0 rgba(0,0,0,0.18)` for cards, `2px 3px 0 rgba(0,0,0,0.15)` for bullets.

The page also has two depth layers built in via background:
1. A radial gradient on the page itself (warmth from the upper-left).
2. A `::before` pseudo with two crossed `repeating-linear-gradient`s at 2° and -1° at very low opacity, mixed `multiply`. This is the "paper grain."

## Shapes

- `rounded.sm: 6px` — the page itself. Just enough corner-softening to not look like a screenshot.
- `rounded.md: 14px` — the formula card and any inline badges. Friendly but still rectangular.
- `rounded.full: 9999px` — the title badge (130×130) and the numbered note bullets (36×36). Circles are the system's loudest shape; use them only for "this is a marker, look here."

The page has no internal borders or dividers except one: a `3px dashed rgba(202,211,245,0.32)` rule above the takeaway. Dashed, not solid — it's a sketchnote, not a form.

## Components

### page
The outer "paper" sheet. Background is the layered radial gradient described under *Colors* + the dot grid (`radial-gradient(circle at 1px 1px, paper-dot 1px, transparent 1.4px) 0 0 / 26px 26px`). Padding `56px 64px 72px`. Border-radius `{rounded.sm}`. Carries the page shadow and the paper-grain `::before`. Rotated `-0.4deg` overall for the "set down crooked" feel.

### badge
A 130×130 circle in the top-right of the title row. Background `{colors.neutral}`, foreground `#1e2030`. Inner content is two stacked lines: an all-caps short label (e.g. `"GPU"`) at 22px and a small Caveat sublabel (`"perf 101"`) at 13px. Has an inset `2px dashed` ring at 8px inset, and is rotated `+6deg` with the stamped shadow. The badge tells the reader the *category* of the note in one glance.

### formula-card
Optional element that sits above the diagram when the note has a defining equation. Background `#1e1e2e` (one step darker than paper), `2.5px solid {colors.neutral}` border, `{rounded.md}`. Padding `14px 24px`. Rotated `-1deg`. Contains an uppercase Cabin Sketch label, an `=` sign, and a Caveat fraction with a 2.5px ink rule between numerator and denominator. Stamped shadow.

### note-bullet
A 36×36 circle for numbered notes. Two variants:
- `note-bullet` (default) — background `{colors.neutral}`, fg `#1e2030`. Used for most items.
- `note-bullet-accent` — background `{colors.primary}`. Used for **2 of every 7 notes** to break the rhythm and signal "this one matters more" (in the canonical sketchnote, items 4 and 7).

Both rotate `-3deg` with the bullet shadow. Connected to the diagram via a thin hand-drawn `1.5px` ink line in the left margin (`opacity: 0.55`, rotated `-3deg`).

### highlight
An inline span used inside `body-sm` paragraphs to mark a key phrase. Renders as a horizontal band of `{colors.primary}` at `0.28` alpha, masked to the lower 35% of the line via `linear-gradient(transparent 55%, hi-band 55% 90%, transparent 90%)`. This mimics a marker swipe across the page. Padding `0 2px`.

### takeaway
The TL;DR sentence at the bottom of the page. Sits below a `3px dashed` separator. Body-lg weight, max-width `880px`. Always opens with a `{colors.primary}`-colored uppercase Cabin Sketch fragment (`"TL;DR →"`) followed by the punch sentence in neutral ink. One sentence. Always.

## Hand-drawn imperfection

The "drawn-by-hand" feel comes from three layered techniques:

1. **SVG turbulence filters** on diagram strokes and labels. Three named filters wobble lines and text at different intensities:
   - `rough` — `feTurbulence baseFrequency=0.022 numOctaves=2 seed=3 → feDisplacementMap scale=2.6`. Used on axes, grid, dashed roof lines, arrows, and most strokes.
   - `rough-strong` — `baseFrequency=0.03 seed=7 scale=3.6`. Used on the main roofline curve so the focal element looks the most hand-drawn.
   - `rough-text` — `baseFrequency=0.05 seed=2 scale=0.9`. Subtle wobble on SVG text labels — enough to feel hand-lettered, not so much that it's hard to read.
2. **Subtle rotations** on every chrome element: page `-0.4deg`, title L1 `-1deg`, title L2 `-0.5deg`, badge `+6deg`, formula card `-1deg`, note bullets `-3deg`. None exceeds 6°. The rotations should feel like a settled pile, not a chaotic one.
3. **Stamped offset shadows** (no blur) on the badge, formula card, and bullets, as described under *Elevation*. These read as "ink offset from the stamp" rather than as drop shadows.

Use these tools per Rohde's rule: imperfection must serve clarity. If a wobble makes a label harder to read, dial it back.

## Themes

The canonical theme — the one to use unless you have a reason — is **Macchiato Rose + Cabin Sketch**. It's set on `<body data-palette="macchiato-rose" data-font="cabin-sketch">`.

The system supports 13 alternate palettes and 13 alternate font sets, all defined as CSS variable overrides on `[data-palette="..."]` and `[data-font="..."]` selectors. They exist for one reason: when a topic *demands* a different mood. Examples:

- **Light family** — `rohde` (cream/black/orange, the original Rohde aesthetic), `moleskine` (ivory/sepia/dusty-red), `pastel` (cream + soft pastels). Use for "warm, approachable" topics.
- **Midnight family** — `midnight` (black + neon mint), `mocha-peach`, `mocha-mauve`, `mocha-sunset`, `mocha-lagoon`, `tokyo`, `solarized`, `nord`, `dracula`, `gruvbox`. Use for systems/infra/GPU topics.

Font set alternates range from `amatic` (tall, wispy) and `homemade` (cursive script) through `bungee` and `bangers` (signage/comic) to `black-ops` and `rubik-mono` (industrial). Pick the one whose voice matches the topic.

**Constraint:** never mix a Light palette with a heavy industrial font (e.g. `rohde` palette + `black-ops` font) — it breaks the warmth contract. Pick palette and font from the same emotional register.

## Print

Each sketchnote ships an `…-print.html` companion that reuses everything above with these overrides under `@media print`:

- `@page { size: 16in 11in; margin: 0.35in; }` — landscape tabloid, designed to fit the canonical layout without reflow.
- Page background forced to `#ffffff` and the paper layers and shadows preserved via `print-color-adjust: exact`. (The "paper" effect is part of the brand; we want it on paper too.)
- The Tweaks panel and any floating chrome are hidden.
- All transitions/animations disabled.
- `break-inside: avoid` on `.body-grid, .graph-col, .graph-wrap, .notes, .note, .footer` so the diagram and notes never split across pages.
- Auto-print on load after `document.fonts.ready` + a 500ms safety buffer (so Google Fonts are guaranteed loaded before the print dialog).

When making a print version: copy the screen HTML, append the print CSS block and the auto-print script, save as `<slug>-print.html`. Do not maintain two divergent stylesheets.

## Project structure

This DESIGN.md lives at `sketchnotes/DESIGN.md`. Each sketchnote is its own folder:

```
sketchnotes/
  DESIGN.md
  arithmetic-intensity/
    index.html
    index-print.html
    tweaks-panel.jsx
    uploads/
  <next-topic>/
    index.html
    ...
```

The `tweaks-panel.jsx` file is shared infrastructure (a runtime palette/font picker). It can be duplicated per project for now; promote it to a shared `_assets/` folder once a third sketchnote is added.

## Do's and Don'ts

**Do:**
- Stick to the canonical theme unless the topic actively demands a different mood.
- Use exactly one focal diagram per page. Numbered notes wrap around it.
- Cap notes at 7 items. If you have more, you have two sketchnotes.
- Use `note-bullet-accent` on **at most 2 of 7** notes — the "look here" ones.
- Use `highlight` on **at most one phrase per note**, and only on phrases that change the reader's mental model.
- Write the TL;DR before drawing anything else. If you can't, you don't yet have a sketchnote.
- Let titles run wide and rotate. Tightly-aligned titles look like slides, not sketchnotes.

**Don't:**
- Don't add gradients to text. The wobble + the marker fonts are the texture; gradient text fights them.
- Don't use icons from icon libraries. If you need an icon, draw it as an SVG inside the diagram with a `rough` filter.
- Don't introduce a fifth or sixth color outside `primary/secondary/tertiary/neutral` + the three categorical accents (`red/amber/purple`). The palette is full.
- Don't use solid borders for separation. Always dashed (`3px dashed {colors.neutral}` at low alpha).
- Don't use Material-style soft shadows. Stamped offset only.
- Don't write paragraphs. The body-sm slot tops out at ~30 words per note.
- Don't mix font sets within one page.
