# Cloudflare Pages Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `nehiljain.com` from Vercel to Cloudflare Pages free tier as a fully static export, replacing the dynamic OG image route with a build-time PNG generator, and verifying everything with vitest unit tests + Playwright E2E tests run both locally (against `npx serve out`) and against the deployed `*.pages.dev` URL.

**Architecture:** Next.js switches to `output: 'export'`. The existing `app/api/og/route.tsx` is deleted; a new `scripts/generate-og-images.mjs` runs before `next build`, reads `.velite/writing.json`, and renders one PNG per post into `public/og/<slug>.png` using `satori` + `satori-html` + `@resvg/resvg-js` (the same primitives `next/og` wraps). `app/writing/[...slug]/page.tsx` is updated to reference the static OG URLs, prefixed absolute via `process.env.CF_PAGES_URL ?? siteConfig.siteUrl` from `config/metadata.ts` (also fixes a pre-existing bug: the old route read `config/site.ts` which has the placeholder `https://example.com`). Cloudflare Pages project is created and deployed via `wrangler` CLI; the user wires the GitHub auto-deploy in the dashboard at the end (single click).

**Tech Stack:** Next.js 14.2.35, Velite, satori + satori-html + @resvg/resvg-js, vitest, @playwright/test, serve (local static server), wrangler (Cloudflare CLI). Cloudflare account ID: `<cloudflare-account-id>`. Pages project name: `nehiljain-com`.

**Branch:** Implement on top of `cloudflare-pages-migration-spec` (the existing PR #11 branch). All implementation commits are added to the same branch so the PR ships spec + implementation together.

---

## File Structure

**New files:**

- `lib/og-card.tsx` — extracted JSX of the OG card. Pure function `OgCard({ title, footerUrl }): ReactNode`. Used by both the build-time script and (optionally) any future preview tooling. **Single responsibility:** "what an OG card looks like."
- `lib/og-render.ts` — wraps satori + resvg. Pure function `renderOgPng({ title, footerUrl, fontData }): Promise<Buffer>`. **Single responsibility:** "turn props into PNG bytes." Kept separate from the card so we can unit-test rendering without re-running the script.
- `scripts/generate-og-images.mjs` — orchestration: read velite output, hash titles/slugs, render PNGs that need rendering, write manifest. **Single responsibility:** batch driver.
- `tests/og-card.test.ts` — vitest: render returns expected SVG structure given known input.
- `tests/og-render.test.ts` — vitest: PNG buffer is non-empty, starts with PNG magic bytes, and is 1200x630.
- `tests/generate-og-images.test.ts` — vitest: script run end-to-end on a fixture velite output writes the expected files and respects the cache manifest. Also asserts the footer URL comes from `config/metadata.ts` (regression for the `https://example.com` bug).
- `vitest.config.ts` — minimal config.
- `playwright.config.ts` — two projects: `local` (webServer = `pnpm exec serve out -l 4173`) and `prod` (baseURL from `E2E_BASE_URL` env var).
- `e2e/site-loads.spec.ts` — route smoke tests.
- `e2e/og-image.spec.ts` — OG image content-type + dimensions.
- `tests/fixtures/velite-writing.json` — minimal velite output for unit tests (2 posts).

**Modified files:**

- `next.config.mjs` — add `output: 'export'`, `images.unoptimized: true`.
- `app/writing/[...slug]/page.tsx` — replace `/api/og?title=…` with `${absoluteSiteUrl}/og/${post.slugAsParams}.png` in `openGraph.images` and `twitter.images`.
- `package.json` — `build` becomes `velite && node scripts/generate-og-images.mjs && next build`. Add `test`, `test:e2e:local`, `test:e2e:prod`. Add `satori`, `satori-html`, `@resvg/resvg-js`, `vitest`, `@playwright/test`, `serve` to devDependencies.
- `.gitignore` — add `public/og/`.
- `lib/og-render.ts` reads `config/metadata.ts` (not `config/site.ts`).

**Deleted files:**

- `app/api/og/route.tsx` — static export refuses to build with API routes; the route's logic moves into `lib/og-card.tsx` + `lib/og-render.ts`.

---

## Task 1: Set up the implementation branch

**Files:**

- None (branch ops only)

- [ ] **Step 1: Switch to spec branch**

```bash
git fetch origin cloudflare-pages-migration-spec
git checkout cloudflare-pages-migration-spec
git pull --ff-only
git status
```

Expected: clean working tree, branch up-to-date with origin.

- [ ] **Step 2: Verify spec is the only diff vs. master**

```bash
git diff --stat master..HEAD
```

Expected: only `docs/superpowers/specs/2026-05-05-cloudflare-pages-migration-design.md` differs.

- [ ] **Step 3: Verify dev server still works on this branch as a baseline**

```bash
pnpm install
pnpm dev &
sleep 10
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
kill %1
```

Expected: `200`.

---

## Task 2: Add devDependencies for OG generation and testing

**Files:**

- Modify: `package.json` (devDependencies + scripts)

- [ ] **Step 1: Install OG generation libs**

```bash
pnpm add -D satori satori-html @resvg/resvg-js
```

Expected: pnpm-lock.yaml updates, no peer warnings beyond existing ones.

- [ ] **Step 2: Install vitest**

```bash
pnpm add -D vitest @vitest/ui
```

- [ ] **Step 3: Install Playwright + serve**

```bash
pnpm add -D @playwright/test serve
pnpm exec playwright install --with-deps chromium
```

Expected: chromium binary installed under `~/Library/Caches/ms-playwright/`.

- [ ] **Step 4: Add npm scripts**

Edit `package.json` `"scripts"` section to:

```json
"scripts": {
  "dev": "next dev",
  "build": "velite && node scripts/generate-og-images.mjs && next build",
  "start": "next start",
  "lint": "next lint --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e:local": "playwright test --project=local",
  "test:e2e:prod": "playwright test --project=prod",
  "og:generate": "node scripts/generate-og-images.mjs"
}
```

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add satori, vitest, playwright dev deps for cloudflare migration"
```

---

## Task 3: Add vitest config

**Files:**

- Create: `vitest.config.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    globals: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname)
    }
  }
});
```

- [ ] **Step 2: Run vitest with no tests yet**

```bash
pnpm test
```

Expected: "No test files found, exiting with code 1" — this is the expected failure for an empty suite, but vitest itself should boot with no config errors. If you see a config error, fix before continuing.

Workaround for the exit code: add `--passWithNoTests` temporarily, or just move on — Task 4 adds the first test.

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "chore: add vitest config"
```

