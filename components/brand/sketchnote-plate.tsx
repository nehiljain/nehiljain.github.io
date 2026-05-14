import { DoodleArrow } from './doodle-arrow';

type Props = { src: string; alt: string; caption?: string };
export function SketchnotePlate({ src, alt, caption }: Props) {
  return (
    <figure className="my-8 max-w-[720px]">
      <div className="relative -rotate-[0.5deg] rounded-2xl border border-border bg-paper p-4 shadow-[5px_6px_0_rgba(0,0,0,0.13)] dark:shadow-[5px_6px_0_rgba(0,0,0,0.27)]">
        <div
          className="relative overflow-hidden rounded-[10px] bg-[#1e2030]"
          style={{ aspectRatio: '643 / 590' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        </div>
        <DoodleArrow
          color="hsl(var(--accent))"
          width={80}
          height={44}
          style={{
            position: 'absolute',
            top: -22,
            right: 14,
            transform: 'rotate(-12deg)'
          }}
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-script text-lg font-bold text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
