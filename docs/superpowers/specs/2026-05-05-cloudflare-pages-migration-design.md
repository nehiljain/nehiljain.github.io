# Cloudflare Pages Migration — Design

**Date:** 2026-05-05
**Status:** Approved, ready for implementation plan
**Goal:** Move `nehiljain.com` off Vercel onto Cloudflare Pages free tier with no paid Cloudflare products and no custom domain in scope.

## Context

The site is a Next.js 14.2.4 App Router project. Content is MDX in `content/`, compiled at build time by velite. There is no database, no auth, no per-user state, no SSR-dependent features. The only server-side code is one edge route at `app/api/og/route.tsx` that generates per-post Open Graph images on demand.

A scan confirmed there is no `force-dynamic`, no `revalidate` exports, no `next/headers`/`cookies()` usage, and no middleware. The site is effectively static today; Vercel was running an unused server runtime.

## Decisions

- **Hosting target:** Cloudflare Pages free tier. No Workers adapter, no `wrangler.toml`.
- **Output mode:** Next.js static export (`output: 'export'`). Produces `out/` directory of plain HTML/JS/CSS/images.
- **Dynamic OG route:** Removed. Replaced with a build-time script that pre-generates one PNG per post into `public/og/<slug>.png`.
- **Image optimization:** `images.unoptimized: true`. No Cloudflare Images, no Cloudflare Image Resizing. Acceptable because the site has few images per post and we are optimizing for free-tier simplicity.
- **Custom domain:** Out of scope for this project. Initial deployment uses the free `*.pages.dev` subdomain. Domain mapping handled later as a separate follow-up.
- **Vercel:** Stays running until Cloudflare is verified. Removed manually later by the user.

## Architecture

End state is a fully static site served from Cloudflare's CDN:

- `next build` produces `out/`.
- A pre-step generates per-post OG PNGs into `public/og/`, which Next copies into `out/og/` during export.
- Cloudflare Pages is connected to the GitHub repo. Pushes to `master` trigger a build on Cloudflare's builder; preview branches get `<branch>.<project>.pages.dev` URLs automatically.
- No request-time server code anywhere in the stack.

## Components

### 1. Next config (`next.config.mjs`)

Add two fields to the existing config:

```js
output: 'export',
images: { unoptimized: true, remotePatterns: [...existing] }
```

The existing velite webpack plugin stays as-is.

### 2. Removed: `app/api/og/route.tsx`

Static export refuses to build with API routes present. The file is deleted; its rendering logic is reused inside the build-time script.

### 3. New: `scripts/generate-og-images.mjs`

Standalone Node script. Runs before `next build`. Responsibilities:

- Read `.velite/writing.json` (the compiled post metadata velite emits).
- For each post, render the same OG card JSX that `app/api/og/route.tsx` used today, via `satori` (SVG renderer) and `@resvg/resvg-js` (PNG rasterizer). These are the same libraries `next/og` wraps internally.
- Write each PNG to `public/og/<slug>.png`.
- Skip files that already exist for posts whose title/slug hash hasn't changed, to keep rebuilds fast.

Inputs: `.velite/writing.json`, `assets/fonts/Inter-Bold.ttf`.
Outputs: `public/og/<slug>.png` (one per post).
Dependencies: `satori`, `@resvg/resvg-js` (added as devDependencies).

### 4. Updated: `app/writing/[...slug]/page.tsx`

Lines 48 and 59 currently reference `/api/og?...`. Replace with `/og/${post.slugAsParams}.png` (or whatever the slug field is — confirm during implementation). For `openGraph.images` the URL must be absolute, so prefix with `siteConfig.url`.

### 5. Updated: `package.json`

Build script changes from `next build` to:

```
"build": "velite && node scripts/generate-og-images.mjs && next build"
```

Velite is invoked explicitly first so the OG script can read its output. The webpack plugin inside `next build` will still run but no-op because `.velite/` is fresh.

### 6. Updated: `.gitignore`

Add `public/og/` so generated PNGs aren't committed. Cloudflare regenerates on every build.

## Cloudflare Pages configuration

Set in the Cloudflare dashboard, no files in the repo:

- **Framework preset:** Next.js (Static HTML Export). Fall back to "None" with manual values if the preset is unavailable.
- **Build command:** `pnpm install && pnpm build`
- **Build output directory:** `out`
- **Root directory:** (blank)
- **Environment variables:** `NODE_VERSION=20`
- **Branch behavior:** default — `master` → production, all other branches → preview deploys.

Free tier covers: unlimited bandwidth, unlimited requests, 500 builds/month, 100 custom domains, unlimited preview deploys.

## Verification plan

Local, before pushing:

1. `pnpm build` produces `out/` and `public/og/<slug>.png` for every post.
2. `npx serve out` and click through home, a writing post, projects, CV, tags. No 404s in network tab.
3. View-source on a post page and confirm the OG image URL points to `/og/<slug>.png`.

On Cloudflare, after first deploy:

1. Build log shows velite step, OG generation step, and `next build` completing with `Exporting (X/X)`.
2. Spot-check the same routes on the `*.pages.dev` URL.
3. Validate one OG card via a card validator or by directly visiting the OG image URL.

## Rollback

- Vercel stays live the whole time. No DNS change happens in this project, so nothing user-visible moves until the user decides.
- Cloudflare Pages dashboard has one-click rollback to any previous successful deployment.
- All code changes are revertable via git. The deleted OG route is in history.

## Out of scope

- Custom domain mapping.
- Cloudflare Web Analytics setup.
- Custom `_headers` / `_redirects`.
- Removing Vercel project (user does this manually later).
- Migrating to `@opennextjs/cloudflare` or `@cloudflare/next-on-pages` (only relevant if the site ever needs SSR/ISR again).