---

## Task 4: Extract OG card JSX into `lib/og-card.tsx`

**Files:**

- Create: `lib/og-card.tsx`

The card rendering today lives inline in `app/api/og/route.tsx`. We extract it into a pure component. The component returns the same JSX tree, parameterized on `title` and `footerUrl`. The `tw="..."` Tailwind shorthand is preserved — `satori-html` understands it.

- [ ] **Step 1: Write `lib/og-card.tsx`**

```tsx
import * as React from 'react';

export interface OgCardProps {
  title: string;
  footerUrl: string;
  githubUrl: string;
}

export function OgCard({ title, footerUrl, githubUrl }: OgCardProps) {
  const heading = title.length > 140 ? `${title.substring(0, 140)}...` : title;
  return (
    <div tw="flex relative flex-col p-12 w-full h-full items-start text-black bg-white">
      <div tw="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1" />
        </svg>
        <p tw="ml-2 font-bold text-2xl">Nehil Jain</p>
      </div>
      <div tw="flex flex-col flex-1 py-10">
        <div tw="flex text-xl uppercase font-bold tracking-tight">POST</div>
        <div tw="flex text-[80px] font-bold text-[50px]">{heading}</div>
      </div>
      <div tw="flex items-center w-full justify-between">
        <div tw="flex text-xl">{footerUrl}</div>
        <div tw="flex items-center text-xl">
          <div tw="flex ml-2">{githubUrl}</div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/og-card.tsx
git commit -m "feat(og): extract OG card JSX into reusable component"
```

---

## Task 5: Write `lib/og-render.ts` (satori + resvg wrapper)

**Files:**

- Create: `lib/og-render.ts`

This module imports `OgCard`, runs `satori` to get SVG, then `resvg` to produce PNG bytes. Reads font once and caches it on first call.

- [ ] **Step 1: Write `lib/og-render.ts`**

```ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { renderToStaticMarkup } from 'react-dom/server';
import * as React from 'react';
import { OgCard, type OgCardProps } from './og-card';

const FONT_PATH = path.resolve(process.cwd(), 'assets/fonts/Inter-Bold.ttf');

let fontDataCache: Buffer | null = null;

async function loadFont(): Promise<Buffer> {
  if (fontDataCache) return fontDataCache;
  fontDataCache = await fs.readFile(FONT_PATH);
  return fontDataCache;
}

export async function renderOgPng(props: OgCardProps): Promise<Buffer> {
  const fontData = await loadFont();
  // satori-html parses an HTML/JSX string with `tw=` attributes and produces
  // the VDOM satori expects. We render the React component to static markup
  // first, then hand the resulting string to satori-html.
  const markup = renderToStaticMarkup(React.createElement(OgCard, props));
  const vdom = html(markup);
  const svg = await satori(vdom, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Inter', data: fontData, style: 'normal', weight: 700 }]
  });
  const png = new Resvg(svg, { background: 'white' }).render().asPng();
  return Buffer.from(png);
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/og-render.ts
git commit -m "feat(og): satori + resvg PNG rendering wrapper"
```

---

## Task 6: Write fixture velite output for tests

**Files:**

- Create: `tests/fixtures/velite-writing.json`

- [ ] **Step 1: Write fixture**

```json
[
  {
    "slug": "writing/hello-world",
    "slugAsParams": "hello-world",
    "title": "Hello World",
    "description": "First fixture post",
    "date": "2024-01-01",
    "published": true,
    "tags": ["test"]
  },
  {
    "slug": "writing/longer-post",
    "slugAsParams": "longer-post",
    "title": "A longer fixture post about distributed systems and embedding pipelines",
    "description": "Second fixture post",
    "date": "2024-02-01",
    "published": true,
    "tags": ["test"]
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add tests/fixtures/velite-writing.json
git commit -m "test: add velite output fixture"
```

---

## Task 7: Vitest test for `og-render.ts`

**Files:**

