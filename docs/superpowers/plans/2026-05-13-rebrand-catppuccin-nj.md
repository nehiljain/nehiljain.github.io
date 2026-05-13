# Personal Site Rebrand (Catppuccin / NJ) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand nehiljain.com to match the approved Catppuccin Latte/Macchiato design system: new logo, new typography, new color tokens, new icon set, redesigned nav/footer/home/writing-list/post pages, and "paper-plate" image treatment for sketchnotes.

**Architecture:** Port the JSX prototype (in `/tmp/design-rebrand/personal-website/project/`) into the existing Next.js 14 + Tailwind + shadcn codebase as production React components. Replace the existing HSL CSS variables with Catppuccin Latte/Macchiato tokens, add design-specific fonts via `next/font/google`, and rebuild the four route pages (`/`, `/writing`, `/writing/[...slug]`, plus shared chrome) to match the design. The "tweaks panel" from the prototype is a design tool, not shipped. Variant choice for the writing list: **Editorial (Variant 1)** — matches the home page's row pattern and supports the hero-image front-matter field that the user explicitly requested. The other two variants are not implemented (they can be added later if wanted).

**Tech Stack:** Next.js 14 App Router · Tailwind CSS · shadcn/ui · Velite (MDX) · next-themes · `next/font/google` (Bagel Fat One, Geist Sans, JetBrains Mono, Caveat, Fraunces).

**Defaults (per final state of the design + user comments):**

- Default theme: **Macchiato (dark)**, accent **peach** (`#f5a97f` dark / `#fe640b` light).
- Default heading font: **Geist Sans** (user explicitly rejected Fraunces' ornate ampersand; Geist is the techy/clean/nerdy choice).
- Display font (logo + one hero word per page): **Bagel Fat One**.
- Body + UI font: **Geist Sans**. Mono: **JetBrains Mono**. Script accent: **Caveat**.
- Content widths: home & writing list 1080px; post page 1080px with three rails; nav max-width 1180px.
- Byline / avatar / "MTS Anyscale" removed from post header per user comment.

**Reference files (read these as you implement each section):**

- Tokens: `/tmp/design-rebrand/personal-website/project/tokens.jsx`
- Logo: `/tmp/design-rebrand/personal-website/project/nj-logo.jsx`
- Icons: `/tmp/design-rebrand/personal-website/project/icons.jsx`
- Chrome (nav/footer/tag pill/doodle arrow): `/tmp/design-rebrand/personal-website/project/chrome.jsx`
- Home: `/tmp/design-rebrand/personal-website/project/artboard-home.jsx`
- Writing list (editorial variant + others): `/tmp/design-rebrand/personal-website/project/artboard-writing.jsx`
- Post page: `/tmp/design-rebrand/personal-website/project/artboard-post.jsx`
- Brand swatches (for reference only, not a route): `/tmp/design-rebrand/personal-website/project/artboard-brand.jsx`

---

## File Structure (high level)

**Create:**

- `lib/design-tokens.ts` — color/width/typography constants exported as TS so components can reference them when CSS vars aren't enough (e.g. SVG fills).
- `components/brand/nj-mark.tsx` — `NJMark`, `NJWordmark`, `NJLockup`, `NJStamp` SVG components.
- `components/brand/icon.tsx` — `Icon.*` duotone set + the `NJIcon` wrapper.
- `components/brand/doodle-arrow.tsx` — rough SVG arrow used as visual flourish.
- `components/brand/tag-pill.tsx` — replaces existing `components/tag.tsx`'s usage in lists (keep `tag.tsx` for the tag-index `/tags` page; new `TagPill` for inline contexts).
- `components/brand/hero-thumb.tsx` — cream "paper plate" thumbnail wrapper for list rows.
- `components/brand/sketchnote-plate.tsx` — full-width paper-plate wrapper for in-post sketchnote figures.
- `components/brand/section-head.tsx` — kicker + title + optional "view all" link.
- `components/brand/buttons.tsx` — `SolidBtn`, `OutlineBtn`, `GhostBtn` matching the design.
- `components/brand/callout.tsx` — replaces the existing `components/callout.tsx` with peach-bordered design version (keep old file path; update contents).
- `components/home/hero.tsx`, `components/home/now-section.tsx`, `components/home/latest-posts.tsx`, `components/home/contact.tsx`
- `components/writing/editorial-row.tsx` — used by both home "Latest" and `/writing` list.

**Modify:**

- `app/globals.css` — replace HSL token block with Catppuccin tokens (Latte + Macchiato) and add font CSS variables.
- `tailwind.config.ts` — add `font-display`, `font-mono`, `font-script`, `font-heading` families; add `accent-soft`, `paper`, `paperInk` etc. to colors.
- `app/layout.tsx` — load fonts via `next/font/google`, attach CSS vars to `<body>`, set `defaultTheme="dark"`.
- `components/site-header.tsx` — rebuild as the new sticky nav with `NJLockup`, pill nav items, icon buttons, theme toggle.
- `components/site-footer.tsx` — rebuild with `NJMark`, mono "SF · AI INFRASTRUCTURE · YYYY" line, social icons.
- `components/main-nav.tsx` — replaced inline by new `site-header.tsx`; delete this file.
- `components/mobile-nav.tsx` — adjust to new logo/nav (minimal updates: swap logo, color tokens).
- `components/post-item.tsx` — replace internals with `EditorialRow` rendering.
- `components/mdx.tsx` and `components/mdx-components.tsx` — wire `SketchnotePlate` + new `Callout` into MDX.
- `app/page.tsx` — recompose into Hero + NowSection + LatestPosts + Contact.
- `app/writing/page.tsx` — recompose into WritingHero + Editorial list + sidebar.
- `app/writing/[...slug]/page.tsx` — recompose with 3-rail layout, paper-plate hero image, new typography.
- `styles/mdx.css` — adjust prose colors for the new tokens; bump max-width to 720.
- `velite.config.ts` — add `image?: s.string().optional()` to post schema for hero front-matter.
- `data/resume.ts` — keep, used by nav/CV; no schema change.
- `config/metadata.ts` — bump `themeColor` from `#ffffff` to Macchiato base.

**Delete:**

- `components/icons copy.tsx` (stale dup).

---

### Task 1: Catppuccin color tokens in CSS

**Files:**

- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace the `:root` and `.dark` blocks in `app/globals.css`**

Read [tokens.jsx](/tmp/design-rebrand/personal-website/project/tokens.jsx) lines 7–95 for canonical hex values. Convert to HSL using your standard converter, or use the values below (already converted, double-check first two and trust the rest).

Replace the entire `@layer base { :root { ... } .dark { ... } }` block with:

```css
@layer base {
  :root {
    /* Catppuccin Latte (light) — paper-shifted */
    --background: 39 18% 90%; /* #ece9e2 */
    --foreground: 234 16% 35%; /* #4c4f69 */
    --card: 40 33% 94%; /* #f4f1ea */
    --card-foreground: 234 16% 35%;
    --popover: 40 33% 94%;
    --popover-foreground: 234 16% 35%;
    --primary: 234 16% 35%;
    --primary-foreground: 39 18% 90%;
    --secondary: 39 12% 84%; /* mantle */
    --secondary-foreground: 234 16% 35%;
    --muted: 39 12% 84%;
    --muted-foreground: 233 10% 47%; /* subtext0 #6c6f85 */
    --accent: 22 99% 52%; /* peach #fe640b */
    --accent-foreground: 39 18% 90%;
    --accent-soft: 22 99% 52% / 0.18; /* rgba peach 18% */
    --destructive: 347 87% 44%;
    --destructive-foreground: 39 18% 90%;
    --border: 39 12% 82%; /* crust */
    --input: 39 12% 82%;
    --ring: 22 99% 52%;
    --rule: 220 14% 71%; /* surface2 */
    --paper: 40 38% 95%; /* #f7f4ec */
    --paper-ink: 234 16% 28%;
    --radius: 0.625rem;
  }
  .dark {
    /* Catppuccin Macchiato */
    --background: 232 23% 18%; /* #24273a */
    --foreground: 227 70% 87%; /* #cad3f5 */
    --card: 231 20% 15%; /* mantle #1e2030 */
    --card-foreground: 227 70% 87%;
    --popover: 231 20% 15%;
    --popover-foreground: 227 70% 87%;
    --primary: 227 70% 87%;
    --primary-foreground: 232 23% 18%;
    --secondary: 230 17% 26%; /* surface0 */
    --secondary-foreground: 227 70% 87%;
    --muted: 230 17% 26%;
    --muted-foreground: 228 24% 72%; /* subtext0 #a5adcb */
    --accent: 22 84% 73%; /* peach #f5a97f */
    --accent-foreground: 232 23% 18%;
    --accent-soft: 22 84% 73% / 0.28;
    --destructive: 351 74% 73%;
    --destructive-foreground: 232 23% 18%;
    --border: 230 17% 26%;
    --input: 230 17% 26%;
    --ring: 22 84% 73%;
    --rule: 230 13% 37%; /* surface1 */
    --paper: 40 25% 89%; /* cream paper plate #e9e5dd */
    --paper-ink: 232 15% 28%;
  }
}
```

- [ ] **Step 2: Extend `tailwind.config.ts` with the new tokens**

Add inside `theme.extend.colors`:

```ts
rule: 'hsl(var(--rule))',
paper: 'hsl(var(--paper))',
'paper-ink': 'hsl(var(--paper-ink))',
'accent-soft': 'hsl(var(--accent-soft))',
```

Add inside `theme.extend.fontFamily`:

```ts
display: ['var(--font-display)', 'sans-serif'],
heading: ['var(--font-heading)', 'sans-serif'],
sans: ['var(--font-sans)', ...fontFamily.sans],
mono: ['var(--font-mono)', ...fontFamily.mono],
script: ['var(--font-script)', 'cursive'],
```

Add to `theme.extend.maxWidth`:

```ts
'content': '1080px',
'nav': '1180px',
'prose-tight': '720px',
'prose-wide': '760px',
```

- [ ] **Step 3: Run dev server, verify colors load**

```bash
pnpm dev
```

Open `http://localhost:3000`. Expect: existing layout, but background turns cream (light) / dusk navy (dark). Toggle theme — colors should shift. Some hard-coded gray text from old shadcn still visible; that's fine for now.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "design(tokens): swap to Catppuccin Latte/Macchiato + paper tokens"
```

---

### Task 2: Load brand fonts via next/font

**Files:**

- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the existing `Inter` import + setup**

```tsx
import {
  Bagel_Fat_One,
  Geist,
  Geist_Mono,
  JetBrains_Mono,
  Caveat
} from 'next/font/google';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});
const fontHeading = Geist({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['600', '700'],
  display: 'swap'
});
const fontDisplay = Bagel_Fat_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap'
});
const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});
const fontScript = Caveat({
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap'
});
```

Replace the `<body>` className with:

```tsx
<body
  className={cn(
    'min-h-screen bg-background font-sans antialiased',
    fontSans.variable,
    fontHeading.variable,
    fontDisplay.variable,
    fontMono.variable,
    fontScript.variable
  )}
