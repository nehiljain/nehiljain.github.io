# Blog Post Publishing Implementation Plan (Reusable Template)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a new MDX blog post on `nehiljain.com` with optimized WebP images, verified locally, and shipped via a PR against `master`.

**Architecture:** The site is Next.js 14 (App Router) + Velite + MDX + Tailwind. MDX posts live in `content/writing/*.mdx`; Velite compiles them at build time via a custom webpack plugin in `next.config.mjs`. Images are served as static assets from `public/blog_images/` and referenced from MDX with plain Markdown image syntax. There is no build-time image pipeline — images must be pre-optimized to WebP before check-in.

**Tech Stack:** Next.js 14, Velite, MDX, pnpm, ImageMagick (`magick`), `cwebp` (libwebp), git/gh.

**Reference implementation:** Branch `blog/ralph-loop-autoresearch`, commit `ecfa811`. Files added:

- `content/writing/the-platform-is-the-harness.mdx`
- `public/blog_images/ralph-loop-gpu-poor.webp`
- `public/blog_images/ralph-loop-autotune-progress.webp`
- `docs/superpowers/specs/2026-05-12-ralph-loop-blog-design.md`

**Template parameters (substitute per post):**

- `<POST-SLUG>` — kebab-case URL slug, e.g. `the-platform-is-the-harness`
- `<POST-TITLE>` — quoted string, ≤99 chars (Velite schema limit)
- `<POST-DESCRIPTION>` — ≤999 chars, shows in feed/OG (optional but recommended)
- `<POST-DATE>` — ISO date, e.g. `2026-05-12`
- `<TAGS>` — YAML list, e.g. `['anyscale', 'ray', 'ai-agents']`
- `<IMG-PREFIX>` — image-name prefix scoped to this post, e.g. `ralph-loop`
- `<BRANCH>` — `blog/<POST-SLUG>` or similar

---

## File Structure

| File                                                  | Responsibility                                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` | Source-of-truth design for this post (frontmatter, asset list, placement, edits)   |
| `content/writing/<POST-SLUG>.mdx`                     | The post itself: Velite-schema'd frontmatter + MDX body                            |
| `public/blog_images/<IMG-PREFIX>-<descriptor>.webp`   | Pre-optimized WebP assets (one per image), referenced as `/blog_images/<filename>` |
| `docs/superpowers/plans/YYYY-MM-DD-<topic>-plan.md`   | (Optional) Per-post execution log if non-trivial                                   |

**Conventions:**

- One MDX file per post. No sub-routing inside `writing/`.
- Image filenames are post-scoped (`<IMG-PREFIX>-` prefix) to avoid collisions in the flat `public/blog_images/` directory.
- WebP only — universal browser support since 2020; no `<picture>` fallback needed.
- Longest edge 1600 px (covers 2× retina at the site's prose column width).
- Spec must exist before plan execution; spec captures _what_, plan captures _how_.

---

## Task 1: Branch off latest master

**Files:**

- No files modified yet; sets up the working branch.

- [ ] **Step 1: Verify working tree is clean and on a sensible base**

Run: `cd ~/code/nehiljain.com && git status -sb`
Expected: working tree clean (or only untracked files you intend to bring along). If dirty, stash or commit first.

- [ ] **Step 2: Fetch and check out latest master**

Run:

```bash
git fetch origin master
git checkout master
git pull --ff-only
```

Expected: "Already up to date." or fast-forward.

- [ ] **Step 3: Create the feature branch**

Run: `git checkout -b blog/<POST-SLUG>`
Expected: `Switched to a new branch 'blog/<POST-SLUG>'`

- [ ] **Step 4: Verify pnpm install is current**

Run: `pnpm install 2>&1 | tail -3`
Expected: `Done in <Ns> using pnpm vX.Y.Z`. Required because `master` may have moved since your last work.

---

## Task 2: Author the design spec

**Files:**

- Create: `docs/superpowers/specs/YYYY-MM-DD-<POST-SLUG>-design.md`

- [ ] **Step 1: Write the spec**

Spec must contain (use 2026-05-12-ralph-loop-blog-design.md as concrete reference):

```markdown
# Blog Post: "<POST-TITLE>" — Design Spec

**Date:** YYYY-MM-DD
**Status:** Approved → implementation
**Branch:** `blog/<POST-SLUG>` off `master`

## Goal

