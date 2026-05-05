import { posts, links } from '#site/content';
import { PostItem } from '@/components/post-item';
import { LinkPostItem } from '@/components/link-post-item';
import { Tag } from '@/components/tag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllTags, getPostsByTagSlug, sortTagsByCount } from '@/lib/utils';
import { slug } from 'github-slugger';
import { Metadata } from 'next';

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateMetadata({
  params
}: TagPageProps): Promise<Metadata> {
  const { tag } = params;
  return {
    title: tag,
    description: `Posts on the topic of ${tag}`
  };
}

export const generateStaticParams = () => {
  const tags = getAllTags([...posts, ...links]);
  const paths = Object.keys(tags).map((tag) => ({ tag: slug(tag) }));
  return paths;
};

export default function TagPage({ params }: TagPageProps) {
  const { tag } = params;
  const title = tag.split('-').join(' ');

  const all = [...posts, ...links];
  const allMatches = getPostsByTagSlug(all, tag);
  const displayItems = allMatches
    .filter((item: any) => item.published)
    .sort((a: any, b: any) => (a.date > b.date ? -1 : 1));
  const tags = getAllTags(all);
  const sortedTags = sortTagsByCount(tags);

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-black text-4xl lg:text-5xl capitalize">
            {title}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-8">
        <div className="col-span-12 col-start-1 sm:col-span-8">
          <hr />
          {displayItems?.length > 0 ? (
            <ul className="flex flex-col">
              {displayItems.map((item: any) =>
                'url' in item ? (
                  <li key={item.slug}>
                    <LinkPostItem
                      slug={item.slug}
                      slugAsParams={item.slugAsParams}
                      title={item.title}
                      date={item.date}
                      url={item.url}
                      description={item.description}
                      via={item.via}
                      tags={item.tags}
                    />
                  </li>
                ) : (
                  <li key={item.slug}>
                    <PostItem
                      slug={item.slug}
                      date={item.date}
                      title={item.title}
                      description={item.description}
                      tags={item.tags}
                    />
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>Nothing to see here yet</p>
          )}
        </div>
        <Card className="col-span-12 row-start-3 h-fit sm:col-span-4 sm:col-start-9 sm:row-start-1">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {sortedTags?.map((t) => (
              <Tag tag={t} key={t} count={tags[t]} current={slug(t) === tag} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