>
```

Change `defaultTheme="system"` to `defaultTheme="dark"`.

- [ ] **Step 2: Verify fonts load**

```bash
pnpm dev
```

Open devtools → Network → confirm 5 woff2s load. Inspect `<body>` → confirm 5 CSS variables present (`--font-sans`, `--font-display`, etc.).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "design(fonts): swap to Bagel Fat One, Geist, JetBrains Mono, Caveat"
```

---

### Task 3: Design tokens TS module

Some components need raw hex (SVG `fill={...}`, inline shadow with rgba). One source of truth.

**Files:**

- Create: `lib/design-tokens.ts`

- [ ] **Step 1: Create `lib/design-tokens.ts`**

```ts
// Raw color values for places CSS vars can't reach (SVG fill/stroke, dynamic JS).
// Keep in sync with app/globals.css.

export const NJ_MARK_INK = '#11111b'; // near-black "nj" letters
export const NJ_PEACH = '#fe640b'; // canonical peach (latte)
export const NJ_PEACH_DARK = '#f5a97f'; // macchiato peach

export const LATTE = {
  base: '#ece9e2',
  mantle: '#e3e0d8',
  crust: '#d8d4cb',
  text: '#4c4f69',
  sub: '#6c6f85',
  mute: '#9ca0b0',
  peach: '#fe640b',
  yellow: '#df8e1d',
  green: '#40a02b',
  blue: '#1e66f5',
  mauve: '#8839ef',
  red: '#d20f39',
  teal: '#179299'
} as const;

export const MACCHIATO = {
  base: '#24273a',
  mantle: '#1e2030',
  crust: '#181926',
  text: '#cad3f5',
  sub: '#a5adcb',
  mute: '#8087a2',
  peach: '#f5a97f',
  yellow: '#eed49f',
  green: '#a6da95',
  blue: '#8aadf4',
  mauve: '#c6a0f6',
  red: '#ed8796',
  teal: '#8bd5ca'
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add lib/design-tokens.ts
git commit -m "design(tokens): add TS palette for SVG-bound colors"
```

