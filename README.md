# nehiljain.github.io

Personal site and blog of Nehil Jain: writing, projects and CV. Live at **https://nehiljain.github.io**.

Next.js 14 (App Router, static export), Velite + MDX, Tailwind and shadcn/ui. Every push to `master` builds and deploys to GitHub Pages through `.github/workflows/pages.yml`.

## Develop

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build   # Velite + Open Graph images + static export to out/
pnpm test    # vitest
```

To add a post, drop an `.mdx` file in `content/writing/` with `title`, `description`, `date`, `published` and `tags` frontmatter. CV and project content lives in `data/resume.ts`.

## Credits

Started from jolbol1's [nextjs-velite-blog-template](https://github.com/jolbol1/nextjs-velite-blog-template).
