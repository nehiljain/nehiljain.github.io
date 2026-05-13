import { posts } from '#site/content';
import { MDXContent } from '@/components/mdx-components';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import '@/styles/mdx.css';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { siteMetadata } from '@/config/metadata';
import { sortPosts } from '@/lib/utils';
import { extractToc } from '@/lib/toc';
import { PostHeader } from '@/components/writing/post-header';
import { PostMetaRail } from '@/components/writing/post-meta-rail';
import { PostTOCRail } from '@/components/writing/post-toc-rail';
import { PostFooterNext } from '@/components/writing/post-footer-next';
import { SketchnotePlate } from '@/components/brand/sketchnote-plate';

interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostPageProps['params']) {
  const slug = params?.slug?.join('/');
  const post = posts.find((post) => post.slugAsParams === slug);

  return post;
}

export async function generateMetadata({
  params
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

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
}

export async function generateStaticParams(): Promise<
  PostPageProps['params'][]
> {
  return posts
    .filter((post) => post.published)
    .map((post) => ({ slug: post.slugAsParams.split('/') }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post || !post.published) {
    notFound();
  }

  const all = sortPosts(posts.filter((p) => p.published));
  const idx = all.findIndex((p) => p.slugAsParams === post.slugAsParams);
  const prev = all[idx + 1];
  const next = all[idx - 1];

  // TOC: use post.raw (added to velite schema) to extract headings.
  const rawSource = (post as unknown as { raw?: string }).raw;
  const toc = rawSource ? extractToc(rawSource) : [];

  return (
    <main className="mx-auto max-w-content px-4 pb-16 pt-8 sm:px-8">
      <nav className="mb-5 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
        <Link href="/writing" className="text-muted-foreground no-underline hover:text-foreground">
          writing
        </Link>
        <span>/</span>
        <span className="text-foreground">{post.slugAsParams}</span>
      </nav>
      <PostHeader post={post} />
      <div className="mt-8 grid gap-10 lg:grid-cols-[180px_1fr_200px]">
        <PostMetaRail post={post} />
        <article className="prose prose-zinc dark:prose-invert max-w-[760px]">
          {post.image && (
            <SketchnotePlate src={post.image} alt={post.title} />
          )}
          <MDXContent code={post.body} />
        </article>
        <PostTOCRail items={toc} />
      </div>
      <PostFooterNext
        prev={prev ? { slug: prev.slug, title: prev.title } : undefined}
        next={next ? { slug: next.slug, title: next.title } : undefined}
      />
    </main>
  );
}