---

### Task 4: NJ logo components (mark / lockup / stamp)

**Files:**

- Create: `components/brand/nj-mark.tsx`

- [ ] **Step 1: Port `NJMark`, `NJWordmark`, `NJLockup`, `NJStamp` from `nj-logo.jsx`**

Read [nj-logo.jsx](/tmp/design-rebrand/personal-website/project/nj-logo.jsx) lines 1–152. Port verbatim to TSX. Keep the hardcoded `NJ_MARK_INK = '#11111b'` rule (this was an explicit fix the user asked for — contrast on the peach).

Signature changes vs the prototype:

- Accept `accent?: string` defaulting to `'currentColor'`-style — for SSR safety, accept it as a prop from the parent (which reads it from `getComputedStyle` or just passes the peach hex from `lib/design-tokens.ts`).
- Use `'use client'` only if you need DOM access. None of these do (pure SVG), so they are **server components** by default.

Skeleton:

```tsx
import { NJ_MARK_INK, NJ_PEACH } from '@/lib/design-tokens';

export function NJMark({
  size = 48,
  accent = NJ_PEACH,
  tilt = 0,
  bg = null as string | null
}) {
  const ratio = 1.18;
  const w = size * ratio;
  const h = size;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        display: 'block',
        overflow: 'visible',
        transform: `rotate(${tilt}deg)`
      }}
    >
      {bg && (
        <rect x={0} y={0} width={w} height={h} rx={size * 0.16} fill={bg} />
      )}
      <ellipse
        cx={w * 0.5}
        cy={h * 0.58}
        rx={w * 0.42}
        ry={h * 0.34}
        fill={accent}
      />
      <text
        x={w * 0.5}
        y={h * 0.93}
        textAnchor="middle"
        fontFamily="var(--font-display), system-ui, sans-serif"
        fontSize={h * 1.05}
        fontWeight={400}
        fill={NJ_MARK_INK}
        letterSpacing={-h * 0.04}
      >
        nj
      </text>
    </svg>
  );
}
```

Port `NJWordmark` (lines 52–85), `NJLockup` (lines 88–107), `NJStamp` (lines 112–150) using the same translations:

- Inline `style={{ fontFamily: "'Bagel Fat One',…" }}` → `style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}`.
- Same for Caveat → `var(--font-script)` and JetBrains Mono → `var(--font-mono)`.

Export all four named exports plus the constants.

- [ ] **Step 2: Smoke-test by temporarily mounting on the homepage**

Edit `app/page.tsx`: add `<NJMark size={120} />` near the top. Run `pnpm dev`, visit `/`, see the peach blob with "nj". Remove the test mount.

- [ ] **Step 3: Commit**

```bash
git add components/brand/nj-mark.tsx
git commit -m "design(brand): add NJMark, NJWordmark, NJLockup, NJStamp SVG components"
```

---

### Task 5: Custom duotone Icon set

**Files:**

- Create: `components/brand/icon.tsx`
- Delete: `components/icons copy.tsx`

- [ ] **Step 1: Port `NJIcon` + the `Icon` object from `icons.jsx`**

Read [icons.jsx](/tmp/design-rebrand/personal-website/project/icons.jsx) entire file. Port to TSX. Each icon is a small functional component; the `Icon` export is a namespace object with all of them.

```tsx
'use client';
import * as React from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
  fill?: string;
  weight?: number;
  className?: string;
};

export function NJIcon({
  size = 24,
  stroke,
  fill,
  weight = 2.4,
  children
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, color: 'currentColor' }}
    >
      <g stroke={stroke ?? 'currentColor'} fill="none">
        {React.Children.map(children, (c) => {
          if (!c || !React.isValidElement(c)) return c;
          if ((c.props as any)['data-duo'] === 'fill') {
            return React.cloneElement(c, {
              fill: fill ?? 'currentColor',
              fillOpacity: (c.props as any).fillOpacity ?? 0.22,
              stroke: 'none'
            } as any);
          }
          return c;
        })}
      </g>
    </svg>
  );
}
```

Then `export const Icon = { Home: (p) => …, Writing: …, Projects: …, CV: …, Search: …, Mail: …, Github: …, LinkedIn: …, Twitter: …, ArrowRight: …, ArrowUpRight: …, Tag: …, Calendar: …, Clock: …, Spark: …, Sun: …, Moon: …, Code: …, Stack: … };` — copy paths verbatim from the source.

- [ ] **Step 2: Delete the stale duplicate icons file**

```bash
git rm "components/icons copy.tsx"
```

- [ ] **Step 3: Verify by mounting `<Icon.Writing size={32} />` on homepage temporarily, see chunky duotone glyph**

Remove the test mount after confirming.

- [ ] **Step 4: Commit**

```bash
git add components/brand/icon.tsx
git commit -m "design(brand): port custom duotone Icon set, drop stale icons copy"
```

---

### Task 6: Small shared brand components

**Files:**

- Create: `components/brand/doodle-arrow.tsx`
- Create: `components/brand/tag-pill.tsx`
- Create: `components/brand/section-head.tsx`
- Create: `components/brand/buttons.tsx`
- Create: `components/brand/hero-thumb.tsx`
- Create: `components/brand/sketchnote-plate.tsx`

- [ ] **Step 1: DoodleArrow** — port from `chrome.jsx` lines 167–182. Props: `color`, `width`, `height`, `style`.

- [ ] **Step 2: TagPill** — port from `chrome.jsx` lines 145–164. Tailwind classes preferred over inline; structure:

