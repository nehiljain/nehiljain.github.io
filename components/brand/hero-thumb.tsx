type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};
export function HeroThumb({
  src,
  alt,
  width = 200,
  height = 130,
  className
}: Props) {
  return (
    <div
      className={`shrink-0 rounded-lg border border-border bg-paper p-[5px] -rotate-[0.6deg] shadow-[3px_4px_0_rgba(0,0,0,0.1)] dark:shadow-[3px_4px_0_rgba(0,0,0,0.27)] ${className ?? ''}`}
      style={{ width, height }}
    >
      <div
        role="img"
        aria-label={alt}
        className="h-full w-full rounded bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
}
