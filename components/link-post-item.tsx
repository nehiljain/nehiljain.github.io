import Link from 'next/link';
import { Calendar, Link2 } from 'lucide-react';
import { Tag } from '@/components/tag';
import { extractDomain } from '@/lib/url';
import { formatDate } from '@/lib/utils';

interface LinkPostItemProps {
  slug: string;
  slugAsParams: string;
  title: string;
  date: string;
  url: string;
  description?: string;
  via?: string;
  tags?: string[];
}

export function LinkPostItem({
  slugAsParams,
  title,
  date,
  url,
  description,
  via,
  tags
}: LinkPostItemProps) {
  return (
    <article className="flex flex-col gap-2 border-b border-border py-5">
      <h3 className="text-xl font-semibold leading-snug">
        <Link
          href={`/links/${slugAsParams}`}
          className="hover:underline decoration-primary/40 underline-offset-4"
        >
          <Link2 className="inline-block h-4 w-4 mr-1 -mt-0.5 text-muted-foreground" />
          {title}
        </Link>
      </h3>
      {description ? (
        <p className="text-muted-foreground">{description}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <time dateTime={date}>{formatDate(date)}</time>
        </span>
        <span>·</span>
        <span>{extractDomain(url)}</span>
        {via && (
          <>
            <span>·</span>
            <a
              href={via}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              via
            </a>
          </>
        )}
        {tags && tags.length > 0 && (
          <>
            <span>·</span>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Tag tag={tag} key={tag} />
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
