import { SectionHead } from '@/components/brand/section-head';

function NowCard({
  kicker,
  title,
  body
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="relative rounded-xl border border-border bg-card p-5">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-accent">
        {kicker}
      </div>
      <div className="mt-1.5 text-[17px] font-bold tracking-tight text-foreground">
        {title}
      </div>
      <div className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        {body}
      </div>
    </div>
  );
}

export function HomeNowSection() {
  return (
    <section className="mb-16">
      <SectionHead title="What I'm working on" />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <NowCard
          kicker="ANYSCALE"
          title="Field engineering"
          body="I partner with ML and platform teams on the hard parts of scaling distributed AI on Ray… multimodal pipelines, distributed training, and inference engineering."
        />
        <NowCard
          kicker="WRITING"
          title="Notes from the field"
          body="Experiments, TILs, retros, and sketchnotes."
        />
      </div>
    </section>
  );
}
