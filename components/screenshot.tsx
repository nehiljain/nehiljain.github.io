import { cn } from '@/lib/utils';

interface ScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function Screenshot({ src, alt, caption, className }: ScreenshotProps) {
  return (
    <figure className={cn('my-6', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="rounded-md border border-border w-full h-auto"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
