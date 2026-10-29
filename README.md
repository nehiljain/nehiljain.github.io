# nehiljain.github.io

Personal site and blog of Nehil Jain: writing, projects and CV. Live at **https://nehiljain.dev**.

Next.js 14 (App Router, static export), Velite + MDX, Tailwind and shadcn/ui. Every push to `master` builds and deploys to a Cloudflare Worker through `.github/workflows/deploy.yml` (config in `wrangler.jsonc`; `workers/www-redirect/` sends www to the apex).

## Develop

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build   # Velite + Open Graph images + static export to out/
pnpm test    # vitest
```

To add a post, drop an `.mdx` file in `content/writing/` with `title`, `description`, `date`, `published` and `tags` frontmatter. CV and project content lives in `data/resume.ts`.

## Media

Images under 1 MB go in `public/`. Videos and large GIFs go to the `nehiljain-media` R2 bucket instead, which keeps them out of git and under Cloudflare's 25 MiB per-file limit for the site:

```bash
scripts/upload-media.sh <post-slug> demo.mp4   # prints https://media.nehiljain.dev/<post-slug>/demo.<hash>.mp4
```

Use the printed URL in the post. The hash in the name means a changed file gets a new URL, so browsers cache each one for a year.

## Credits

Started from jolbol1's [nextjs-velite-blog-template](https://github.com/jolbol1/nextjs-velite-blog-template).