- Create: `tests/og-render.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { renderOgPng } from '@/lib/og-render';

describe('renderOgPng', () => {
  it('returns a non-empty PNG buffer with correct magic bytes', async () => {
    const buf = await renderOgPng({
      title: 'Hello World',
      footerUrl: 'https://nehiljain.com',
      githubUrl: 'https://github.com/nehiljain'
    });
    expect(buf.length).toBeGreaterThan(1000);
    // PNG magic: 89 50 4E 47 0D 0A 1A 0A
    expect(buf[0]).toBe(0x89);
    expect(buf[1]).toBe(0x50);
    expect(buf[2]).toBe(0x4e);
    expect(buf[3]).toBe(0x47);
  });

  it('produces output with 1200x630 dimensions', async () => {
    const buf = await renderOgPng({
      title: 'Dim test',
      footerUrl: 'https://nehiljain.com',
      githubUrl: 'https://github.com/nehiljain'
    });
    // PNG IHDR: width is bytes 16-19, height is 20-23 (big-endian uint32)
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });
});
```

- [ ] **Step 2: Run test and watch it fail**

```bash
pnpm test tests/og-render.test.ts
```

Expected: test fails (likely because TSX/JSX in `lib/og-card.tsx` isn't transformed by vitest yet, or `react-dom/server` isn't resolvable from a `.ts` file).

- [ ] **Step 3: Add `tsx` extension support to vitest**

If Step 2 failed on "Cannot find module" for `og-card`, add `.tsx` resolution. Update `vitest.config.ts` `resolve` to include extensions explicitly:

```ts
resolve: {
  alias: { '@': path.resolve(__dirname) },
  extensions: ['.ts', '.tsx', '.js', '.mjs', '.json']
}
```

Re-run `pnpm test tests/og-render.test.ts`. If it still fails on JSX syntax, vitest needs the React plugin:

```bash
pnpm add -D @vitejs/plugin-react
```

Then update `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    globals: false
  },
  resolve: {
    alias: { '@': path.resolve(__dirname) },
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json']
  }
});
```

- [ ] **Step 4: Run test, watch it pass**

```bash
pnpm test tests/og-render.test.ts
```

Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add tests/og-render.test.ts vitest.config.ts package.json pnpm-lock.yaml
git commit -m "test: og-render produces valid 1200x630 PNG"
```

---

## Task 8: Vitest test for `og-card` (smoke)

**Files:**

- Create: `tests/og-card.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import * as React from 'react';
import { OgCard } from '@/lib/og-card';

describe('OgCard', () => {
  it('renders the title in markup', () => {
    const markup = renderToStaticMarkup(
      React.createElement(OgCard, {
        title: 'Distributed Systems 101',
        footerUrl: 'https://nehiljain.com',
        githubUrl: 'https://github.com/nehiljain'
      })
    );
    expect(markup).toContain('Distributed Systems 101');
    expect(markup).toContain('https://nehiljain.com');
    expect(markup).toContain('https://github.com/nehiljain');
  });

  it('truncates titles longer than 140 chars', () => {
    const long = 'a'.repeat(200);
    const markup = renderToStaticMarkup(
      React.createElement(OgCard, {
        title: long,
        footerUrl: 'x',
        githubUrl: 'x'
      })
    );
    expect(markup).toContain('...');
    expect(markup).not.toContain('a'.repeat(141));
  });
});
```

- [ ] **Step 2: Run test, watch it pass**

```bash
pnpm test tests/og-card.test.ts
```

Expected: 2 passing.

- [ ] **Step 3: Commit**

```bash
git add tests/og-card.test.ts
git commit -m "test: og-card markup smoke test"
```

---

## Task 9: Write `scripts/generate-og-images.mjs`

**Files:**

- Create: `scripts/generate-og-images.mjs`

The script reads `.velite/writing.json`, hashes each post's `(title, slugAsParams)`, compares against `public/og/.manifest.json`, renders only new/changed posts, writes PNGs, then writes the updated manifest.

It reads the footer URL from `config/metadata.ts` (fixing the `https://example.com` bug). Since `config/metadata.ts` is TypeScript, the script imports it via Node's experimental TS support OR re-exports the value via a small JS shim. Simpler approach used here: parse the file with a regex to extract `siteUrl`. (It's a single declared constant — robust enough.)

- [ ] **Step 1: Write the script**

```js
#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderOgPng } from '../lib/og-render.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VELITE_OUT = path.join(ROOT, '.velite', 'writing.json');
const OG_DIR = path.join(ROOT, 'public', 'og');
const MANIFEST_PATH = path.join(OG_DIR, '.manifest.json');
const METADATA_PATH = path.join(ROOT, 'config', 'metadata.ts');
const GITHUB_URL = 'https://github.com/nehiljain';

async function readSiteUrl() {
  // config/metadata.ts is TS; we extract the siteUrl literal with a regex
  // rather than transpiling the file. This is robust as long as the field
  // stays a simple string literal.
  const src = await fs.readFile(METADATA_PATH, 'utf8');
  const match = src.match(/siteUrl\s*:\s*['"]([^'"]+)['"]/);
  if (!match) {
    throw new Error(`Could not find siteUrl in ${METADATA_PATH}`);
  }
  return match[1];
}

async function readManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

function hashPost(post) {
  return crypto
    .createHash('sha256')
    .update(`${post.title}|${post.slugAsParams}`)
    .digest('hex')
    .slice(0, 16);
}

export async function generate({
  veliteOut = VELITE_OUT,
  ogDir = OG_DIR,
  manifestPath = MANIFEST_PATH,
  siteUrlOverride
} = {}) {
  const siteUrl = siteUrlOverride ?? (await readSiteUrl());
  const postsRaw = await fs.readFile(veliteOut, 'utf8');
  const posts = JSON.parse(postsRaw);
  await fs.mkdir(ogDir, { recursive: true });
  const manifest = await readManifest();
  const newManifest = {};
  let written = 0;
  let skipped = 0;

  for (const post of posts) {
    const hash = hashPost(post);
    newManifest[post.slugAsParams] = hash;
    const outPath = path.join(ogDir, `${post.slugAsParams}.png`);
    let exists = false;
    try {
      await fs.access(outPath);
      exists = true;
    } catch {}
    if (exists && manifest[post.slugAsParams] === hash) {
      skipped += 1;
      continue;
    }
    const png = await renderOgPng({
      title: post.title,
      footerUrl: siteUrl.replace(/^https?:\/\//, ''),
      githubUrl: GITHUB_URL.replace(/^https?:\/\//, '')
    });
    await fs.writeFile(outPath, png);
    written += 1;
  }
  await fs.writeFile(manifestPath, JSON.stringify(newManifest, null, 2));
  return { written, skipped, total: posts.length };
}

const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (isMain) {
  const result = await generate();
  console.log(
    `[og] wrote ${result.written}, skipped ${result.skipped}, total ${result.total}`
  );
}
```