```tsx
export function TagPill({
  children,
  accent = false,
  size = 'sm'
}: {
  children: React.ReactNode;
  accent?: boolean;
  size?: 'sm' | 'md';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-mono font-medium lowercase tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        accent
          ? 'border border-accent bg-accent-soft text-foreground'
          : 'border border-rule text-muted-foreground'
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: SectionHead** — port from `artboard-home.jsx` lines 263–288. Props: `kicker`, `title`, `linkText?`, `linkHref?`.

- [ ] **Step 4: Buttons (`SolidBtn`, `OutlineBtn`, `GhostBtn`)** — port from `artboard-brand.jsx` lines 261–296. Single file.

```tsx
export function SolidBtn({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center gap-2 rounded-[10px] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground',
        'shadow-[3px_3px_0_hsl(var(--foreground))]',
        className
      )}
    >
      {children}
    </button>
  );
}
// OutlineBtn, GhostBtn — same pattern, see artboard-brand.jsx
```

- [ ] **Step 5: HeroThumb** — port from `artboard-home.jsx` lines 203–225. The tilted cream-paper-plate thumbnail. Props: `src`, `alt`, `width?`, `height?`.

- [ ] **Step 6: SketchnotePlate** — port from `artboard-post.jsx` lines 222–259. The big in-post version with a `DoodleArrow` flourish + `figcaption` in Caveat. Accept `src`, `alt`, `caption?` props.

```tsx
export function SketchnotePlate({
  src,
  alt,
  caption
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-8 max-w-[720px]">
      <div className="relative -rotate-[0.5deg] rounded-2xl border border-border bg-paper p-4 shadow-[5px_6px_0_rgba(0,0,0,0.22)] dark:shadow-[5px_6px_0_rgba(0,0,0,0.44)]">
        <div
          className="relative overflow-hidden rounded-[10px] bg-[#1e2030]"
          style={{ aspectRatio: '643 / 590' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        </div>
        <DoodleArrow
          color="hsl(var(--accent))"
          width={80}
          height={44}
          style={{
            position: 'absolute',
            top: -22,
            right: 14,
            transform: 'rotate(-12deg)'
          }}
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-script text-lg font-bold text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 7: Commit all six**

```bash
git add components/brand/
git commit -m "design(brand): add TagPill, SectionHead, Buttons, HeroThumb, SketchnotePlate, DoodleArrow"
```

---

### Task 7: Callout component (replaces existing)

**Files:**

- Modify: `components/callout.tsx`

- [ ] **Step 1: Read current `components/callout.tsx`**

```bash
cat components/callout.tsx
```

- [ ] **Step 2: Replace contents with the peach-bordered design version**

Port from `artboard-brand.jsx` lines 332–351 + `artboard-post.jsx` lines 327–351 (`Callout` + `CalloutInline`). One component, supporting optional `title` and optional inline-icon. Keep the existing exported name `Callout` so MDX usage keeps working.

```tsx
import { Icon } from '@/components/brand/icon';
import { cn } from '@/lib/utils';

export function Callout({
  title,
  children,
  className
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'my-7 flex items-start gap-3 rounded-r-xl border-l-4 border-accent bg-accent-soft px-4 py-3',
        className
      )}
    >
      <Icon.Spark
        size={20}
        stroke="hsl(var(--foreground))"
        fill="hsl(var(--accent))"
      />
      <div>
        {title && <div className="font-semibold text-foreground">{title}</div>}
        <div className="mt-0.5 text-foreground leading-relaxed">{children}</div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/callout.tsx
git commit -m "design(brand): peach-bordered Callout with Spark icon"
```

---

### Task 8: New site header (nav)

**Files:**

- Modify: `components/site-header.tsx`
- Delete: `components/main-nav.tsx` (logic absorbed into site-header)

- [ ] **Step 1: Rebuild `components/site-header.tsx`**

Port from `chrome.jsx` lines 23–83 (`NavHeader`). Sticky header, max-w-nav (1180px), `NJLockup` left, pill nav items center-right with active state, then a small divider, then social icon buttons (Github / LinkedIn / Twitter / Mail), then theme toggle (uses existing `<ThemeToggle />`). Data source: keep using `DATA.contact.social` and `DATA.navbar` from `data/resume.ts` — match icons to the new `Icon` namespace.

Pseudo-structure:

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NJLockup } from '@/components/brand/nj-mark';
import { Icon } from '@/components/brand/icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { DATA } from '@/data/resume';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/writing', label: 'Writing', icon: Icon.Writing },
  { href: '/projects', label: 'Projects', icon: Icon.Projects },
  { href: '/cv', label: 'CV', icon: Icon.CV }
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-nav items-center justify-between gap-6 px-8 py-3.5">
        <Link href="/" aria-label="Home">
          <NJLockup size={26} />
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const I = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13.5px] font-semibold transition-colors',
                  isActive
                    ? 'border-accent bg-accent-soft text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <I
                  size={16}
                  stroke={isActive ? 'hsl(var(--foreground))' : 'currentColor'}
                  fill="hsl(var(--accent))"
                />
                {item.label}
              </Link>
            );
          })}
          <span className="mx-1.5 h-4 w-px bg-rule" />
          {/* Social icon buttons — pull from DATA.contact.social; map labels to Icon.Github/LinkedIn/Twitter/Mail */}
          {/* Theme toggle last */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
```

For mobile: the prototype doesn't show a mobile design. Keep the existing `<MobileNav />` import + render for `sm:hidden`; just wrap nav items in `hidden sm:flex`.

- [ ] **Step 2: Delete now-unused `main-nav.tsx`**

```bash
git rm components/main-nav.tsx
```

Remove its import from `site-header.tsx` (already replaced inline).

- [ ] **Step 3: Verify**

```bash
pnpm dev
```

Visit `/`, `/writing`. Active pill should highlight peach. Logo should be the "nj" peach blob.

- [ ] **Step 4: Commit**

```bash
git add components/site-header.tsx
git commit -m "design(nav): sticky pill nav with NJLockup + duotone icons"
```

---

### Task 9: New site footer

**Files:**

- Modify: `components/site-footer.tsx`
- Modify: `app/layout.tsx` (mount Footer)

- [ ] **Step 1: Replace `components/site-footer.tsx` contents**

Port from `chrome.jsx` lines 101–142. NJMark + name + mono SF-AI-INFRA-YYYY line + social icons (link out, target=\_blank). Use `DATA.contact.social` for the social URLs.

```tsx
import Link from 'next/link';
import { NJMark } from '@/components/brand/nj-mark';
import { Icon } from '@/components/brand/icon';
import { DATA } from '@/data/resume';

export function SiteFooter() {
  const socials = [
    { key: 'Github', url: DATA.contact.social.GitHub.url, I: Icon.Github },
    {
      key: 'LinkedIn',
      url: DATA.contact.social.LinkedIn.url,
      I: Icon.LinkedIn
    },
    { key: 'Twitter', url: DATA.contact.social.Twitter.url, I: Icon.Twitter },
    { key: 'Mail', url: `mailto:${DATA.email}`, I: Icon.Mail }
  ];
  return (
    <footer className="mt-20 border-t border-dashed border-rule px-8 py-8">
      <div className="mx-auto flex max-w-nav flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <NJMark size={28} />
          <div>
            <div className="text-[13.5px] font-semibold text-foreground">
              {DATA.name}
            </div>
            <div className="font-mono text-[11px] tracking-wider text-muted-foreground">
              SF · AI INFRASTRUCTURE · {new Date().getFullYear()}
            </div>
          </div>
        </div>
        <div className="flex gap-3.5">
          {socials.map((s) => (
            <Link
              key={s.key}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <s.I size={18} fill="hsl(var(--accent))" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Mount in `app/layout.tsx`**

Inside the `<div className="relative flex min-h-screen flex-col">`, after the `<div className="flex-1">{children}</div>`, add `<SiteFooter />`. Import `SiteFooter` from `@/components/site-footer`.

- [ ] **Step 3: Verify on dev**

Scroll to bottom of `/`. Expect dashed top border, peach NJ mark, mono caption line, four social icons.

- [ ] **Step 4: Commit**

```bash
git add components/site-footer.tsx app/layout.tsx
git commit -m "design(footer): NJ mark + mono caption + social row"
```

---

### Task 10: Add hero `image` field to post schema

**Files:**

- Modify: `velite.config.ts`

- [ ] **Step 1: Add `image` to the post schema**

```ts
.object({
  slug: s.path(),
  title: s.string().max(99),
  description: s.string().max(999).optional(),
  date: s.isodate(),
  published: s.boolean().default(true),
  tags: s.array(s.string()).optional(),
  image: s.string().optional(),   // NEW — hero image URL/path, used in list views + post header
  body: s.mdx(),
  code: s.mdx(),
})
```

- [ ] **Step 2: Restart dev server, confirm no schema error**

```bash
pnpm dev
```

Existing posts have no `image` field; that's fine because it's optional.

- [ ] **Step 3: Commit**

```bash
git add velite.config.ts
git commit -m "content(schema): add optional image field for post hero"
```

---

### Task 11: Editorial post row (used by home + writing)

**Files:**

- Create: `components/writing/editorial-row.tsx`

- [ ] **Step 1: Port `EditorialRow`**

From `artboard-home.jsx` lines 144–198. Single component that handles both image-present and image-absent layouts. Props: `post: { slug, title, description?, date, tags?, image?, readTime? }`, `index: number`.

```tsx
import Link from 'next/link';
import { TagPill } from '@/components/brand/tag-pill';
import { HeroThumb } from '@/components/brand/hero-thumb';
import { Icon } from '@/components/brand/icon';
import { formatDate, getReadingTime } from '@/lib/utils';

type Post = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  image?: string;
  body?: string;
};

export function EditorialRow({
  post,
  index,
  accent = false
}: {
  post: Post;
  index: number;
  accent?: boolean;
}) {
  const hasImage = !!post.image;
  const readTime = post.body ? getReadingTime(post.body) : null;
  return (
    <Link
      href={'/' + post.slug}
      className="grid grid-cols-[52px_1fr_200px] items-start gap-6 border-t border-rule/40 py-6 no-underline"
    >
      <div className="pt-1 font-mono text-[11px] font-semibold tracking-wide text-muted-foreground">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        {post.tags && post.tags.length > 0 && (
          <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
            {post.tags.map((t, i) => (
              <TagPill key={t} accent={accent && i === 0}>
                {t}
              </TagPill>
            ))}
          </div>
        )}
        <h3 className="m-0 font-heading text-[28px] font-semibold leading-tight tracking-tight text-foreground">
          {post.title}
        </h3>
        {post.description && (
          <p className="mt-2 max-w-[620px] text-base leading-relaxed text-muted-foreground">
            {post.description}
          </p>
        )}
        {hasImage && (
          <div className="mt-3 flex items-center gap-3.5 font-mono text-[11px] text-muted-foreground">
            <span>{formatDate(post.date)}</span>
            {readTime && (
              <span className="inline-flex items-center gap-1">
                <Icon.Clock size={12} fill="hsl(var(--accent))" />
                {readTime}
              </span>
            )}
          </div>
        )}
      </div>
      {hasImage ? (
        <HeroThumb src={post.image!} alt={post.title} />
      ) : (
        <div className="flex flex-col items-end gap-2 pt-1.5 font-mono text-[11px] text-muted-foreground">
          <span>{formatDate(post.date)}</span>
          {readTime && (
            <span className="inline-flex items-center gap-1">
              <Icon.Clock size={12} fill="hsl(var(--accent))" />
              {readTime}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/writing/editorial-row.tsx
git commit -m "design(writing): editorial row component (numbered, tags, optional hero)"
```

---

### Task 12: Home page — Hero

**Files:**

- Create: `components/home/hero.tsx`

- [ ] **Step 1: Port `HomeHero`**

From `artboard-home.jsx` lines 19–58. Two-column grid: left has "Now" pill, big H1 with "Nehil" in Bagel Fat One peach, subhead, two buttons (Solid → `/writing`, Outline → `mailto:`). Right column has `NJStamp` size=300 with label "SF · 2026" sub "ai infra" + a `DoodleArrow` flourish.

```tsx
import { NJStamp } from '@/components/brand/nj-mark';
import { DoodleArrow } from '@/components/brand/doodle-arrow';
import { SolidBtn, OutlineBtn } from '@/components/brand/buttons';
import { Icon } from '@/components/brand/icon';
import Link from 'next/link';
import { DATA } from '@/data/resume';

export function HomeHero() {
  return (
    <section className="mb-16 grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
          Now: {DATA.org} · {DATA.title}
        </div>
        <h1 className="m-0 font-heading text-6xl font-semibold leading-[1.02] tracking-tight text-foreground lg:text-[80px]">
          Hello, I&rsquo;m{' '}
          <span className="font-display text-accent leading-[0.9] tracking-tighter">
            Nehil
          </span>
          .
        </h1>
        <p className="mt-4 max-w-[560px] text-xl leading-snug text-muted-foreground lg:text-[22px]">
          {DATA.description}
        </p>
        <div className="mt-7 flex gap-3">
          <Link href="/writing">
            <SolidBtn>
              Read the writing <Icon.ArrowRight size={16} />
            </SolidBtn>
          </Link>
          <Link href={`mailto:${DATA.email}`}>
            <OutlineBtn>Say hello</OutlineBtn>
          </Link>
        </div>
      </div>
      <div className="relative grid place-items-center">
        <NJStamp size={300} label="SF · 2026" sub="ai infra" />
        <DoodleArrow
          color="hsl(var(--accent))"
          width={90}
          height={50}
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            transform: 'rotate(15deg)'
          }}
        />
      </div>
    </section>
  );
}
```

Note: keep the `DATA.description` from `data/resume.ts` unless you want to shorten it. The prototype text is more concise; you can override here with a shorter string if you want, but using DATA keeps it editable in one place.

- [ ] **Step 2: Commit**

```bash
git add components/home/hero.tsx
git commit -m "design(home): hero with NJStamp + headline + Now pill"
```

---

### Task 13: Home page — Now section + Latest posts + Contact

**Files:**

- Create: `components/home/now-section.tsx`
- Create: `components/home/latest-posts.tsx`
- Create: `components/home/contact.tsx`

- [ ] **Step 1: NowSection** — port from `artboard-home.jsx` lines 61–95. Three `NowCard`s (kicker + title + body). Use `data/resume.ts` if you want this driven by data, but hard-coding is fine for the rebrand pass — the user can edit the file later. Use the prototype's exact copy as a starting placeholder.

- [ ] **Step 2: LatestPosts** — port from `artboard-home.jsx` lines 130–142. Calls `SectionHead` + maps over the first 5 published posts from `#site/content`. Uses `EditorialRow`. The component file is a **server component** (no 'use client') because it imports content and renders `<Link>`s only.

```tsx
import { posts } from '#site/content';
import { sortPosts } from '@/lib/utils';
import { SectionHead } from '@/components/brand/section-head';
import { EditorialRow } from '@/components/writing/editorial-row';

export function HomeLatestPosts() {
  const latest = sortPosts(posts.filter((p) => p.published)).slice(0, 5);
  return (
    <section className="mb-16">
      <SectionHead
        kicker="02 · WRITING"
        title="Latest"
        linkText="View all →"
        linkHref="/writing"
      />
      <div className="mt-5 flex flex-col">
        {latest.map((p, i) => (
          <EditorialRow key={p.slug} post={p} index={i} accent={i === 0} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Contact** — port from `artboard-home.jsx` lines 227–261. Dashed peach border, watermark NJ mark in corner, kicker, big H2, subhead, two buttons (mailto:hello + outline "Book a call" → `DATA.contact.social` or omit if no URL exists).

- [ ] **Step 4: Commit**

```bash
git add components/home/
git commit -m "design(home): now-section, latest-posts, contact"
```

---

### Task 14: Recompose `app/page.tsx`

**Files:**

- Modify: `app/page.tsx`

- [ ] **Step 1: Replace contents entirely**

```tsx
import { HomeHero } from '@/components/home/hero';
import { HomeNowSection } from '@/components/home/now-section';
import { HomeLatestPosts } from '@/components/home/latest-posts';
import { HomeContact } from '@/components/home/contact';

export default function Home() {
  return (
    <main className="mx-auto max-w-content px-8 pb-20 pt-16">
      <HomeHero />
      <HomeNowSection />
      <HomeLatestPosts />
      <HomeContact />
    </main>
  );
}
```

Drop the old BlurFade/Avatar/DATA imports (the new design omits the byline avatar per user comment #1).

- [ ] **Step 2: Verify on dev**

Visit `/`. Compare side-by-side with `artboard-home.jsx` rendered intent: peach NJ stamp right, big "Hello, I'm Nehil." left, 3 Now cards, 5 editorial post rows, dashed peach contact CTA at bottom.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "design(home): wire new sections into app/page.tsx"
```

---

### Task 15: Writing list — hero + sidebar + list

**Files:**

- Create: `components/writing/writing-hero.tsx`
- Create: `components/writing/sidebar.tsx`
- Modify: `app/writing/page.tsx`

- [ ] **Step 1: WritingHero** — port from `artboard-writing.jsx` lines 49–74. Two-col flex: left has kicker pill ("The Writing Index · N posts"), giant H1 "Notes from the field." with the period in peach, subhead. Right has `<NJMark size={88} tilt={6} />`.

- [ ] **Step 2: Sidebar** — port from `artboard-writing.jsx` lines 76–161. Three cards: Filter by kind / Tags / Subscribe. For the rebrand pass, render kinds and tags as **read-only** (no client filter logic yet) — they're visual; clicking just appends a query param. Compute `kindCount` and `TAG_COUNTS` from the actual `posts` collection.

For `kind`: a post's kind is inferred from `tags` — if `tags` includes `'sketchnote'`, kind=sketchnote; `'til'` → til; `'retro'` or `'incident'` → retro; else essay. Put this helper in `lib/utils.ts`:

```ts
export function inferKind(
  tags?: string[]
): 'essay' | 'sketchnote' | 'retro' | 'til' {
  if (!tags) return 'essay';
  if (tags.includes('sketchnote')) return 'sketchnote';
  if (tags.includes('til')) return 'til';
  if (tags.includes('retro') || tags.includes('incident')) return 'retro';
  return 'essay';
}
```

Subscribe form: render the input + button but don't wire submit handler. (Real subscribe integration is out of scope for the rebrand.)

- [ ] **Step 3: Recompose `app/writing/page.tsx`**

```tsx
import { posts } from '#site/content';
import { sortPosts } from '@/lib/utils';
import { WritingHero } from '@/components/writing/writing-hero';
import { WritingSidebar } from '@/components/writing/sidebar';
import { EditorialRow } from '@/components/writing/editorial-row';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Experiments, TILs, retros, and sketchnotes on AI infra, data engineering, and the unglamorous bits of making AI reliable in production.'
};

export default function WritingPage() {
  const all = sortPosts(posts.filter((p) => p.published));
  return (
    <main className="mx-auto max-w-content px-8 pb-16 pt-12">
      <WritingHero count={all.length} />
      <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_260px]">
        <div>
          {all.map((p, i) => (
            <EditorialRow key={p.slug} post={p} index={i} accent={i === 0} />
          ))}
        </div>
        <WritingSidebar posts={all} />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify on dev**

Visit `/writing`. Expect a Fraunces-or-Geist H1 "Notes from the field.", peach period, NJ mark right; below, numbered list of all posts; right, three sticky sidebar cards.

- [ ] **Step 5: Commit**

```bash
git add app/writing/page.tsx components/writing/ lib/utils.ts
git commit -m "design(writing): editorial list with kind/tag/subscribe sidebar"
```

---

### Task 16: Single post page — breadcrumb, header, three-rail layout

**Files:**

- Create: `components/writing/post-header.tsx`
- Create: `components/writing/post-meta-rail.tsx`
- Create: `components/writing/post-toc-rail.tsx`
- Create: `components/writing/post-footer-next.tsx`
- Modify: `app/writing/[...slug]/page.tsx`
- Modify: `styles/mdx.css`

- [ ] **Step 1: PostHeader** — port from `artboard-post.jsx` lines 34–70. Kicker pill (sketchnote / essay / etc, derived from `inferKind`), date · read-time, big H1 (split last word in peach italic if you can — for v1 just render the whole title in the heading family; the peach-italic last word is a nice-to-have), subhead in body font, dashed border + tag pills.

**Per user comment: byline is removed.** Do not render avatar / name / "MTS Anyscale".

- [ ] **Step 2: PostMetaRail** — port from `artboard-post.jsx` lines 72–115. Left sticky rail with reading-time, word count (use `post.body.split(/\s+/).length`), and three share buttons (Twitter / LinkedIn / Email). Share URLs:

```ts
const shareUrl = `https://nehiljain.com/${post.slug}`;
const twitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`;
const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
const email = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`;
```

- [ ] **Step 3: PostTOCRail** — port from `artboard-post.jsx` lines 117–145. Sticky right rail listing headings.

For the rebrand pass, **render a static TOC** built from the post's headings if available, OR render a placeholder note "On this page" with a few hard-coded items. Velite's `rehype-slug` adds `id`s to headings but doesn't surface a TOC tree. Adding a real TOC requires either a custom rehype plugin to collect headings, or parsing the rendered MDX on the client.

**Simplest viable**: walk `post.body` text for `## ` and `### ` lines, slug them with `github-slugger`, render anchor links. Add a server helper:

```ts
// lib/toc.ts
import GithubSlugger from 'github-slugger';

export function extractToc(mdx: string) {
  const slugger = new GithubSlugger();
  const lines = mdx.split('\n');
  const items: { depth: number; text: string; id: string }[] = [];
  for (const line of lines) {
    const m = line.match(/^(##+)\s+(.+)$/);
    if (!m) continue;
    const depth = m[1].length;
    if (depth > 3) continue;
    const text = m[2].replace(/[#*`]/g, '').trim();
    items.push({ depth, text, id: slugger.slug(text) });
  }
  return items;
}
```

Render the TOC from this list. Highlight the first item (no active-scroll yet — that's a polish add-on).

- [ ] **Step 4: PostFooterNext** — port from `artboard-post.jsx` lines 353–386. Two cards: previous + next, derived from chronological order. In `app/writing/[...slug]/page.tsx`, compute `const sorted = sortPosts(posts.filter(p => p.published)); const idx = sorted.findIndex(p => p.slugAsParams === slug); const prev = sorted[idx + 1]; const next = sorted[idx - 1];` (sortPosts is newest-first, so older is at idx+1).

- [ ] **Step 5: Rebuild `app/writing/[...slug]/page.tsx`**

```tsx
import { posts } from '#site/content';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/components/mdx-components';
import { PostHeader } from '@/components/writing/post-header';
import { PostMetaRail } from '@/components/writing/post-meta-rail';
import { PostTOCRail } from '@/components/writing/post-toc-rail';
import { PostFooterNext } from '@/components/writing/post-footer-next';
import { SketchnotePlate } from '@/components/brand/sketchnote-plate';
import { sortPosts } from '@/lib/utils';
import { extractToc } from '@/lib/toc';
import Link from 'next/link';
import '@/styles/mdx.css';
// ... keep existing generateMetadata + generateStaticParams + getPostFromParams

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);
  if (!post || !post.published) notFound();

  const all = sortPosts(posts.filter((p) => p.published));
  const idx = all.findIndex((p) => p.slugAsParams === post.slugAsParams);
  const prev = all[idx + 1];
  const next = all[idx - 1];
  const toc = extractToc(post.body); // NOTE: post.body is the compiled JSX string;
  // use post.code (raw MDX) instead if Velite exposes it.
  // Fall back to parsing rendered HTML if neither works —
  // see "Open question" note below.

  return (
    <main className="mx-auto max-w-content px-8 pb-16 pt-8">
      <nav className="mb-5 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
        <Link
          href="/writing"
          className="text-muted-foreground no-underline hover:text-foreground"
        >
          writing
        </Link>
        <span>/</span>
        <span className="text-foreground">{post.slugAsParams}</span>
      </nav>
      <PostHeader post={post} />
      <div className="mt-8 grid gap-10 lg:grid-cols-[180px_1fr_200px]">
        <PostMetaRail post={post} />
        <article className="prose prose-zinc max-w-prose-wide dark:prose-invert">
          {post.image && (
            <SketchnotePlate src={post.image} alt={post.title} caption="" />
          )}
          <MDXContent code={post.body} />
        </article>
        <PostTOCRail items={toc} />
      </div>
      <PostFooterNext prev={prev} next={next} />
    </main>
  );
}
```

**Open question / fallback for TOC source:** Velite's `s.mdx()` returns compiled output, not the raw markdown. The current schema also has `code: s.mdx()` — same problem. To get raw markdown for the TOC extractor, add `raw: s.raw()` to the schema in Task 10 (Velite supports `s.raw()` to keep the original source). If that proves wrong, fall back to skipping the TOC and rendering a "Contents" placeholder on this pass.

**Add to Task 10 schema if you want TOC**: `raw: s.raw()` (or read Velite docs: https://velite.js.org if signatures changed). Then `extractToc(post.raw)`.

- [ ] **Step 6: Update `styles/mdx.css`**

Read current file. Bump prose max-width to `720px`, set body color to `hsl(var(--foreground))`, links to `hsl(var(--accent))`, code block backgrounds to mantle, and inline-code background to `hsl(var(--accent-soft))`.

- [ ] **Step 7: Verify**

```bash
pnpm dev
```

Visit any blog post URL (e.g., from `app/writing/page.tsx`'s rendered list). Expect breadcrumb, kicker pill, large heading, 3-column layout with sticky rails.

- [ ] **Step 8: Commit**

```bash
git add app/writing/\[...slug\]/page.tsx components/writing/post-*.tsx lib/toc.ts styles/mdx.css velite.config.ts
git commit -m "design(post): 3-rail layout with sketchnote plate + TOC + next/prev"
```

---

### Task 17: Wire SketchnotePlate + new Callout into MDX

**Files:**

- Modify: `components/mdx-components.tsx`

- [ ] **Step 1: Add `SketchnotePlate` to the MDX components map**

```tsx
import { SketchnotePlate } from '@/components/brand/sketchnote-plate';
// existing imports …

