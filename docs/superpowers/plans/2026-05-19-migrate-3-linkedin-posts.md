# Migrate 3 LinkedIn Posts to Blog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate three LinkedIn posts authored by Nehil — *Arithmetic Intensity*, *Streaming Execution (The Stage Tax)*, and *Triton in Ray Serve (Fractional GPU Sharing)* — into Velite-powered MDX posts on the personal blog with proper metadata, downloaded hero images, and a longer-form rewrite that reads natively as a blog post.

**Architecture:** Each post becomes one `.mdx` file in `content/writing/` with required frontmatter (`title`, `description`, `date`, `tags`, `published`, `image`). The LinkedIn hero image is downloaded into `public/blog_images/` and referenced from frontmatter `image:`. The LinkedIn body — short, line-broken for mobile — is expanded into a tighter, scannable blog narrative (1.5–3× source length) with H2 sections, a takeaway, and (where applicable) source links. Open-graph PNGs are generated automatically by `app/api/og/route.tsx`; no manual OG asset is required.

**Tech Stack:** Next.js 14 (App Router), Velite (`velite.config.ts`), MDX, Tailwind, shadcn/ui. Velite picks up new `.mdx` files automatically on `pnpm dev` / `pnpm build`.

---

## Source Material Inventory

All three sources live in the user's Obsidian vault on disk; no remote scraping needed.

| # | Slug (proposed) | LinkedIn clipping | Companion draft / source notes | LinkedIn image URL |
|---|---|---|---|---|
| 1 | `arithmetic-intensity-decode-vs-prefill` | `/Users/nehil/code/obsidian-vault/Clippings/Arithmetic Intensity Post  LinkedIn.md` | `/Users/nehil/code/obsidian-vault/Clippings/KV cache and prefill compute bottleneck.md` (rich technical Q&A — use to expand) | `https://media.licdn.com/dms/image/v2/D5622AQHA1TV-CNZqWQ/feedshare-shrink_1280/B56Z3k3zUsGUAQ-/0/1777661327129?e=1780531200&v=beta&t=TZlP4YuPKBOydF6L3QlSiJksc0nG27PiIFihWivWvi8` |
| 2 | `the-stage-tax-streaming-batch-inference` | `/Users/nehil/code/obsidian-vault/Clippings/Streaming Execution.md` | `/Users/nehil/code/obsidian-vault/20-Areas/Content/Pipeline/2-Drafts/the-stage-tax-gpu-pipeline-costs.md` (the long-form draft this LI post was cut from — use as primary content backbone) | `https://media.licdn.com/dms/image/v2/D5610AQF59jWitpddhA/image-shrink_1280/B56Z0gK6aLJ8Ag-/0/1774361225338?e=1779811200&v=beta&t=ADF3_GXeP82oBrf7ocL3MMPCvV_fjI09f1_ll9Sohp8` |
| 3 | `one-gpu-six-triton-servers` | `/Users/nehil/code/obsidian-vault/Clippings/Triton in Ray Serve Post  LinkedIn.md` | `/Users/nehil/code/obsidian-vault/20-Areas/Content/Pipeline/2-Drafts/triton-vs-ray-serve-decision-framework.md` (related decision framework — pull background on Triton + Ray Serve) | `https://media.licdn.com/dms/image/v2/D5610AQHGZ9S63j3MBg/image-shrink_1280/B56ZyS.pR4IAAc-/0/1771992421975?e=1779811200&v=beta&t=YFU_KCcHbDB1uRPA2FC8qBclDXFlx4tNIKqCyxt5tm0` |

**Image URL liveness (verified 2026-05-19):** all three `media.licdn.com` URLs returned HTTP 200. They are signed with `e=` expiry; download them in Task 0 before they expire.

**Date strategy:** Use today's date (`2026-05-19`) for all three posts. This is the blog publish date, not the original LinkedIn post date. (Original LI dates are recoverable from the URN snowflake IDs but are not required; today's date is consistent with how the user wrote the resume update.)

**Authorship metadata:** The blog's frontmatter schema does NOT have an `author` field (see `velite.config.ts:11-28`). Author is implicit (the whole site is Nehil's). Do not add `author` — it will fail Velite schema validation.

---

## File Structure

**Files created (5 new + 3 image downloads):**