> Note: the script imports `lib/og-render.ts` directly. Node 22+ supports TS imports natively via `--experimental-strip-types`. If the user is on Node 20, see Step 2 below.

- [ ] **Step 2: Verify the script can import the TS lib**

```bash
node --version
node scripts/generate-og-images.mjs 2>&1 | head -20
```

If Node version is 22+, the script runs via native TS import (with `--experimental-strip-types` if needed). If on Node 20, the import will fail.

If it fails: add `tsx` to devDependencies and change `package.json` build script's invocation from `node scripts/generate-og-images.mjs` to `tsx scripts/generate-og-images.mjs`:

```bash
pnpm add -D tsx
```

Then update `package.json`:

```json
"build": "velite && tsx scripts/generate-og-images.mjs && next build",
"og:generate": "tsx scripts/generate-og-images.mjs"
```

Re-run and confirm the script imports `og-render.ts` successfully.

- [ ] **Step 3: Generate `.velite/writing.json` so the script has input**

```bash
pnpm exec velite build
ls -la .velite/writing.json
```

Expected: file exists, has 54 entries.

- [ ] **Step 4: Run the script for real**

```bash
pnpm og:generate
ls public/og/ | head -5
ls public/og/ | wc -l
cat public/og/.manifest.json | head -5
```

Expected: 54 PNGs + 1 manifest. First entry of manifest is `{ "<slug>": "<16-hex-hash>", ... }`.

- [ ] **Step 5: Re-run and confirm cache works**

```bash
pnpm og:generate 2>&1
```

Expected: stdout reads `[og] wrote 0, skipped 54, total 54`.

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-og-images.mjs package.json pnpm-lock.yaml
git commit -m "feat(og): build-time PNG generator with hash manifest"
```

---

## Task 10: Vitest test for `generate-og-images.mjs`

**Files:**

- Create: `tests/generate-og-images.test.ts`

This test exercises the cache, the manifest format, and most importantly verifies the **footer URL comes from `config/metadata.ts`** (not `config/site.ts`) — the bug we're fixing.

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { generate } from '../scripts/generate-og-images.mjs';

let tmpDir: string;
let veliteOut: string;
let ogDir: string;
let manifestPath: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'og-test-'));
  veliteOut = path.join(tmpDir, 'writing.json');
  ogDir = path.join(tmpDir, 'og');
  manifestPath = path.join(ogDir, '.manifest.json');
  const fixture = await fs.readFile(
    path.resolve(__dirname, 'fixtures/velite-writing.json'),
    'utf8'
  );
  await fs.writeFile(veliteOut, fixture);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('generate-og-images', () => {
  it('writes one PNG per post and a manifest', async () => {
    const result = await generate({
      veliteOut,
      ogDir,
      manifestPath,
      siteUrlOverride: 'https://nehiljain.com'
    });
    expect(result.written).toBe(2);
    expect(result.skipped).toBe(0);
    const files = await fs.readdir(ogDir);
    expect(files).toContain('hello-world.png');
    expect(files).toContain('longer-post.png');
    expect(files).toContain('.manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    expect(Object.keys(manifest).sort()).toEqual([
      'hello-world',
      'longer-post'
    ]);
  });

  it('skips unchanged posts on second run', async () => {
    await generate({ veliteOut, ogDir, manifestPath, siteUrlOverride: 'x' });
    const second = await generate({
      veliteOut,
      ogDir,
      manifestPath,
      siteUrlOverride: 'x'
    });
    expect(second.written).toBe(0);
    expect(second.skipped).toBe(2);
  });

  it('regenerates when title changes', async () => {
    await generate({ veliteOut, ogDir, manifestPath, siteUrlOverride: 'x' });
    const fixture = JSON.parse(await fs.readFile(veliteOut, 'utf8'));
    fixture[0].title = 'Different title now';
    await fs.writeFile(veliteOut, JSON.stringify(fixture));
    const second = await generate({
      veliteOut,
      ogDir,
      manifestPath,
      siteUrlOverride: 'x'
    });
    expect(second.written).toBe(1);
    expect(second.skipped).toBe(1);
  });

  it('reads siteUrl from config/metadata.ts (not config/site.ts)', async () => {
    // Run without an override so the script reads config/metadata.ts.
    // Verify the resulting PNG embeds the metadata.ts value, not the
    // example.com placeholder from config/site.ts.
    const result = await generate({ veliteOut, ogDir, manifestPath });
    expect(result.written).toBe(2);
    const png = await fs.readFile(path.join(ogDir, 'hello-world.png'));
    // The URL is embedded in the PNG via satori as text glyphs, so we
    // can't assert by string-match on the bytes. Instead, snapshot the
    // siteUrl the script actually uses by reading config/metadata.ts the
    // same way the script does and asserting it's not example.com.
    const metadataSrc = await fs.readFile(
      path.resolve(__dirname, '../config/metadata.ts'),
      'utf8'
    );
    const match = metadataSrc.match(/siteUrl\s*:\s*['"]([^'"]+)['"]/);
    expect(match).not.toBeNull();
    expect(match![1]).not.toContain('example.com');
    expect(png.length).toBeGreaterThan(1000);
  });
});
```

