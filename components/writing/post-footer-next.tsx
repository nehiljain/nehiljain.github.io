import Link from 'next/link';

type NavPost = { slug: string; title: string } | undefined;

export function PostFooterNext({ prev, next }: { prev: NavPost; next: NavPost }) {
  if (!prev && !next) return null;
  return (
    <section className="mt-16 border-t border-dashed border-rule pt-8">
      <div className="grid gap-6 md:grid-cols-2">
        {prev ? (
          <Link
            href={'/' + prev.slug}
            className="block rounded-xl border border-border bg-card p-5 no-underline"
          >
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
              ← Previous
            </div>
            <div className="font-heading text-[19px] font-semibold leading-tight tracking-tight text-foreground">
              {prev.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={'/' + next.slug}
            className="block rounded-xl border border-accent bg-accent-soft p-5 no-underline"
          >
            <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-accent">
              Next →
            </div>
            <div className="font-heading text-[19px] font-semibold leading-tight tracking-tight text-foreground">
              {next.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
