import { defineConfig, defineCollection, s } from 'velite';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// posts: drop the collection prefix (e.g. 'writing/'); links: also strip the YYYY-MM-DD- date prefix.
const stripCollectionPrefix = (slug: string) =>
  slug.split('/').slice(1).join('/');

const stripDatePrefix = (s: string) =>
  s.replace(/^\d{4}-\d{2}-\d{2}-/, '');

const posts = defineCollection({
  name: 'Post',
  pattern: 'writing/**/*.mdx',
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      body: s.mdx(),
      code: s.mdx()
    })
    .transform((data) => ({
      ...data,
      slugAsParams: stripCollectionPrefix(data.slug)
    }))
});

const links = defineCollection({
  name: 'Link',
  pattern: 'links/**/*.mdx',
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(160),
      url: s.string().url(),
      date: s.isodate(),
      via: s.string().url().optional(),
      author: s.string().optional(),
      description: s.string().max(280).optional(),
      tags: s.array(s.string()).optional(),
      published: s.boolean().default(true),
      body: s.mdx()
    })
    .transform((data) => ({
      ...data,
      slugAsParams: stripDatePrefix(stripCollectionPrefix(data.slug))
    }))
});

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true
  },
  collections: { posts, links },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: 'github-dark' }],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section'
          }
        }
      ]
    ],
    remarkPlugins: []
  }
});
