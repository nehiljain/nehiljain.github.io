import { links } from '#site/content';
import { LinkPostItem } from '@/components/link-post-item';
import { QueryPagination } from '@/components/query-pagination';
import { Tag } from '@/components/tag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllTags, sortPosts, sortTagsByCount } from '@/lib/utils';
import { Metadata } from 'next';
import { Link2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Links',
  description:
    'Things I have found — short link posts with commentary, quotes, and screenshots.'
};

const LINKS_PER_PAGE = 15;

interface LinksPageProps {
  searchParams: { page?: string };
}

export default async function LinksPage({ searchParams }: LinksPageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const sorted = sortPosts(links.filter((l) => l.published) as any);
  const totalPages = Math.ceil(sorted.length / LINKS_PER_PAGE);
  const display = sorted.slice(
    LINKS_PER_PAGE * (currentPage - 1),
    LINKS_PER_PAGE * currentPage
  );

  const tags = getAllTags(links as any);
  const sortedTags = sortTagsByCount(tags);

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h2 className="inline-block font-black text-3xl lg:text-4xl">
            <Link2 className="inline-block size-6 lg:size-10 mr-2" />
            Links
          </h2>
          <p className="text-xl text-muted-foreground">
            Things I have found — short link posts with commentary.
          </p>
        </div>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-12 gap-3 mt-8">
        <div className="col-span-12 col-start-1 sm:col-span-8">
          {display.length > 0 ? (
            <ul className="flex flex-col">
              {display.map((link: any) => (
                <li key={link.slug}>
                  <LinkPostItem
                    slug={link.slug}
                    slugAsParams={link.slugAsParams}
                    title={link.title}
                    date={link.date}
                    url={link.url}
                    description={link.description}
                    via={link.via}
                    tags={link.tags}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>Nothing to see here yet</p>
          )}
          <QueryPagination
            totalPages={totalPages}
            className="justify-end mt-4"
          />
        </div>
        <Card className="col-span-12 row-start-3 h-fit sm:col-span-4 sm:col-start-9 sm:row-start-1">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {sortedTags.map((tag) => (
              <Tag tag={tag} key={tag} count={tags[tag]} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
