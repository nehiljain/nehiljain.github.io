import { cn } from '@/lib/utils';

interface VideoClipProps {
  src: string;
  caption?: string;
  className?: string;
}

export function VideoClip({ src, caption, className }: VideoClipProps) {
  return (
    <figure className={cn('my-6', className)}>
      <video
        src={src}
        controls
        className="w-full rounded-md border border-border"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
