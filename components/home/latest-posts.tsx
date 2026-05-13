import { posts } from '#site/content';
import { sortPosts } from '@/lib/utils';
import { SectionHead } from '@/components/brand/section-head';
import { EditorialRow } from '@/components/writing/editorial-row';

export function HomeLatestPosts() {
  const latest = sortPosts(posts.filter((p) => p.published)).slice(0, 5);
  return (
    <section className="mb-16">
      <SectionHead
        kicker="02 · WRITING"
        title="Latest"
        linkText="View all →"
        linkHref="/writing"
      />
      <div className="mt-5 flex flex-col">
        {latest.map((p, i) => (
          <EditorialRow
            key={p.slug}
            post={{
              slug: p.slug,
              title: p.title,
              description: p.description,
              date: p.date,
              tags: p.tags,
              image: p.image,
              body: p.body
            }}
            index={i}
            accent={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