const components = {
  Image,
  Callout,
  YouTube,
  SketchnotePlate,
  Tweet: (props: any) => (
    <div className="flex justify-center my-4 tweet-wrapper">
      <Tweet {...props} />
    </div>
  )
};
```

Now authors can use `<SketchnotePlate src="/blog_images/foo.png" alt="..." caption="Fig 1. ..." />` inside MDX.

- [ ] **Step 2: Commit**

```bash
git add components/mdx-components.tsx
git commit -m "design(mdx): expose SketchnotePlate to MDX"
```

---

### Task 18: Bump `themeColor` + favicon to peach

**Files:**

- Modify: `app/layout.tsx`
- Optional: Replace `public/logo.png` with a small NJ-mark export.

- [ ] **Step 1: Update theme color**

In `app/layout.tsx` metadata `other`, change `'theme-color': '#ffffff'` → `'theme-color': '#24273a'` (Macchiato base).

Also change `'msapplication-TileColor': '#da532c'` → `'msapplication-TileColor': '#fe640b'` (peach).

- [ ] **Step 2: (Optional) Replace `/public/logo.png` with an NJ-mark render**

Either export from the design canvas, or for now leave `logo.png` alone — the nav uses the SVG `NJLockup` component, so the only consumer of `logo.png` is the old `main-nav.tsx` (deleted in Task 8) and maybe `mobile-nav.tsx` (Task 19).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "design(meta): peach + Macchiato theme/tile colors"
```

