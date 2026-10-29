# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start Next.js dev server (Velite runs in watch mode via webpack plugin)
- `pnpm build` — production build (also triggers Velite build)
- `pnpm start` — serve production build
- `pnpm lint` — `next lint --fix`
- `pnpm format` / `pnpm format:check` — Prettier

Both `pnpm-lock.yaml` and `package-lock.json` are checked in; pnpm is the working default.

## Architecture

Personal site / blog built on **Next.js 14 (App Router) + Velite + MDX + Tailwind + shadcn/ui**.

**Content pipeline (Velite).** MDX posts live in `content/writing/*.mdx` and are compiled by Velite (`velite.config.ts`) into a typed collection imported as `#site/content` (alias resolved through Velite's generated `.velite/` output). Velite is invoked from `next.config.mjs` via a custom `VeliteWebpackPlugin` that runs `build()` in `beforeCompile` — there is no separate Velite CLI step. The plugin guards with a static `started` flag because Next compiles three times (server, edge, client). MDX is processed with `rehype-slug`, `rehype-pretty-code` (github-dark theme), and `rehype-autolink-headings`. Post frontmatter schema: `title`, `description?`, `date` (isodate), `published` (default true), `tags?`. `slugAsParams` is computed by stripping the leading `writing/` segment.

**Routing.**

- `app/writing/page.tsx` — paginated post index (`POSTS_PER_PAGE = 5`), reads `posts` from `#site/content`, filters `published`, sorts via `lib/utils`.
- `app/writing/[...slug]/page.tsx` — individual post; catch-all matches `slugAsParams`.
- `app/tags/`, `app/projects/`, `app/cv/` — static pages. CV content is a TypeScript object in `data/resume.ts`.
- `app/api/og/route.tsx` — dynamic Open Graph image generation.

**MDX rendering.** `components/mdx.tsx` + `components/mdx-components.tsx` map MDX elements to React components (callouts, tweets via `react-tweet`, YouTube embeds, etc.). Custom components added there are usable inside any post.

**UI.** shadcn/ui primitives in `components/ui/` (configured via `components.json`). Higher-level components live in `components/`. Path alias `@/*` maps to repo root (`tsconfig.json`).

**Site metadata.** `config/metadata.ts` is the single source of truth (title, description, `siteUrl`, social), used by `app/layout.tsx` and post pages. The template's `config/site.ts` was removed.

**Deploy.** Cloudflare Workers static assets at https://nehiljain.dev via `.github/workflows/deploy.yml` on every push to `master`. `wrangler.jsonc` serves `out/`; `workers/www-redirect/` redirects www to the apex. Explainers in their own repos (e.g. lerobot-time-sync) deploy as separate Workers on path routes such as `nehiljain.dev/lerobot-time-sync*`. nehiljain.github.io redirects here through the GitHub Pages custom-domain setting. `public/_headers` sets a one-year cache on `/_next/static/*` and basic security headers. Pull requests get a Cloudflare Preview at `pr-<number>-nehiljain-site.nehiljain.workers.dev` from `.github/workflows/preview.yml`, deleted when the PR closes; setting `preview_urls` to `false` in `wrangler.jsonc` and deploying takes every Preview and version URL offline.

**Media.** Images under 1 MB live in `public/`. Videos and large GIFs never go in git: `scripts/upload-media.sh <post-slug> <file>` puts them in the `nehiljain-media` R2 bucket and prints a `https://media.nehiljain.dev/...` URL with a content hash, cached for a year.

**Sketchnotes.** `sketchnotes/` is a separate design system (not part of the Next app) — `DESIGN.md` defines a hand-drawn sketchnote brand (Macchiato Rose on Cabin Sketch) used for one-page technical illustrations. Each subdirectory is one sketchnote. Treat it as design assets, not runtime code.

## Conventions

- Tailwind config: `tailwind.config.ts`; global styles in `app/globals.css` and `styles/`.
- Dark mode via `next-themes` (see `components/theme-provider.tsx`, `components/providers.tsx`).
- Prettier + ESLint (`eslint-config-next` + `eslint-config-prettier`); `lint-staged` is configured (`.lintstagedrc.js`) but no Husky hook is wired in `package.json`.
- New blog post: drop an `.mdx` file under `content/writing/` with required frontmatter; Velite picks it up on next dev/build.