- `content/writing/arithmetic-intensity-decode-vs-prefill.mdx` — post #1
- `content/writing/the-stage-tax-streaming-batch-inference.mdx` — post #2
- `content/writing/one-gpu-six-triton-servers.mdx` — post #3
- `public/blog_images/arithmetic-intensity-hero.png` — hero image #1 (downloaded from licdn)
- `public/blog_images/stage-tax-hero.png` — hero image #2
- `public/blog_images/triton-fractional-gpu-hero.png` — hero image #3
- `docs/superpowers/plans/2026-05-19-migrate-3-linkedin-posts.md` — this plan (already on disk after writing)

**Files NOT touched:**

- `velite.config.ts` — schema already supports everything we need.
- `app/writing/page.tsx` / `app/writing/[...slug]/page.tsx` — collection-driven, auto-discovers new posts.
- `app/api/og/route.tsx` — OG images auto-generated per slug.
- `config/metadata.ts`, `config/site.ts` — no site-wide change needed.

**Why one file per post (not a shared helper):** these are pure content additions. Three sibling MDX files match every other post in `content/writing/`. No abstraction warranted.

---

## Editorial Rewrite Brief (applies to all three posts)

LinkedIn copy is optimized for the mobile feed: ultra-short paragraphs, hook in first 2 lines, no headings. On a blog page that reads as choppy and underweight. The rewrite must:

1. **Add an H1-style title via frontmatter only** (the post template renders the title). Do not add a top-level `#` in the MDX body — existing posts (e.g. `47-experiments-in-3-days.mdx`) don't.
2. **Open with the hook**, but as a real opening paragraph (2–4 sentences), not 3 one-line fragments.
3. **Break the body into 2–4 H2 sections** (`##`) with descriptive headings. Example for post #2: `## The numbers`, `## Why it happens`, `## The fix: stream, don't stage`, `## How to spot it in your own pipeline`.
4. **Keep every concrete number** from the LinkedIn post (35 min, 14%, 21 min, 1.2% util, 50→20 L40S, ~300 LOC, 6 Triton servers on one L4, etc.). Numbers are the proof; never round them away.
5. **Add depth from the companion draft / source notes** listed in the inventory. For post #1, fold in 2–3 paragraphs from the KV-cache Claude conversation explaining *why* prefill is compute-bound (arithmetic intensity > ops:byte ratio). For post #2, the `2-Drafts/the-stage-tax-gpu-pipeline-costs.md` is essentially the longer version — use it as the spine, don't re-derive. For post #3, pull background on what Triton Inference Server is and how Ray Serve fronts it from `triton-vs-ray-serve-decision-framework.md`.
6. **Target length:** ~400–700 words per post (LinkedIn originals are 60–280 words). Expand without padding.
7. **One inline image** per post using markdown `![alt](/blog_images/...)` placed after the opening section (mirrors `47-experiments-in-3-days.mdx:50` pattern). The same image is also referenced in frontmatter `image:` for OG/listing thumbnails.
8. **Voice:** first-person, Nehil's existing voice (see `47-experiments-in-3-days.mdx` for tone benchmark — direct, specific, no hype, concrete examples).
9. **No LinkedIn-isms.** Remove "TIL", "Promote this post", "1,145 impressions", emoji-less bulleting (`-`), and any "Boost" / "View image" cruft from the source.
10. **End with a concrete takeaway** — one short paragraph the reader can act on. Avoid generic CTAs.
11. **Tags:** pick 2–4 from the existing tag vocabulary used by recent posts (`anyscale`, `ray`, `ai-agents`, `optimization`, `data-engineering`, `mlops`, `gpu`, `inference`). Reuse where possible to keep `/tags` page coherent.

---

## Task 0: Setup — verify environment and download hero images

**Files:**
- Create: `public/blog_images/arithmetic-intensity-hero.png`
- Create: `public/blog_images/stage-tax-hero.png`
- Create: `public/blog_images/triton-fractional-gpu-hero.png`

- [ ] **Step 1: Confirm working directory and clean tree**

Run:
```bash
cd /Users/nehil/code/nehiljain.com/.claude/worktrees/awesome-bell-f51f89
git status
```
Expected: clean working tree on branch `claude/awesome-bell-f51f89`.

- [ ] **Step 2: Download arithmetic-intensity hero image**