---

### Task 19: Mobile nav touch-up

**Files:**

- Modify: `components/mobile-nav.tsx`

- [ ] **Step 1: Replace the logo image with `<NJMark size={24} />` inline**

Read the current file. Swap any `<Image src="/logo.png" />` for `<NJMark size={24} />`. Update the nav list to use `Icon.Writing`, `Icon.Projects`, `Icon.CV` for parity with desktop.

- [ ] **Step 2: Verify on dev with narrow viewport (Chrome devtools → 375px)**

Tap the hamburger; menu should show the new icons.

- [ ] **Step 3: Commit**

```bash
git add components/mobile-nav.tsx
git commit -m "design(mobile-nav): swap to NJ mark + duotone icons"
```

---

### Task 20: Update `post-item.tsx` to use `EditorialRow`

**Files:**

- Modify: `components/post-item.tsx`

- [ ] **Step 1: Replace contents**

`post-item` is the old card-style row used in legacy spots (tag pages, etc). Replace its body to render `<EditorialRow />` so the design is consistent everywhere:

```tsx
import { EditorialRow } from '@/components/writing/editorial-row';

interface PostItemProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  content?: string;
  image?: string;
  index?: number;
}

export function PostItem({ index = 0, ...post }: PostItemProps) {
  return <EditorialRow post={{ ...post, body: post.content }} index={index} />;
}
```