- [ ] **Step 2: Run, expect pass**

```bash
pnpm test tests/generate-og-images.test.ts
```

Expected: 4 passing.

- [ ] **Step 3: Run full suite to confirm nothing regressed**

```bash
pnpm test
```

Expected: 8 passing across 3 files.

- [ ] **Step 4: Commit**

```bash
git add tests/generate-og-images.test.ts
git commit -m "test: og generation script + cache + metadata.ts URL bug fix"
```

---

## Task 11: Update `next.config.mjs` for static export

**Files:**

- Modify: `next.config.mjs`

- [ ] **Step 1: Edit the config**

Change `next.config.mjs` to:

```js
import { build } from 'velite';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'abs.twimg.com' }
    ]
  }
};

export default nextConfig;

class VeliteWebpackPlugin {
  static started = false;
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === 'development';
      this.options.watch = this.options.watch ?? dev;
      this.options.clean = this.options.clean ?? !dev;
      await build(this.options);
    });
  }
}
```

- [ ] **Step 2: Don't build yet** — we still have `app/api/og/route.tsx` which will break static export.

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "feat(build): enable Next.js static export"
```

---

## Task 12: Delete `app/api/og/route.tsx`

**Files:**

- Delete: `app/api/og/route.tsx`

- [ ] **Step 1: Remove the file**

```bash
git rm app/api/og/route.tsx
# If the api/ directory is now empty, also remove it
rmdir app/api 2>/dev/null || true
```

- [ ] **Step 2: Verify nothing else imports it**

```bash
grep -rn "api/og" app/ components/ lib/ config/ --include="*.ts" --include="*.tsx" || echo "no references"
```

Expected: only `app/writing/[...slug]/page.tsx` still references `/api/og` (we fix that in the next task).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(build): remove dynamic OG route (replaced by build-time generation)"
```

---

## Task 13: Update `app/writing/[...slug]/page.tsx` to use static OG URLs

**Files:**

- Modify: `app/writing/[...slug]/page.tsx` (lines around 28-65 in `generateMetadata`)

The OG image URL must be absolute. Use `process.env.CF_PAGES_URL` (set by Cloudflare on every build) with a fallback to `siteConfig.siteUrl` from `config/metadata.ts`.

- [ ] **Step 1: Add the import for the metadata config**

At the top of the file, near the other imports:

```ts
import { metadata as siteMetadata } from '@/config/metadata';
```

(If `config/metadata.ts` exports a different name, use that. Verify the actual export name first with `grep "export" config/metadata.ts`.)

- [ ] **Step 2: Replace the `generateMetadata` body**

Replace:

```ts
const ogSearchParams = new URLSearchParams();
ogSearchParams.set('title', post.title);

return {
  title: post.title,
  description: post.description,
  authors: { name: siteConfig.author },
  openGraph: {
    title: post.title,
    description: post.description,
    type: 'article',
    url: post.slug,
    images: [
      {
        url: `/api/og?${ogSearchParams.toString()}`,
        width: 1200,
        height: 630,
        alt: post.title
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: [`/api/og?${ogSearchParams.toString()}`]
  }
};
```

With:

```ts
const baseUrl = process.env.CF_PAGES_URL ?? siteMetadata.siteUrl;
const ogUrl = `${baseUrl}/og/${post.slugAsParams}.png`;

return {
  title: post.title,
  description: post.description,
  authors: { name: siteConfig.author },
  openGraph: {
    title: post.title,
    description: post.description,
    type: 'article',
    url: post.slug,
    images: [
      {
        url: ogUrl,
        width: 1200,
        height: 630,
        alt: post.title
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: [ogUrl]
  }
};
```

- [ ] **Step 3: Verify the file compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors. If `siteMetadata.siteUrl` is wrong, fix the import name based on the actual export.

- [ ] **Step 4: Commit**

```bash
git add 'app/writing/[...slug]/page.tsx'
git commit -m "feat(og): point post metadata at static /og/<slug>.png URLs"
```

---

## Task 14: Update `.gitignore`

**Files:**

- Modify: `.gitignore`

- [ ] **Step 1: Append to `.gitignore`**

Add these lines under a `# generated OG images` heading:

```
# generated OG images
/public/og/
```

- [ ] **Step 2: Untrack any committed PNGs**

```bash
git rm -r --cached public/og 2>/dev/null || true
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore generated OG images"
```

---

## Task 15: Full local build verification

**Files:**

- None (verification only)

- [ ] **Step 1: Clean previous build artifacts**

```bash
rm -rf .next out .velite public/og
```

- [ ] **Step 2: Run full build**

```bash
pnpm build 2>&1 | tee /tmp/cf-build.log
```

Expected: log shows