Run:
```bash
curl -fL -o public/blog_images/arithmetic-intensity-hero.png \
  "https://media.licdn.com/dms/image/v2/D5622AQHA1TV-CNZqWQ/feedshare-shrink_1280/B56Z3k3zUsGUAQ-/0/1777661327129?e=1780531200&v=beta&t=TZlP4YuPKBOydF6L3QlSiJksc0nG27PiIFihWivWvi8"
file public/blog_images/arithmetic-intensity-hero.png
```
Expected: file written, `file` reports `PNG image data` (or JPEG — if JPEG, rename `.png` → `.jpg` and update references accordingly).

- [ ] **Step 3: Download stage-tax hero image**

Run:
```bash
curl -fL -o public/blog_images/stage-tax-hero.png \
  "https://media.licdn.com/dms/image/v2/D5610AQF59jWitpddhA/image-shrink_1280/B56Z0gK6aLJ8Ag-/0/1774361225338?e=1779811200&v=beta&t=ADF3_GXeP82oBrf7ocL3MMPCvV_fjI09f1_ll9Sohp8"
file public/blog_images/stage-tax-hero.png
```
Expected: file written, valid image. If `file` reports JPEG, rename to `.jpg` and propagate.

- [ ] **Step 4: Download triton hero image**

Run:
```bash
curl -fL -o public/blog_images/triton-fractional-gpu-hero.png \
  "https://media.licdn.com/dms/image/v2/D5610AQHGZ9S63j3MBg/image-shrink_1280/B56ZyS.pR4IAAc-/0/1771992421975?e=1779811200&v=beta&t=YFU_KCcHbDB1uRPA2FC8qBclDXFlx4tNIKqCyxt5tm0"
file public/blog_images/triton-fractional-gpu-hero.png
```
Expected: file written, valid image. Same rename caveat as above.

- [ ] **Step 5: Commit downloaded assets**

```bash
git add public/blog_images/arithmetic-intensity-hero.* public/blog_images/stage-tax-hero.* public/blog_images/triton-fractional-gpu-hero.*
git commit -m "content: add hero images for 3 LinkedIn-post migrations"
```

---

## Task 1: Post #1 — Arithmetic Intensity (decode vs prefill)

**Files:**
- Create: `content/writing/arithmetic-intensity-decode-vs-prefill.mdx`
- Read (source): `/Users/nehil/code/obsidian-vault/Clippings/Arithmetic Intensity Post  LinkedIn.md`
- Read (background, do NOT copy verbatim): `/Users/nehil/code/obsidian-vault/Clippings/KV cache and prefill compute bottleneck.md`

- [ ] **Step 1: Read both source files to internalize content**

Use the Read tool on both paths above. The LinkedIn post is the hook + thesis; the KV-cache file is the "why" — pull 2–3 paragraphs of explanation about arithmetic intensity, the ops:byte ratio (~200–300 FLOP/byte on A100), and why prefill saturates FLOPs while decode is memory-bandwidth-bound.

- [ ] **Step 2: Write the MDX file**

Create `content/writing/arithmetic-intensity-decode-vs-prefill.mdx` with this structure (fill the body using the editorial brief above and the source reading from Step 1):

```mdx
---
title: 'Two GPUs in one: why decode is memory-bound and prefill is compute-bound'
description: 'Every LLM inference deployment runs into the same wall twice — once during prefill, once during decode. Understanding arithmetic intensity is the difference between throwing more GPUs at it and actually fixing it.'
date: 2026-05-19
tags: ['inference', 'gpu', 'anyscale', 'optimization']
published: true
image: /blog_images/arithmetic-intensity-hero.png
---

[Opening paragraph: hook from LinkedIn post, expanded. ~3-4 sentences. Lead with the observation that every GPU inference workload has two distinct bottleneck regimes, not one.]

![Arithmetic intensity: decode is memory-bound, prefill is compute-bound.](/blog_images/arithmetic-intensity-hero.png)

## Arithmetic intensity in one line

[Define arithmetic intensity = FLOPs per byte. Define ops:byte ratio of a GPU (e.g., A100 ~200-300 FLOP/byte). Explain the rule: above the ratio → compute-bound, below → memory-bound. Pull from KV-cache source.]

## Prefill: compute saturates

[Explain: processing N tokens at once = big matmuls. QKV projections dot N tokens through d_model×d_model weights. FLOPs scale with N; bytes moved scale roughly with N too, but the intensity sits well above the ops:byte ratio. So prefill pegs the SMs.]

## Decode: HBM saturates

[Explain: generating one token at a time. The model weights still have to be read from HBM for every single token. FLOPs per byte collapse. GPU compute units sit idle waiting on memory. This is why decode throughput correlates with HBM bandwidth, not TFLOPs.]

## Why this matters for your inference bill

[Takeaway: most of the engineering effort in modern inference engineering — paged attention, speculative decoding, batching, quantization, prefill chunking — is about raising decode's arithmetic intensity so it stops being memory-bound. If you only know one knob exists (peak FLOPs), you'll size hardware wrong.]
```

