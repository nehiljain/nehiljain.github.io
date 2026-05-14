import { posts } from '#site/content';
import { sortPosts } from '@/lib/utils';
import { WritingHero } from '@/components/writing/writing-hero';
import { WritingSidebar } from '@/components/writing/sidebar';
import { EditorialRow } from '@/components/writing/editorial-row';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Experiments, TILs, retros, and sketchnotes on AI infra, data engineering, and the unglamorous bits of making AI reliable in production.'
};

export default function WritingPage() {
  const all = sortPosts(posts.filter((p) => p.published)).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags,
    image: p.image,
    body: p.body
  }));

  return (
    <main className="mx-auto max-w-content px-4 pb-16 pt-12 sm:px-8">
      <WritingHero />
      <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_260px]">
        <div>
          {all.map((p, i) => (
            <EditorialRow key={p.slug} post={p} accent={i === 0} />
          ))}
        </div>
        <WritingSidebar posts={all} />
      </div>
    </main>
  );
}
