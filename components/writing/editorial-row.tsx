import Link from 'next/link';
import { TagPill } from '@/components/brand/tag-pill';
import { HeroThumb } from '@/components/brand/hero-thumb';
import { Icon } from '@/components/brand/icon';
import { formatDate, getReadingTime } from '@/lib/utils';

export type EditorialPost = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  image?: string;
  body?: string;
};

type Props = { post: EditorialPost; index: number; accent?: boolean };

export function EditorialRow({ post, index, accent = false }: Props) {
  const hasImage = !!post.image;
  const readTime = post.body ? getReadingTime(post.body) : null;
  return (
    <Link
      href={'/' + post.slug}
      className="grid grid-cols-[52px_1fr_200px] items-start gap-6 border-t border-rule/40 py-6 no-underline text-foreground"
    >
      <div className="pt-1 font-mono text-[11px] font-semibold tracking-wide text-muted-foreground">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        {post.tags && post.tags.length > 0 && (
          <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
            {post.tags.map((t, i) => (
              <TagPill key={t} accent={accent && i === 0}>
                {t}
              </TagPill>
            ))}
          </div>
        )}
        <h3 className="m-0 font-heading text-[28px] font-semibold leading-tight tracking-tight text-foreground">
          {post.title}
        </h3>
        {post.description && (
          <p className="mt-2 max-w-[620px] text-base leading-relaxed text-muted-foreground">
            {post.description}
          </p>
        )}
        {hasImage && (
          <div className="mt-3 flex items-center gap-3.5 font-mono text-[11px] text-muted-foreground">
            <span>{formatDate(post.date)}</span>
            {readTime && (
              <span className="inline-flex items-center gap-1">
                <Icon.Clock size={12} fill="hsl(var(--accent))" />
                {readTime}
              </span>
            )}
          </div>
        )}
      </div>
      {hasImage ? (
        <HeroThumb src={post.image!} alt={post.title} />
      ) : (
        <div className="flex flex-col items-end gap-2 pt-1.5 font-mono text-[11px] text-muted-foreground">
          <span>{formatDate(post.date)}</span>
          {readTime && (
            <span className="inline-flex items-center gap-1">
              <Icon.Clock size={12} fill="hsl(var(--accent))" />
              {readTime}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