Replace each bracketed `[...]` block with actual prose (2–5 sentences each) before saving.

- [ ] **Step 3: Verify frontmatter parses (start dev server)**

Run:
```bash
pnpm dev
```
Wait for "compiled successfully". Visit `http://localhost:3000/writing/arithmetic-intensity-decode-vs-prefill` in a browser. Expected: page renders, title and hero image visible, no Velite schema error in terminal. If Velite errors on `image:`, double-check the file actually exists at `public/blog_images/arithmetic-intensity-hero.png` (or whatever extension Task 0 produced).

Kill dev server (Ctrl-C) when verified.

- [ ] **Step 4: Commit**

```bash
git add content/writing/arithmetic-intensity-decode-vs-prefill.mdx
git commit -m "content: migrate arithmetic intensity LinkedIn post to blog"
```

---

## Task 2: Post #2 — The Stage Tax (streaming batch inference)

**Files:**
- Create: `content/writing/the-stage-tax-streaming-batch-inference.mdx`
- Read (LI source): `/Users/nehil/code/obsidian-vault/Clippings/Streaming Execution.md`
- Read (longer-form draft — use as primary spine): `/Users/nehil/code/obsidian-vault/20-Areas/Content/Pipeline/2-Drafts/the-stage-tax-gpu-pipeline-costs.md`

- [ ] **Step 1: Read both source files**

Use Read on both. The 2-Drafts file is essentially a 208-word version of the LI post with the same numbers and metaphor. The blog version should expand on the "how to detect this in your own pipeline" angle, which neither source fully develops.

- [ ] **Step 2: Write the MDX file**

Create `content/writing/the-stage-tax-streaming-batch-inference.mdx`:

```mdx
---
title: 'The Stage Tax: why your GPUs wait 30 minutes to work for 5'
description: 'Most batch inference pipelines run each operator to completion before the next starts. Your GPUs sit idle while the CPUs catch up. Streaming between stages turns serial hardware back into parallel hardware — same code, half the wall time.'
date: 2026-05-19
tags: ['ray', 'gpu', 'inference', 'optimization', 'anyscale']
published: true
image: /blog_images/stage-tax-hero.png
---

[Opening: lead with the 35-min / 5-min / 14% numbers in a single tight paragraph. Don't fragment them across one-line breaks like the LI version did.]

![Streaming vs staged execution in a batch inference pipeline.](/blog_images/stage-tax-hero.png)

## The numbers

[35 minutes wall time. 20 min decode + 10 min resize + 5 min GPU = 35. GPU did useful work for 5 of those 35. 14% utilization. The other 30 minutes: CPUs preprocessing a dataset that the GPU couldn't touch yet.]

## Why it happens

[Most data pipelines run each operator to completion before starting the next. Decode all images, write to disk. Resize all images, write to disk. Then load into GPU memory and infer. Each stage blocks the next. Parallel hardware running in series. Name the antipattern.]

## The fix: stream, don't stage

[CPU finishes batch 1 in seconds. GPU starts immediately on batch 1 while CPU works on batch 2. Both stay busy until the dataset is done. Same hardware, same logic. 35 min → ~21 min. GPU utilization 14% → near-continuous.]

## How to spot the Stage Tax in your own pipeline

[Practical checklist — 3-5 bullets. Things like: does each stage write to disk between operations? Is there a single dataset.cache() or .collect() between CPU and GPU work? Is GPU utilization < 50% on a job that "feels" GPU-bound? Bounded queues / backpressure / micro-batching as the implementation knobs (this is the angle from Krishna Challa's comment on the LI post — don't quote him, but the framing is good).]

[Closing line: the bottleneck was never compute; it was the dead time between stages. The question worth answering is how much it's costing you.]
```

