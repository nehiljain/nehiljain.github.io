import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Tag } from './tag';

interface PostItemProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: Array<string>;
}

export function PostItem({
  slug,
  title,
  description,
  date,
  tags
}: PostItemProps) {
  return (
    <Link href={'/' + slug}>
      <article
        className="group relative rounded-lg border p-6 shadow-md 
        hover:shadow-lg transition-all duration-200 
        hover:bg-accent hover:border-accent-foreground cursor-pointer"
      >
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag tag={tag} key={tag} />
              ))}
            </div>
          )}

          {description && (
            <div className="text-muted-foreground line-clamp-2">
              {description}
            </div>
          )}

          <div className="flex justify-between items-center pt-0">
            <dl>
              <dt className="sr-only">Published On</dt>
              <dd className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={date}>{formatDate(date)}</time>
              </dd>
            </dl>
            <span className="text-sm font-medium">Read more →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
