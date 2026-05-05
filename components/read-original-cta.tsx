import { ExternalLink } from 'lucide-react';
import { extractDomain } from '@/lib/url';
import { cn } from '@/lib/utils';

interface ReadOriginalCTAProps {
  url: string;
  author?: string;
  className?: string;
}

export function ReadOriginalCTA({
  url,
  author,
  className
}: ReadOriginalCTAProps) {
  const domain = extractDomain(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group not-prose flex items-center justify-between gap-4',
        'rounded-lg border border-border bg-muted/40 px-5 py-4',
        'hover:border-primary/60 hover:bg-muted/70 transition-colors',
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-base font-semibold group-hover:underline">
          Read original →
        </span>
        <span className="text-sm text-muted-foreground">
          {domain}
          {author ? ` · by ${author}` : ''}
        </span>
      </div>
      <ExternalLink className="h-5 w-5 shrink-0 text-muted-foreground" />
    </a>
  );
}