- [ ] **Step 2: Verify on the `/tags/[tag]` page**

```bash
pnpm dev
```

Click a tag from `/writing` sidebar (or open `/tags/ray`). The list should now render as numbered editorial rows.

- [ ] **Step 3: Commit**

```bash
git add components/post-item.tsx
git commit -m "design(post-item): delegate to EditorialRow for consistency"
```

---

### Task 21: Lint, format, build

- [ ] **Step 1: Lint**

```bash
pnpm lint
```

Fix any complaints (most likely: unused imports from deleted files).

- [ ] **Step 2: Format**

```bash
pnpm format
```

- [ ] **Step 3: Production build**

```bash
pnpm build
```

Expect success. If `velite` complains about missing `image` on existing posts, you've forgotten the `.optional()` from Task 10 — fix and rebuild.

- [ ] **Step 4: Visual QA — open prod build locally**

```bash
pnpm start
```

Walk through:

- `/` — hero, now cards, latest 5 editorial rows, contact CTA
- `/writing` — hero with NJ mark, full editorial list, sidebar
- Any post — breadcrumb, kicker, three rails, prev/next footer
- Toggle theme — colors should swap Latte ↔ Macchiato

- [ ] **Step 5: Commit lint/format if anything changed**

```bash
git add -A
git commit -m "chore: lint + format after rebrand"
```

