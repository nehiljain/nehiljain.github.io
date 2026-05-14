import { TagPill } from '@/components/brand/tag-pill';
import { formatDate, getReadingTime, inferKind } from '@/lib/utils';

type Post = {
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  body: string;
};

export function PostHeader({ post }: { post: Post }) {
  const kind = inferKind(post.tags);
  const readTime = getReadingTime(post.body);
  return (
    <header className="text-left">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex items-center rounded-full border border-accent bg-accent-soft px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-accent">
          {kind}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {formatDate(post.date)} · {readTime}
        </span>
      </div>
      <h1 className="m-0 font-heading text-5xl font-semibold leading-[1.06] tracking-tight text-foreground lg:text-[60px]">
        {post.title}
      </h1>
      {post.description && (
        <p className="mt-4 text-xl leading-snug text-muted-foreground lg:text-[21px]">
          {post.description}
        </p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-6 flex items-center gap-2 border-t border-dashed border-rule pt-4">
          {post.tags.map((t) => (
            <TagPill key={t}>{t}</TagPill>
          ))}
        </div>
      )}
    </header>
  );
}
