import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/components/tag';
import { extractDomain } from '@/lib/url';
import { cn, formatDate } from '@/lib/utils';

interface LinkPostItemProps {
  slug: string;
  slugAsParams: string;
  title: string;
  date: string;
  url: string;
  description?: string;
  author?: string;
  via?: string;
  tags?: string[];
}

export function LinkPostItem({
  slugAsParams,
  title,
  date,
  url,
  description,
  author,
  via,
  tags
}: LinkPostItemProps) {
  const domain = extractDomain(url);
  const viaDomain = via ? extractDomain(via) : '';

  return (
    <article
      className={cn(
        'group relative rounded-xl border border-border bg-card',
        'p-5 sm:p-6 transition-all',
        'hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5',
        'focus-within:border-primary/50 focus-within:shadow-md'
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <Badge variant="outline" className="font-normal text-muted-foreground">
          {domain}
        </Badge>
        <time
          dateTime={date}
          className="text-xs text-muted-foreground tabular-nums"
        >
          {formatDate(date)}
        </time>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold leading-snug tracking-tight">
        <Link
          href={`/links/${slugAsParams}`}
          className="before:absolute before:inset-0 focus:outline-none"
        >
          <span
            className={cn(
              'bg-gradient-to-r from-primary to-primary',
              'bg-[length:0%_2px] bg-no-repeat',
              'transition-[background-size] duration-300',
              'group-hover:bg-[length:100%_2px]'
            )}
            style={{ backgroundPosition: '0 100%' }}
          >
            {title}
          </span>
          <ArrowUpRight
            className={cn(
              'inline-block h-4 w-4 ml-1 -mt-1 text-muted-foreground',
              'transition-transform duration-200',
              'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary'
            )}
          />
        </Link>
      </h3>

      {author && (
        <p className="mt-1 text-sm text-muted-foreground">by {author}</p>
      )}

      {description && (
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
          {description}
        </p>
      )}

      {(tags?.length || via) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 relative z-10">
          {tags?.map((t) => (
            <Tag key={t} tag={t} />
          ))}
          {via && (
            <span className="text-xs text-muted-foreground ml-auto">
              via{' '}
              <a
                href={via}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {viaDomain || 'source'}
              </a>
            </span>
          )}
        </div>
      )}
    </article>
  );
}
