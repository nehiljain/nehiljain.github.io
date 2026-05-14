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
  const titleSize = accent ? 'text-4xl lg:text-[40px]' : 'text-[28px]';

  return (
    <Link
      href={'/' + post.slug}
      className={`group grid items-start gap-6 border-t border-rule/40 py-6 no-underline text-foreground ${
        hasImage
          ? 'grid-cols-[52px_minmax(0,1fr)_200px]'
          : 'grid-cols-[52px_minmax(0,1fr)]'
      }`}
    >
      <div className="pt-1 font-mono text-[11px] font-semibold tracking-wide text-muted-foreground transition-colors duration-200 group-hover:text-accent">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-muted-foreground">
          <span>{formatDate(post.date)}</span>
          {readTime && (
            <span className="inline-flex items-center gap-1">
              <Icon.Clock size={12} fill="hsl(var(--accent))" />
              {readTime}
            </span>
          )}
          {post.tags && post.tags.length > 0 && (
            <span className="text-rule">·</span>
          )}
          {post.tags?.map((t, i) => (
            <TagPill key={t} accent={accent && i === 0}>
              {t}
            </TagPill>
          ))}
        </div>

        <h3
          className={`m-0 inline-flex items-baseline gap-2 font-heading font-semibold leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent ${titleSize}`}
        >
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_2px]">
            {post.title}
          </span>
          <span
            aria-hidden
            className="translate-x-[-4px] text-accent opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          >
            <Icon.ArrowUpRight size={accent ? 24 : 20} />
          </span>
        </h3>

        {post.description && (
          <p
            className={`mt-2 text-base leading-relaxed text-muted-foreground ${accent ? 'lg:text-lg' : ''}`}
          >
            {post.description}
          </p>
        )}
      </div>

      {hasImage && <HeroThumb src={post.image!} alt={post.title} />}
    </Link>
  );
}
