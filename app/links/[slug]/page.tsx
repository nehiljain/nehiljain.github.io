import { links } from '#site/content';
import { MDXContent } from '@/components/mdx-components';
import { ReadOriginalCTA } from '@/components/read-original-cta';
import { Tag } from '@/components/tag';
import { formatDate } from '@/lib/utils';
import { Calendar, Circle } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

import '@/styles/mdx.css';

interface LinkPageProps {
  params: { slug: string };
}

function getLinkFromParams(params: LinkPageProps['params']) {
  return links.find((l: any) => l.slugAsParams === params.slug);
}

export async function generateMetadata({
  params
}: LinkPageProps): Promise<Metadata> {
  const link = getLinkFromParams(params) as any;
  if (!link) return {};

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('title', link.title);

  return {
    title: link.title,
    description: link.description,
    authors: { name: siteConfig.author },
    openGraph: {
      title: link.title,
      description: link.description,
      type: 'article',
      url: `/links/${link.slugAsParams}`,
      images: [
        {
          url: `/api/og?${ogSearchParams.toString()}`,
          width: 1200,
          height: 630,
          alt: link.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: link.title,
      description: link.description,
      images: [`/api/og?${ogSearchParams.toString()}`]
    }
  };
}

export async function generateStaticParams(): Promise<
  LinkPageProps['params'][]
> {
  return links.map((l: any) => ({ slug: l.slugAsParams }));
}

export default async function LinkPage({ params }: LinkPageProps) {
  const link = getLinkFromParams(params) as any;

  if (!link || !link.published) notFound();

  return (
    <article className="container py-6 prose dark:prose-invert max-w-3xl mx-auto">
      <h1 className="mb-3">{link.title}</h1>

      <ReadOriginalCTA url={link.url} author={link.author} className="mb-6" />

      <div className="flex items-center gap-2 text-muted-foreground mb-4 not-prose text-sm">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <time dateTime={link.date}>{formatDate(link.date)}</time>
        </span>

        {link.via && (
          <>
            <Circle className="h-1.5 w-1.5 fill-current" />
            <a
              href={link.via}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              via
            </a>
          </>
        )}

        {link.tags && link.tags.length > 0 && (
          <>
            <Circle className="h-1.5 w-1.5 fill-current" />
            <div className="flex flex-wrap gap-1">
              {link.tags.map((tag: string) => (
                <Tag tag={tag} key={tag} />
              ))}
            </div>
          </>
        )}
      </div>

      <hr className="my-4" />
      <MDXContent code={link.body} />
    </article>
  );
}