---

## Out of scope (note for future passes)

- **Writing list variants 2 (year-grouped) and 3 (magazine):** not implemented. Add later if user wants. Both are fully specified in `artboard-writing.jsx` lines 163–415.
- **Tweaks panel (mode/accent/width/heading-font switcher):** purely a design exploration tool, not shipped.
- **Active-section scroll-spy on the post TOC:** rendered static; add `useScrollSpy` later if desired.
- **`/projects` and `/cv` page redesigns:** designs don't cover these. They will inherit the new nav/footer/colors automatically but the inner content still uses old shadcn cards.
- **Real subscribe handler:** sidebar form is visual only; wire to Buttondown/ConvertKit when ready.
- **OG image regeneration:** the existing `scripts/generate-og-images.mjs` still works; restyle later to match the new look.

---

## Self-review notes (done by plan author)

- All file paths reference real files in the worktree.
- Tokens task (Task 1) replaces both `:root` and `.dark`, so dark mode keeps working with `next-themes`.
- TOC source has a documented fallback (Task 16 step 5) since Velite's `s.mdx()` returns compiled output, not raw markdown — flagged as an open question with two options.
- `inferKind` helper used in two places (sidebar, post header kicker) is defined in `lib/utils.ts` (Task 15).
- The `image` field is wired through three layers: Velite schema (Task 10) → `EditorialRow` thumbnail (Task 11) → `SketchnotePlate` post hero (Task 16).
- `NJ_MARK_INK = '#11111b'` hardcoding is preserved (user comment #4: "logo contrast needs to be improved").
- Byline (avatar, "MTS Anyscale") is dropped from PostHeader (user comment #1).
- Default heading font: Geist Sans (user comment #2: "techy, clean, minimal, nerdy" — rejected Fraunces ampersand).
- All "image in list view" surfaces (home Latest, writing Editorial) use the same `EditorialRow` component (user comment #3).