[1-2 sentences: what's the post, where does the source content live]

## Frontmatter

## \`\`\`yaml

title: '<POST-TITLE>'
description: '<POST-DESCRIPTION>'
date: <POST-DATE>
tags: <TAGS>
published: true

---

\`\`\`

- File path: `content/writing/<POST-SLUG>.mdx`
- URL: `/writing/<POST-SLUG>`

## Assets

| Source path | Source dims | Source size | Target filename          | Target dims    | Target size |
| ----------- | ----------- | ----------- | ------------------------ | -------------- | ----------- |
| <abs path>  | WxH         | NMB         | <IMG-PREFIX>-<desc>.webp | longest 1600px | <est>       |

## Image Placement

For each image: where in the post it goes (anchor by paragraph), and the alt text.

## Body Edits

Bullet list of edits from source → published form: typo fixes, todo resolutions, image inserts. No structural rewrites without explicit call-out.

## Out of Scope

- Adding next/image or build-time pipeline
- Editing other posts
- Backporting optimization to existing images
```

- [ ] **Step 2: Commit the spec**

Run:

```bash
git add docs/superpowers/specs/YYYY-MM-DD-<POST-SLUG>-design.md
git commit -m "docs(specs): design for <POST-SLUG> post"
```

---

## Task 3: Optimize and place images

**Files:**

- Create (one per image): `public/blog_images/<IMG-PREFIX>-<descriptor>.webp`

- [ ] **Step 1: Verify image tools are installed**

Run: `which magick cwebp`
Expected: both resolve under `/opt/homebrew/bin/`. If missing:

```bash
brew install imagemagick webp
```

- [ ] **Step 2: Resize + convert each source image**

For each source image, run the two-step pipeline (resize via ImageMagick to bound longest edge at 1600 px, then encode WebP at quality 82):

```bash
TMP=$(mktemp -d)
OUT=~/code/nehiljain.com/public/blog_images

# Image 1
magick "<ABS-SOURCE-PATH>" -resize '1600x1600>' "$TMP/img1.png"
cwebp -q 82 -mt "$TMP/img1.png" -o "$OUT/<IMG-PREFIX>-<descriptor1>.webp"

# Image 2 (repeat per image)
magick "<ABS-SOURCE-PATH-2>" -resize '1600x1600>' "$TMP/img2.png"
cwebp -q 82 -mt "$TMP/img2.png" -o "$OUT/<IMG-PREFIX>-<descriptor2>.webp"
```

Notes:

- The `>` in `1600x1600>` is critical — it means "only shrink, never enlarge."
- Quality 82 is the visual-vs-size sweet spot for screenshots and diagrams. For photos with gradients you can push to 85; for posterized UI screenshots 75 is fine.
- `-mt` enables multi-threaded encode.

- [ ] **Step 3: Verify output dimensions and sizes**

Run:

```bash
ls -lh ~/code/nehiljain.com/public/blog_images/<IMG-PREFIX>-*.webp
identify ~/code/nehiljain.com/public/blog_images/<IMG-PREFIX>-*.webp
```

Expected: every file ≤ 200 KB (most should be 30–100 KB), every file ≤ 1600 px on the long edge. If any file is larger, drop quality to 75 and re-encode, or check that the source isn't a photo that needs different settings.

- [ ] **Step 4: Spot-check one image visually**

Run: `open ~/code/nehiljain.com/public/blog_images/<IMG-PREFIX>-<descriptor1>.webp`
Expected: image looks correct — no posterization on gradients, no banding on charts, no clipped text. If it looks bad, re-encode at q90 and accept the size penalty.

---

## Task 4: Author the MDX post

**Files:**

- Create: `content/writing/<POST-SLUG>.mdx`

- [ ] **Step 1: Write the post file with Velite-conformant frontmatter**

The Velite schema (`velite.config.ts:13-31`) requires:

- `title` (string, max 99 chars) — REQUIRED
- `date` (ISO date `YYYY-MM-DD`) — REQUIRED
- `description` (string, max 999 chars) — optional but recommended
- `published` (bool, default true) — set explicitly to `true`
- `tags` (array of strings) — optional

Template:

```mdx
---
title: '<POST-TITLE>'
description: '<POST-DESCRIPTION>'
date: <POST-DATE>
tags: <TAGS>
published: true
---

[Opening paragraph — hook.]

[Body paragraphs.]

![<alt text describing image meaning, not appearance>](/blog_images/<IMG-PREFIX>-<descriptor1>.webp)

[More body.]

![<alt text>](/blog_images/<IMG-PREFIX>-<descriptor2>.webp)

[Closing.]
```

Image reference rules:

- Path is always `/blog_images/<file>.webp` (absolute, served from `public/`).
- Alt text describes the _meaning_ (e.g. "Composite score over experiments — the autoresearch loop converging") not the appearance ("a chart with blue dots"). Required for screen readers and OG previews.
- Do NOT use a relative path. Do NOT use Markdown imports — Velite's asset rewriter is configured for MDX import syntax only, and we are deliberately not using it.

- [ ] **Step 2: Verify frontmatter parses by running Velite**

Run: `cd ~/code/nehiljain.com && pnpm exec velite 2>&1 | tail -5`
Expected: `[VELITE] build finished in <N>ms` with no schema errors. If you see a Zod error, the frontmatter doesn't match the schema — fix the offending field.

---

## Task 5: Verify locally

**Files:**

- No files modified.

- [ ] **Step 1: Start dev server and load the post**

Run (in a separate terminal or background): `pnpm dev`
Then open: `http://localhost:3000/writing/<POST-SLUG>`
Expected: post renders with title, date, tags, body, and BOTH images visible. Verify no console errors in the browser dev tools and no missing-asset 404s in the dev server log.

- [ ] **Step 2: Stop dev server, run full build**

Stop `pnpm dev`. Then:

```bash
pnpm build 2>&1 | tail -10
```

Expected:

- `[VELITE] build finished in <N>ms`
- `✓ Generating static pages (N/N)` — N should have incremented by 1 vs. baseline
- The new route appears in the `/writing/[...slug]` list

If `tsx: command not found` or similar missing-binary error appears, run `pnpm install` and retry — `node_modules` is likely stale.

- [ ] **Step 3: Lint (optional but recommended)**

Run: `pnpm lint 2>&1 | tail -10`
Expected: no errors. Warnings are OK but worth glancing at.

---

## Task 6: Commit and open PR

**Files:**

- No new files; commits the work from Tasks 2–4.

- [ ] **Step 1: Stage everything**

Run:

```bash
git add content/writing/<POST-SLUG>.mdx \
        public/blog_images/<IMG-PREFIX>-*.webp \
        docs/superpowers/specs/YYYY-MM-DD-<POST-SLUG>-design.md
git status -sb
```

Expected: A entries for the MDX, WebPs, and spec. No accidental staging of `node_modules/`, `.velite/`, `public/og/`, or `.next/`.

- [ ] **Step 2: Commit**

Run:

```bash
git commit -m "feat(writing): add <POST-SLUG> post

[1-2 sentence summary of the post's subject and any notable assets.]"
```

Expected: single commit on the feature branch.

- [ ] **Step 3: Push branch**

Run: `git push -u origin blog/<POST-SLUG>`
Expected: branch pushed, GitHub prints a PR-create URL.

- [ ] **Step 4: Open PR via gh**

Run:

```bash
gh pr create --base master --title "Add post: <POST-TITLE>" --body "$(cat <<'EOF'
## Summary
- New blog post at `/writing/<POST-SLUG>`
- N WebP images added to `public/blog_images/`
- Design spec under `docs/superpowers/specs/`

## Test plan
- [x] `pnpm build` clean locally
- [x] Post renders in `pnpm dev`, both images load
- [ ] Reviewer eyeballs prose and image placement

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed. Merging the PR ships the post.

---

## Self-review notes (carried out 2026-05-12)

- **Spec coverage:** All sections of the design spec (frontmatter, assets table, image placement, body edits, build & verification, PR, out-of-scope) have at least one task. ✓
- **Placeholder scan:** Every `<PARAMETER>` is documented in the header. No "TBD" or "TODO" outside of literal template parameters. ✓
- **Type/path consistency:** Image path scheme (`/blog_images/<IMG-PREFIX>-<descriptor>.webp`) is consistent across Tasks 3, 4, and 6. Frontmatter field names match `velite.config.ts:13-31` exactly. ✓
- **Reference anchor:** Concrete reference implementation (commit `ecfa811`, branch `blog/ralph-loop-autoresearch`) is cited at the top so future runs can diff against a known-good example.

## When to deviate from this template

- **Post needs custom MDX components** (callout, embed not in `mdx-components.tsx`): add a Task 4.5 to extend `components/mdx-components.tsx` and update `CLAUDE.md`'s MDX section.
- **Image is a photograph, not a screenshot/diagram:** consider quality 85–90; the q82 default is tuned for the latter.
- **More than ~5 images or a > 5 MB total asset budget:** revisit whether the lean approach still applies, or move to `next/image` + Velite asset imports (out of scope here).
- **Post body needs structural rewriting** (not just typo fixes): split into a separate editorial spec before drafting, and call it out explicitly in the design spec's "Body Edits" section.