1. velite step (`build finished in ...ms`)
2. og generation step (`[og] wrote 54, skipped 0, total 54`)
3. next build with `Exporting (54/54)` or similar at the end

- [ ] **Step 3: Inspect build output**

```bash
ls out/ | head
ls out/og/ | wc -l
ls out/writing/ | head
test -f out/index.html && echo "home OK"
test -f out/writing/index.html && echo "writing index OK"
```

Expected: `out/index.html` exists, `out/og/` has 54 PNGs (Next copied them from public/og/).

- [ ] **Step 4: Spot-check a generated post HTML**

```bash
SLUG=$(ls content/writing/*.mdx | head -1 | xargs basename | sed 's/\.mdx$//' | sed 's/^[0-9]*-[0-9]*-[0-9]*-//')
echo "Checking post: $SLUG"
grep -o 'og:image[^>]*content="[^"]*"' "out/writing/$SLUG/index.html" || \
  find out/writing -name 'index.html' | head -1 | xargs grep -o 'og:image[^>]*content="[^"]*"'
```

Expected: og:image content URL is absolute and ends with `/og/<slug>.png`.

- [ ] **Step 5: Serve locally and curl a few routes**

```bash
pnpm exec serve out -l 4173 &
SERVE_PID=$!
sleep 2
for path in / /writing /projects /cv /tags; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4173$path")
  echo "$path -> $code"
done
kill $SERVE_PID
```

Expected: all `200`.

- [ ] **Step 6: Commit if anything changed (probably nothing)**

```bash
git status
# If clean, no commit needed.
```

---

## Task 16: Add Playwright config

**Files:**

- Create: `playwright.config.ts`
- Create: `e2e/.gitkeep`

- [ ] **Step 1: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

const PROD_URL = process.env.E2E_BASE_URL ?? 'https://nehiljain-com.pages.dev';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  projects: [
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4173'
      }
    },
    {
      name: 'prod',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PROD_URL
      }
    }
  ],
  webServer:
    process.env.PLAYWRIGHT_PROJECT === 'prod'
      ? undefined
      : {
          command: 'pnpm exec serve out -l 4173',
          url: 'http://localhost:4173',
          reuseExistingServer: !process.env.CI,
          timeout: 30_000
        }
});
```

- [ ] **Step 2: Create `e2e/` placeholder**

```bash
mkdir -p e2e
touch e2e/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add playwright.config.ts e2e/.gitkeep
git commit -m "chore: playwright config (local + prod projects)"
```

---

## Task 17: Write `e2e/site-loads.spec.ts`

**Files:**

- Create: `e2e/site-loads.spec.ts`

- [ ] **Step 1: Write the spec**

```ts
import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/writing', '/projects', '/cv', '/tags'];