Replace bracketed sections with prose. Keep all numbers verbatim.

- [ ] **Step 3: Verify (dev server)**

Run `pnpm dev`, visit `http://localhost:3000/writing/the-stage-tax-streaming-batch-inference`, confirm render and image. Kill server.

- [ ] **Step 4: Commit**

```bash
git add content/writing/the-stage-tax-streaming-batch-inference.mdx
git commit -m "content: migrate stage tax LinkedIn post to blog"
```

---

## Task 3: Post #3 — Six Triton servers on one L4 (fractional GPU sharing)

**Files:**
- Create: `content/writing/one-gpu-six-triton-servers.mdx`
- Read (LI source): `/Users/nehil/code/obsidian-vault/Clippings/Triton in Ray Serve Post  LinkedIn.md`
- Read (background): `/Users/nehil/code/obsidian-vault/20-Areas/Content/Pipeline/2-Drafts/triton-vs-ray-serve-decision-framework.md`

- [ ] **Step 1: Read both source files**

The LI post is the shortest of the three (~60 words). The decision-framework draft has the surrounding context (what Triton is, what Ray Serve does, why fronting Triton with Ray Serve is non-obvious). Pull the "what is Triton, what does Ray Serve add" framing into the blog version's mid-section.

- [ ] **Step 2: Write the MDX file**

Create `content/writing/one-gpu-six-triton-servers.mdx`:

```mdx
---
title: 'One L4, six Triton servers: fractional GPU sharing without MIG'
description: 'Most MLEs deploy one model per GPU and burn the rest of the VRAM. With ~300 lines of code, Ray Serve can route across six Triton Inference Servers on a single L4 — no MIG, no hardware partitioning, autoscaling included.'
date: 2026-05-19
tags: ['ray', 'gpu', 'inference', 'mlops', 'anyscale']
published: true
image: /blog_images/triton-fractional-gpu-hero.png
---

[Opening: hook with the 6-bedroom-house analogy from the LI post, but tighten it. One model per GPU is the default; for most production workloads it leaves 60-80% of VRAM idle.]

![Six Triton Inference Servers running on a single L4 GPU, fronted by Ray Serve.](/blog_images/triton-fractional-gpu-hero.png)

## Why one-model-per-GPU is the wrong default

[Brief: most models fit in 4-8 GB. An L4 has 24 GB. Defaulting to one replica per GPU strands ~70% of the memory and 100% of the compute when the model is idle between requests. The cost is real at fleet scale.]

## What Triton + Ray Serve gives you

[2-3 paragraphs from the decision-framework draft: Triton handles model loading, batching, framework-agnostic serving. Ray Serve handles routing, autoscaling, and now: co-locating multiple Triton replicas on shared GPU resources. The combination = software-level fractional GPU sharing without MIG (which requires A100/H100 and reboots to reconfigure).]

## ~300 lines of glue

[High-level shape — don't include actual code unless you have it on hand: a Ray Serve deployment wraps Triton's Python client, declares fractional GPU resources (e.g. `num_gpus=0.16`), and lets Ray's scheduler pack 6 replicas onto one device. Autoscaling and routing fall out for free.]

## Where this breaks down

[Honest caveat — this isn't a paragraph the LI post had room for. Workloads where each replica wants peak FLOPs simultaneously will contend. Best fit: many small/bursty models, embedding endpoints, low-QPS internal services. Worst fit: one big LLM serving high QPS.]
```

Replace bracketed sections with prose.

- [ ] **Step 3: Verify (dev server)**

`pnpm dev`, visit `http://localhost:3000/writing/one-gpu-six-triton-servers`, confirm render. Kill server.

- [ ] **Step 4: Commit**

```bash
git add content/writing/one-gpu-six-triton-servers.mdx
git commit -m "content: migrate triton fractional GPU sharing LinkedIn post to blog"
```

---

## Task 4: End-to-end verification

- [ ] **Step 1: Full lint + build**

Run:
```bash
pnpm lint
pnpm build
```
Expected: `pnpm lint` exits 0 (auto-fixes any whitespace it finds). `pnpm build` completes with no Velite schema errors and no MDX compile errors. The build log should list all three new posts in the Velite output.

- [ ] **Step 2: Verify all three posts in the index**

