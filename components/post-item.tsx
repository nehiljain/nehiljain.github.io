import { Calendar, Circle } from 'lucide-react';
import Link from 'next/link';
import { formatDate, getReadingTime } from '@/lib/utils';
import { Tag } from './tag';

interface PostItemProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: Array<string>;
  content?: string;
}

export function PostItem({
  slug,
  title,
  description,
  date,
  tags,
  content
}: PostItemProps) {
  return (
    <div className="relative">
      <Link
        href={'/' + slug}
        className="block group rounded-lg border p-4 shadow-md 
          hover:shadow-lg transition-all duration-200 
          hover:bg-accent/40 hover:border-accent-foreground cursor-pointer mb-4"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>

          {description && (
            <div className="text-muted-foreground line-clamp-2">
              {description}
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              <time dateTime={date}>{formatDate(date)}</time>
            </span>

            {content && (
              <>
                <Circle className="h-1.5 w-1.5 fill-current" />
                <span className="text-sm">{getReadingTime(content)}</span>
              </>
            )}

            {tags && tags.length > 0 && (
              <>
                <Circle className="h-1.5 w-1.5 fill-current" />
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Tag tag={tag} key={tag} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