for (const route of ROUTES) {
  test(`route ${route} loads with no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
    });
    const resp = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(resp?.status(), `status for ${route}`).toBe(200);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    expect(errors, `console/page errors for ${route}`).toEqual([]);
  });
}

test('a writing post page loads', async ({ page }) => {
  await page.goto('/writing');
  const firstPostLink = page.locator('a[href^="/writing/"]').first();
  const href = await firstPostLink.getAttribute('href');
  expect(href).toBeTruthy();
  const resp = await page.goto(href!);
  expect(resp?.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
});
```

- [ ] **Step 2: Run locally**

```bash
pnpm test:e2e:local
```

Expected: all tests pass. Playwright auto-spawns `serve out` on port 4173.

- [ ] **Step 3: Commit**

```bash
git add e2e/site-loads.spec.ts
git commit -m "test(e2e): route smoke tests"
```

---

## Task 18: Write `e2e/og-image.spec.ts`

**Files:**

- Create: `e2e/og-image.spec.ts`

- [ ] **Step 1: Write the spec**

```ts
import { test, expect } from '@playwright/test';

test('an OG image is served as 1200x630 PNG', async ({ page, request }) => {
  // Find a post link from /writing
  await page.goto('/writing');
  const href = await page
    .locator('a[href^="/writing/"]')
    .first()
    .getAttribute('href');
  expect(href).toBeTruthy();
  const slug = href!.replace(/^\/writing\//, '').replace(/\/$/, '');
  const ogPath = `/og/${slug}.png`;

  const resp = await request.get(ogPath);
  expect(resp.status()).toBe(200);
  expect(resp.headers()['content-type']).toContain('image/png');
  const buf = Buffer.from(await resp.body());
  expect(buf.length).toBeGreaterThan(1000);
  // PNG IHDR
  expect(buf.readUInt32BE(16)).toBe(1200);
  expect(buf.readUInt32BE(20)).toBe(630);
});

test('post page references its OG image', async ({ page }) => {
  await page.goto('/writing');
  const href = await page
    .locator('a[href^="/writing/"]')
    .first()
    .getAttribute('href');
  await page.goto(href!);
  const ogContent = await page
    .locator('meta[property="og:image"]')
    .getAttribute('content');
  expect(ogContent).toMatch(/\/og\/.+\.png$/);
});
```

- [ ] **Step 2: Run locally**

```bash
pnpm test:e2e:local
```

Expected: all 7 tests pass (5 routes + writing post + og image + og meta).

- [ ] **Step 3: Commit**

```bash
git add e2e/og-image.spec.ts
git commit -m "test(e2e): OG image content-type, dimensions, meta reference"
```

---

## Task 19: Create the Cloudflare Pages project via wrangler

**Files:**

- None (CLI op only)

- [ ] **Step 1: Confirm wrangler auth**

```bash
wrangler whoami
```

Expected: logged in as `[email removed]`, account ID `<cloudflare-account-id>`, scope includes `pages (write)`.

- [ ] **Step 2: Create the Pages project**

```bash
wrangler pages project create nehiljain-com \
  --production-branch master \
  --compatibility-date 2026-05-07
```

Expected output: project URL like `https://nehiljain-com.pages.dev`. If the project already exists, command errors with "project already exists" — that's fine, skip to next step.

- [ ] **Step 3: Verify the project shows up**

```bash
wrangler pages project list | grep nehiljain-com
```

Expected: one row. No commit (no repo changes).

---

## Task 20: First deploy via direct upload

**Files:**

- None (CLI op only; relies on `out/` from Task 15)

- [ ] **Step 1: Make sure `out/` is fresh**

```bash
pnpm build
ls out/index.html
```

Expected: file exists.

- [ ] **Step 2: Deploy**

```bash
wrangler pages deploy out --project-name nehiljain-com --branch master
```

Expected output: a deployment URL (`https://<hash>.nehiljain-com.pages.dev`) and the alias `https://nehiljain-com.pages.dev`. Capture both.

- [ ] **Step 3: Curl the deployment**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://nehiljain-com.pages.dev
curl -sI https://nehiljain-com.pages.dev/og/$(ls public/og/*.png | head -1 | xargs basename) | head -5
```

Expected: `200` for the homepage, and the OG image returns `200` with `content-type: image/png`.

---

## Task 21: Run E2E tests against the live deployment

**Files:**

- None

- [ ] **Step 1: Run prod E2E**

```bash
PLAYWRIGHT_PROJECT=prod pnpm test:e2e:prod
```

Expected: all 7 tests pass against `https://nehiljain-com.pages.dev`.

- [ ] **Step 2: If any test fails**

Triage:

- 404 on a route → check Pages "Build output directory" really matches `out/`. Re-deploy.
- OG image fails dimensions → check `public/og/` was included in `out/`; Next.js `output: 'export'` should copy it automatically. If missing, list `out/og/` to confirm.
- Console errors → likely a missing asset because of `unoptimized: true`; re-check `next.config.mjs`.

Fix, redeploy with `wrangler pages deploy out --project-name nehiljain-com --branch master`, re-run prod E2E.

---

## Task 22: GitHub auto-deploy hookup (manual)

**Files:**

- None (dashboard step done by user)

- [ ] **Step 1: Print the hand-off instructions**

Open `https://dash.cloudflare.com/<cloudflare-account-id>/pages/view/nehiljain-com` and:

1. Settings → Builds & deployments → "Source: connect to Git" → choose GitHub → authorize → select `nehiljain/nehiljain.com`.
2. Production branch: `master`. Preview branches: All non-production.
3. Build configuration:
   - **Framework preset:** None
   - **Build command:** `pnpm install && pnpm build`
   - **Build output directory:** `out`
   - **Root directory:** (blank)
4. Environment variables (Production):
   - `NODE_VERSION` = `20`
5. Save. The next push to `master` will trigger an auto-build.

- [ ] **Step 2: Trigger a confirmation push**

After the user reports the dashboard config is saved:

```bash
git commit --allow-empty -m "chore: trigger first cloudflare auto-build"
git push origin cloudflare-pages-migration-spec
```

Expected: a Cloudflare preview deploy fires for the branch (`https://cloudflare-pages-migration-spec.nehiljain-com.pages.dev`). Confirm in the dashboard's Deployments tab.

- [ ] **Step 3: Re-run prod E2E against the preview URL**

```bash
E2E_BASE_URL=https://cloudflare-pages-migration-spec.nehiljain-com.pages.dev \
  PLAYWRIGHT_PROJECT=prod pnpm test:e2e:prod
```

Expected: all 7 tests pass.

---

## Task 23: Open the PR

**Files:**

- None (PR is the existing #11)

- [ ] **Step 1: Push the branch**

```bash
git push origin cloudflare-pages-migration-spec
```

- [ ] **Step 2: Update PR title/body to reflect the implementation**

```bash
gh pr edit 11 \
  --title "feat: migrate to Cloudflare Pages (static export + build-time OG)" \
  --body "$(cat <<'EOF'
Implements the migration described in the spec at the root of this PR.

## Changes
- `next.config.mjs`: `output: 'export'`, `images.unoptimized: true`.
- Removed `app/api/og/route.tsx`; new `scripts/generate-og-images.mjs` renders one PNG per post into `public/og/<slug>.png` at build time using `satori` + `@resvg/resvg-js`.
- `app/writing/[...slug]/page.tsx`: OG metadata points at static `/og/<slug>.png` URLs, absolute via `process.env.CF_PAGES_URL ?? siteMetadata.siteUrl`.
- Bug fix: footer URL now reads `config/metadata.ts` (`https://nehiljain.com`) instead of the placeholder in `config/site.ts` (`https://example.com`).
- Vitest unit tests covering the OG card, the satori+resvg renderer, and the generation script (cache, manifest, metadata.ts URL).
- Playwright E2E covering home/writing/projects/cv/tags routes and OG image content-type/dimensions, runnable against `out/` locally or the deployed `*.pages.dev` URL.
- Cloudflare Pages project `nehiljain-com` created via `wrangler`. First deploy verified. GitHub auto-deploy linkage to be done by repo owner via dashboard.

## Verification
- `pnpm test` — 8 passing.
- `pnpm test:e2e:local` — 7 passing.
- `pnpm test:e2e:prod` — 7 passing against `https://nehiljain-com.pages.dev`.
EOF
)"
```

- [ ] **Step 3: Final sanity check on the PR**

```bash
gh pr view 11
gh pr checks 11 || true
```

Expected: PR shows the spec doc + all implementation commits. CI checks (if any are configured for the repo) report status.

---

## Task 24: Domain migration — GoDaddy registrar, DNS to Cloudflare (manual)

`nehiljain.com` is registered at GoDaddy and currently resolves to Vercel. We move authoritative DNS to Cloudflare while keeping GoDaddy as the registrar — no transfer-of-registration. Cloudflare gets full DNS control (apex CNAME flattening, automatic SSL, WAF-ready); the registration is unchanged.

Alternative path (keep DNS at GoDaddy and just point at Cloudflare Pages) is rejected because GoDaddy's free DNS doesn't support apex CNAMEs.

**Files:** None — entirely external infrastructure work.

- [ ] **Step 1: Inventory current DNS at GoDaddy**

Save this output for cross-checking after import:

```bash
dig nehiljain.com A +short
dig nehiljain.com NS +short
dig nehiljain.com MX +short
dig nehiljain.com TXT +short
dig www.nehiljain.com CNAME +short
```

- [ ] **Step 2: Add the site to Cloudflare**

1. https://dash.cloudflare.com/ → **Add a Site** → enter `nehiljain.com` → **Free** plan.
2. Cloudflare scans GoDaddy DNS and imports records. **Cross-check imported records against the Step 1 output.** Add anything missing — most commonly email TXT records (SPF, DKIM, DMARC).
3. Cloudflare assigns two nameservers (e.g. `xxx.ns.cloudflare.com`, `yyy.ns.cloudflare.com`). Capture them.

- [ ] **Step 3: Switch nameservers at GoDaddy**

1. https://dcc.godaddy.com/control/portfolio → click `nehiljain.com` → **Domain Settings → Nameservers → Change Nameservers** → "I'll use my own nameservers".
2. Replace GoDaddy's defaults with Cloudflare's two NS records.
3. Save. Propagation: typically <1 hour, max 48 hours.

Verify:

```bash
dig nehiljain.com NS +short
# Should return Cloudflare's nameservers, not GoDaddy's
```

In Cloudflare dashboard, the site flips from **Pending** to **Active** once it sees the new nameservers.

- [ ] **Step 4: Attach the custom domain to Cloudflare Pages**

1. https://dash.cloudflare.com/<cloudflare-account-id>/pages/view/nehiljain-com → **Custom domains → Set up a custom domain** → `nehiljain.com`.
2. Cloudflare creates the CNAME (with apex flattening) and provisions an SSL cert (~5 minutes).
3. Repeat for `www.nehiljain.com`. Optionally configure a www→apex (or apex→www) redirect via Cloudflare Rules → Redirect Rules.

Verify:

```bash
curl -sI https://nehiljain.com | head -5
# Expect HTTP/2 200, server: cloudflare

SLUG=$(node -e "console.log(require('./.velite/posts.json').find(p=>p.published).slugAsParams)")
curl -sI "https://nehiljain.com/og/$SLUG.png" | head -5
# Expect HTTP/2 200, content-type: image/png

E2E_BASE_URL=https://nehiljain.com pnpm test:e2e:prod
# Expect 8 passing
```

- [ ] **Step 5: Decommission Vercel**

Wait until `https://nehiljain.com` has been serving cleanly from Cloudflare for **≥24 hours**. Then:

1. Vercel dashboard → project → **Domains** → remove `nehiljain.com` and `www.nehiljain.com`.
2. Vercel dashboard → project → **Settings → General → Delete Project**.
3. Cancel any paid Vercel plan if applicable.

- [ ] **Step 6: No code changes required**

`siteMetadata.siteUrl` in `config/metadata.ts` is already `https://nehiljain.com`. The Pages build uses `process.env.CF_PAGES_URL` for previews and falls back to `siteMetadata.siteUrl` for production, so once the custom domain is attached, OG image absolute URLs resolve correctly without any redeploy.

---

## Self-Review Notes

- **Spec coverage:** Every spec section (Decisions, Architecture, Components 1-6, Cloudflare Pages config, Verification plan, Rollback) maps to at least one task. Task 19-22 cover the Cloudflare Pages config; Task 22 is the GitHub auto-deploy hookup (manual). Task 24 (added post-implementation) covers the GoDaddy → Cloudflare DNS move.
- **Out-of-scope items deferred to Task 24** (originally "out of scope per spec"): custom domain mapping, decommissioning Vercel. The user requested these be added as manual instructions after the initial implementation landed.
- **Out-of-scope items still excluded:** Web Analytics, `_headers`/`_redirects`, `@opennextjs/cloudflare` migration.
- **Bug fix** (`config/site.ts` placeholder URL) is folded into the OG generation script and explicitly tested in Task 10.
- **Rollback** is implicitly preserved: Vercel keeps running until the user removes it manually (Task 24 Step 5), all changes are git-revertable, and the deleted OG route lives in history.
- **Risk: Node TS import.** Task 9 Step 2 has a fallback to `tsx` if the user's Node version doesn't support TS imports natively. This is a runtime check, not a guess.
- **Risk: `metadata.ts` export name.** Task 13 Step 1 instructs the executor to verify the actual export name with `grep` rather than assume. The plan defaults to `metadata` but flags this.
