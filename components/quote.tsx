import { cn } from '@/lib/utils';

interface QuoteProps {
  source: string;
  url?: string;
  children: React.ReactNode;
  className?: string;
}

export function Quote({ source, url, children, className }: QuoteProps) {
  return (
    <figure
      className={cn(
        'my-6 border-l-4 border-primary/40 pl-4 italic',
        className
      )}
    >
      <blockquote className="text-lg leading-relaxed">{children}</blockquote>
      <figcaption className="mt-2 not-italic text-sm text-muted-foreground">
        —{' '}
        {url ? (
          <a href={url} className="hover:underline">
            {source}
          </a>
        ) : (
          source
        )}
      </figcaption>
    </figure>
  );
}
