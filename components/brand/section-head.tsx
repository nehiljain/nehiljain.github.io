import Link from 'next/link';

type Props = {
  kicker: string;
  title: string;
  linkText?: string;
  linkHref?: string;
};
export function SectionHead({ kicker, title, linkText, linkHref }: Props) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-dashed border-rule/60 pb-2.5">
      <div>
        <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.13em] text-muted-foreground">
          {kicker}
        </div>
        <h2 className="m-0 font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-[13.5px] font-semibold text-foreground no-underline"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
