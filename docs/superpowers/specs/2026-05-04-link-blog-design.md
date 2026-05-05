# Link blog feature — design

**Status:** draft
**Date:** 2026-05-04
**Branch:** `link-blog`

## Why

A link blog is a third low-stakes/high-value content category alongside long-form writing and projects (per [Simon Willison's framing](https://simonwillison.net/2024/Dec/22/link-blog/) — "things I've found"). Today the site only supports long-form essays under `/writing`. Most worth-sharing material is shorter than that — a sharp paragraph, a screenshot, a sentence of context — and there is currently no place for it on the site, so it does not get published. The goal is to make a 2-minute "found something interesting → live on the site" loop with the same Velite + MDX infrastructure already in use.

This spec covers V1 only: the rendering surface, schema, MDX components, and authoring helper. Search, unified feeds, RSS, and the screenshot pipeline are explicitly deferred (see "Out of scope").

## User experience

The end-to-end loop the design must support:

```
$ pnpm new-link https://example.com/post
                    ↓
content/links/2026-05-04-<slug>.mdx is created with prefilled
frontmatter (title, url, description fetched from og: tags),
opens in $EDITOR, cursor in body
                    ↓
write 1–3 short paragraphs of commentary; paste a CleanShot Cloud
URL for any screenshot; optionally drop in a <Quote> block
                    ↓
save → Velite re-builds (already in watch via pnpm dev) → page
visible at localhost:3000/links/<slug>
                    ↓
git commit && git push → Vercel deploys
```

Target: ≤2 minutes from "this is interesting" to live on the site.

## Decisions (resolved during brainstorming)

- **IA:** dedicated `/links` route; `/writing` stays essays-only. No unified feed in V1. (Option D in brainstorm.)
- **Title behavior:** title links to *your* post page; the post page renders a prominent "Read original →" CTA. ("Your page first," option B — not Daring Fireball / Simon's outward-linking convention.)
- **Citation primitives:** quote, screenshot, and video are all valid citations. Implemented as MDX components in the body, not as required schema fields, so authors stay flexible.
- **Authoring storage:** one MDX file per link in `content/links/` (option C in brainstorm — same pattern as `/writing`, plus a CLI helper to remove frontmatter friction).
- **Screenshots:** Tier 1 — author pastes a CleanShot Cloud URL into the markdown body. The system is image-source-agnostic. A self-hosted pipeline (Cloudflare R2 + alt-text) is a separate future project.
- **Tags:** shared namespace with `/writing`. The existing `/tags/<tag>` page lists posts of both kinds (mixed by date desc).
- **Drafts:** reuse the existing `published: false` frontmatter flag — no new draft-preview-URL infrastructure.

## Architecture

### Velite collection

A new `links` collection alongside the existing `posts`, defined in `velite.config.ts`:

```ts
const links = defineCollection({
  name: 'Link',
  pattern: 'links/**/*.mdx',
  schema: s.object({
    slug: s.path(),
    title: s.string().max(160),
    url: s.string().url(),
    date: s.isodate(),
    via: s.string().url().optional(),
    author: s.string().optional(),
    description: s.string().max(280).optional(),
    tags: s.array(s.string()).optional(),
    published: s.boolean().default(true),
    body: s.mdx(),
    code: s.mdx()
  }).transform(computedFields)
});

export default defineConfig({
  // ...existing config
  collections: { posts, links }
});
```

Velite's existing webpack-plugin integration (in `next.config.mjs`) needs no changes — the second collection is picked up automatically. Output appears as `links` on the `#site/content` import.

### File layout

```
content/
  writing/        ← existing essays
  links/
    2026-05-04-qdrant-vs-pgvector-benchmark.mdx
    2026-05-04-clay-ui-library.mdx
    ...
```

The date prefix in the filename keeps the directory chronologically sortable in the editor and ensures unique slugs even if two posts share a title. The route slug strips the date prefix (see slug derivation below).

### Slug derivation

Velite's `s.path()` produces a slug like `links/2026-05-04-qdrant-vs-pgvector-benchmark`. The existing `computedFields` transform yields `slugAsParams = "2026-05-04-qdrant-vs-pgvector-benchmark"`. For the `links` collection, the route slug should drop the date prefix → `qdrant-vs-pgvector-benchmark`. This is a small extension to `computedFields` (or a links-specific transform) that strips a leading `YYYY-MM-DD-` before exposing `slugAsParams`.

URL form: `/links/<slug-without-date>`. No date in the URL. Rationale: shorter, easier to share verbally, doesn't change if you correct the date later.

### Routes

```
app/links/
  page.tsx              # paginated listing
  [slug]/
    page.tsx            # single link post
```

**Listing (`/links`):** chronological desc, 15 per page (denser than `/writing`'s 5/page), filtered by `published`. Each row: title (links to permalink), date, domain chip extracted from `url`, optional `via` and tag chips, then the `description` as a 1–2 line preview. Reuses the existing `QueryPagination` component.

**Single link post (`/links/<slug>`):**
1. H1 — your title.
2. **Read original CTA** — bordered card immediately under the title. Renders the URL's domain prominently, the linked thing's `author` if present, and a click target that opens the external URL. This is the primary action on the page.
3. Metadata row — date, `via` (with icon, links to source of recommendation), tag chips.
4. MDX body — your commentary, including any `<Quote>`, screenshot, or embed components.
5. Footer — back-link to `/links`.

### MDX components

Three additions to `components/mdx-components.tsx`. That file is a single global components map applied to every MDX render in the app, so these components become usable in both `links/` and `writing/` content. (For `writing/`, this is a free upgrade — older essays continue to work unchanged, and new essays can also use `<Quote>` / `<Screenshot>` if they want.)

- **`<Quote source="..." url="...">…</Quote>`** — styled pull-quote block with attribution. `source` is required (the person/work being quoted); `url` is optional (deep link to the quoted material). Renders as a left-bordered blockquote with a small attribution line below.
- **`<Screenshot src="..." alt="..." caption?="..." />`** — `<img>` with required alt text and optional caption beneath. Used for both screenshots and any other figure-style image. Wraps the existing image rendering with a `<figure>`/`<figcaption>` pair.
- **`<VideoClip src="..." caption?="..." />`** — thin wrapper around the existing YouTube embed for non-YouTube sources (Loom, Vimeo, raw mp4). YouTube continues to use the existing component.

These components live in `components/` next to the existing `callout.tsx`, `youtube.tsx`, `mdx-components.tsx`.

### Authoring helper — `pnpm new-link <url>`

A Node script at `scripts/new-link.mjs`, wired into `package.json` as `"new-link": "node scripts/new-link.mjs"`.

Behavior:
1. Validate `<url>` is a syntactically valid URL.
2. Fetch the URL with a desktop user-agent. On any non-2xx response, fall back to empty defaults (do not abort — author can fill in by hand).
3. Parse the response HTML for `<title>`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta name="author">`, `<meta property="og:site_name">`. Prefer `og:` variants when present.
4. Compute a slug from the title using the existing `github-slugger` dependency.
5. Compute the file path: `content/links/<YYYY-MM-DD>-<slug>.mdx`. Today's date in the local timezone.
6. If the file already exists, exit with an error rather than overwriting.
7. Write the file with frontmatter prefilled from the fetch (`title`, `url`, `date`, `description`, `author` if present), plus empty `via:` and `tags: []` placeholders.
8. Open the file in `$EDITOR` (fall back to printing the path if `$EDITOR` is unset).

Plain Node, no new dependencies — `fetch` is global on Node 20+, and HTML parsing for the four `<meta>` tags can be regex-based at this scale (the helper does not need to be robust against adversarial HTML).

### Tag pages

The existing `app/tags/[tag]/page.tsx` reads only from the `posts` collection. It changes to merge `posts` + `links`, sort by date desc, and render each row with a small visual indicator (a link-arrow icon for link posts) so readers can tell them apart in a mixed list. The existing `getAllTags` helper in `lib/utils.ts` extends to accept either collection.

### Sitemap and metadata

- The catch-all sitemap (if any — needs verification during implementation) needs `/links` and each `/links/<slug>` added.
- `app/links/page.tsx` exports its own `metadata` (title, description) similar to `app/writing/page.tsx`.
- Per-post `generateMetadata` extracts title and description from the post.

## Out of scope (explicit non-goals for V1)

- **RSS feed.** No feed exists today; adding one is a separate, larger project (covers `/writing` too).
- **Search.** Site has no search currently. Faceted search like Simon's is a multi-week project.
- **Unified feed / homepage stream.** Brainstorm option D explicitly chosen.
- **Self-hosted screenshot pipeline.** Tier 2/3 (Cloudflare R2, custom CleanShot upload destination, AI alt-text) is a separate sibling project — link-blog is image-source-agnostic.
- **Newsletter.**
- **Draft preview URLs.** Drafts use the existing `published: false` flag; preview is local `pnpm dev`.
- **`via` auto-resolution.** Author pastes the URL by hand.
- **Link rot detection.** No link-checking job.
- **Webmentions / pingbacks.**

## Risks and constraints

- **Velite multi-collection support.** The current `velite.config.ts` defines a single collection. The library supports multiple, but the existing `VeliteWebpackPlugin` only triggers `build()`; the first integration test on a real change is the implementation step. If this fails, fallback is keeping `links` as a sub-pattern of `posts` with a discriminator field — uglier but unblocks.
- **Slug collisions.** Two link posts with identical titles posted on the same day would collide. The date-prefixed filename plus the existing-file check in `pnpm new-link` makes this a hard error, not a silent overwrite.
- **`pnpm new-link` URL fetch failures.** Many sites cloak content from non-browser user-agents. The script falls back to empty frontmatter — the author can paste the title manually. Not a blocker.
- **MDX component name collisions.** `<Quote>` is generic enough that future MDX content might want a different `Quote`. Naming this `<LinkQuote>` would be safer but uglier in the body. Accepting the risk; if collision becomes real, rename later.

## Success criteria

V1 is done when:
1. `pnpm new-link https://example.com/post` creates a valid MDX file and opens it in the editor.
2. Saving an MDX file under `content/links/` produces a working page at `/links/<slug>` in `pnpm dev`, with HMR.
3. `/links` lists all `published: true` link posts, paginated, sorted by date desc.
4. Each post page renders the title, a working "Read original →" CTA, metadata row, and the MDX body with `<Quote>` and `<Screenshot>` rendering correctly.
5. `/tags/<tag>` shows mixed posts and links for tags that appear in both.
6. `pnpm build` succeeds end-to-end and produces static pages for every published link post.
