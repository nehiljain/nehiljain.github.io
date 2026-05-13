# Blog Post: "The Platform Is the Harness" — Design Spec

**Date:** 2026-05-12
**Status:** Approved → implementation
**Branch (planned):** `blog/ralph-loop-autoresearch` off `master`

## Goal

Publish a new long-form post on `nehiljain.com` covering the autoresearch / Ralph-loop work on a customer's Ray Data batch-embedding pipeline. Source material is the "My Version" section of `obsidian-vault/20-Areas/Content/Pipeline/1-Ideas/ralph-loop-autoresearch-optimization-agents.md`. Ship via PR against `master`; merging the PR pushes the post live.

## Frontmatter

```yaml
---
title: 'The platform is the harness: running an autoresearch loop on Anyscale'
description: '83 experiments, 3 days, one engineer. The Ralph loop ran itself once Anyscale already had the pieces.'
date: 2026-05-12
tags: ['anyscale', 'ray', 'ai-agents', 'optimization']
published: true
---
```

- File path: `content/writing/the-platform-is-the-harness.mdx`
- URL slug (via Velite `slugAsParams`): `/writing/the-platform-is-the-harness`

## Assets

Two source images, both PNG, both oversized for web delivery.

| Source                                                                                  | Dims      | Size   | Target filename                     | Target dims          | Format   | Target size |
| --------------------------------------------------------------------------------------- | --------- | ------ | ----------------------------------- | -------------------- | -------- | ----------- |
| `~/Downloads/gpu_poor_blog_image.png`                                                   | 2700×1472 | 2.9 MB | `ralph-loop-gpu-poor.webp`          | longest edge 1600 px | WebP q82 | ~80 KB      |
| `obsidian-vault/00-Inbox/notion-optimization-kb/docs/experiments/autotune_progress.png` | 5298×2598 | 516 KB | `ralph-loop-autotune-progress.webp` | longest edge 1600 px | WebP q82 | ~150 KB     |

**Optimization step:** one-shot via `sharp-cli` (`npx sharp-cli`) or `cwebp`. WebP-only — universal browser support since ~2020, no `<picture>` fallback needed in MDX.

**Destination:** `public/blog_images/` (matches existing convention; served as `/blog_images/<name>.webp`).

**Naming convention going forward:** `<post-slug-or-topic>-<descriptor>.webp` (kebab-case, no spaces, descriptive, post-scoped to avoid future collisions in the shared `blog_images/` directory).

## Image Placement in Post

- `ralph-loop-gpu-poor.webp` — replaces the `>>> insert gpu_poor_blog_image png from downloads <<<` placeholder, right after the "50 L40S … utilization sat at 1.2% … 14.9 minutes" paragraph. Alt text: _"Fewer GPUs, faster pipeline, half the cost."_
- `ralph-loop-autotune-progress.webp` — new placement near the "By experiment 75, the gains were flattening" paragraph, as a visual of the search converging. Alt text: _"Composite score over experiments — the autoresearch loop converging."_

## Body Edits (source → post)

Take the "My Version" section verbatim, then:

1. Resolve `todo:` notes by either deleting the parenthetical or replacing with a clean phrasing (no new claims).
2. Replace the `>>> insert ... <<<` line with the Markdown image ref above.
3. Insert second image near experiment-75 paragraph.
4. Light copy-edit: typo fixes only (`stoping → stopping`, `5 stage → 5 stages`, etc.). Preserve author voice and structure.
5. Keep Karpathy tweet URL as-is.

No structural rewriting. No new sections.

## Build & Verification

1. `pnpm dev` — render locally, confirm both images load and frontmatter parses.
2. `pnpm build` — Velite must compile cleanly. Validates frontmatter schema (`title`, `date`, etc.).
3. (Optional) `pnpm lint` for formatting.

## PR

Single commit on `blog/ralph-loop-autoresearch`:

> `feat(writing): add the platform is the harness post`

Open PR against `master`. Merge ships the post.

## Out of Scope

- Adding `next/image` or a build-time image pipeline. Existing convention is raw files in `public/blog_images/`; this PR matches that, with the images pre-optimized.
- Refactoring `velite.config.ts` to import images as managed assets.
- Editing other posts.
- Backporting WebP optimization to existing posts.