Run:
```bash
pnpm dev
```
Visit `http://localhost:3000/writing` in a browser. Expected: all three new posts appear at the top of the list (most recent first, since all dated 2026-05-19), each with its hero image as the listing thumbnail. Click each post — title, hero image, and body all render. Kill server.

- [ ] **Step 3: Verify OG images generate**

While dev server is still running (or restart), visit each of these in a browser:
- `http://localhost:3000/api/og?title=Two%20GPUs%20in%20one`
- `http://localhost:3000/api/og?title=The%20Stage%20Tax`
- `http://localhost:3000/api/og?title=One%20L4%2C%20six%20Triton%20servers`

Expected: each returns a generated PNG. (The site uses dynamic OG, so per-post static OG files are not required.)

- [ ] **Step 4: Verify tag pages include the new posts**

Visit `http://localhost:3000/tags` and confirm the tags used (`inference`, `gpu`, `ray`, `optimization`, `mlops`, `anyscale`) all show the new posts. Kill server.

- [ ] **Step 5: Push branch and open PR**

```bash
git push -u origin claude/awesome-bell-f51f89
gh pr create --title "content: migrate 3 LinkedIn posts to blog" --body "$(cat <<'EOF'
## Summary
- Migrates 3 LinkedIn posts authored by Nehil into native blog posts under `content/writing/`
- Each post is rewritten longer-form for blog reading (not a verbatim copy of the LinkedIn body)
- Hero images downloaded from LinkedIn CDN into `public/blog_images/`
- All posts dated 2026-05-19, tagged with existing vocabulary

## Posts
- `arithmetic-intensity-decode-vs-prefill` — why decode is memory-bound and prefill is compute-bound
- `the-stage-tax-streaming-batch-inference` — streaming vs staged execution in Ray Data pipelines
- `one-gpu-six-triton-servers` — fractional GPU sharing without MIG via Ray Serve + Triton

## Test plan
- [x] `pnpm lint` clean
- [x] `pnpm build` clean (Velite compiles all three posts)
- [x] All three posts render at `/writing/<slug>` in dev server
- [x] All three appear on `/writing` index with hero thumbnails
- [x] Tags resolve on `/tags/<tag>` pages

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR opens, URL printed. Report URL back to the user.

---

## Self-Review Checklist (run after writing each post body, before committing)

For each of the three posts, before its commit step:

- [ ] Every concrete number from the LinkedIn source is preserved (no rounding, no "approximately" added).
- [ ] No LinkedIn-isms remain ("TIL", "Boost", "View image", "impressions", emoji-style fragmenting).
- [ ] H2 sections exist (2–4 of them) — no wall of paragraphs.
- [ ] Inline image rendered with markdown `![alt](/blog_images/...)`, alt text descriptive.
- [ ] Frontmatter has `title`, `description`, `date: 2026-05-19`, `tags`, `published: true`, `image:`.
- [ ] No `author:` field (not in Velite schema — will break the build).
- [ ] No top-level `#` heading in the body (title is rendered by the post template).
- [ ] Word count 400–700.
- [ ] Closing paragraph gives a concrete takeaway, not a generic CTA.

---

## Risks and notes for the executing agent

- **LinkedIn image expiry:** the `e=` parameter in the licdn URLs is a Unix timestamp expiry. As of 2026-05-19 all three returned HTTP 200, but they may break by the time this plan runs. If a `curl` in Task 0 returns 403/404, the user will need to export the images manually from the LinkedIn post pages (URLs in the source clippings) and drop them at the paths listed.
- **Image extension mismatch:** the URLs do not declare extension. `file` may report JPEG even though we saved as `.png`. If so, rename the saved file and update both the frontmatter `image:` and the inline markdown image reference to match. Do not transcode.
- **Do not invent technical detail.** The arithmetic-intensity post pulls from a Claude conversation in the source notes — use the conceptual explanation, but do not fabricate specific numbers (e.g., don't claim "H100 has 400 FLOP/byte" unless that number is in the source). When in doubt, leave the number out.
- **Tags must already exist** for the `/tags` index to look clean. The tag vocabulary observed in recent posts: `anyscale`, `ray`, `ai-agents`, `optimization`, `data-engineering`, `mlops`, `gpu`, `inference`. Stick to these.
- **The worktree is already set up** (`claude/awesome-bell-f51f89`). Do not create another worktree.
