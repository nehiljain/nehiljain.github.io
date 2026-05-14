type Props = { src: string; alt: string; caption?: string };
export function SketchnotePlate({ src, alt, caption }: Props) {
  return (
    <figure className="my-8 max-w-[720px]">
      <div className="relative rounded-xl border border-border/50 bg-paper p-2 shadow-[3px_4px_0_rgba(0,0,0,0.08)] dark:shadow-[3px_4px_0_rgba(0,0,0,0.2)]">
        <div className="relative overflow-hidden rounded-lg bg-[#1e2030]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="block w-full" />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-script text-lg font-bold text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
