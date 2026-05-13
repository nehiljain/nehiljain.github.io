'use client';

import { inferKind } from '@/lib/utils';
import type { EditorialPost } from '@/components/writing/editorial-row';

function SidebarCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-[18px]">
      <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

export function WritingSidebar({ posts }: { posts: EditorialPost[] }) {
  const total = posts.length;
  const counts: Record<string, number> = {
    essay: 0,
    sketchnote: 0,
    retro: 0,
    til: 0
  };
  posts.forEach((p) => {
    counts[inferKind(p.tags)]++;
  });
  const kinds = [
    { k: 'all', label: 'Everything', count: total, on: true },
    { k: 'essay', label: 'Essays', count: counts.essay, on: false },
    {
      k: 'sketchnote',
      label: 'Sketchnotes',
      count: counts.sketchnote,
      on: false
    },
    { k: 'retro', label: 'Retros', count: counts.retro, on: false },
    { k: 'til', label: 'TIL', count: counts.til, on: false }
  ];

  const tagCounts: Record<string, number> = {};
  posts.forEach((p) =>
    p.tags?.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    })
  );
  const tagList = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <aside className="sticky top-20 flex flex-col gap-6 self-start">
      <SidebarCard title="Filter by kind">
        <div className="flex flex-col gap-1.5">
          {kinds.map((it) => (
            <div
              key={it.k}
              className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 ${
                it.on ? 'border-accent bg-accent-soft' : 'border-transparent'
              }`}
            >
              <span
                className={`text-[13px] text-foreground ${it.on ? 'font-bold' : 'font-medium'}`}
              >
                {it.label}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {it.count}
              </span>
            </div>
          ))}
        </div>
      </SidebarCard>

      <SidebarCard title="Tags">
        <div className="flex flex-wrap gap-1.5">
          {tagList.map(([tag, count]) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-rule px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground"
            >
              {tag}
              <span className="text-[10px] opacity-70">· {count}</span>
            </span>
          ))}
        </div>
      </SidebarCard>

      <SidebarCard title="Subscribe">
        <div className="mb-2.5 text-[13px] leading-snug text-muted-foreground">
          Roughly monthly. Notes from production, no marketing.
        </div>
        <form className="flex gap-1.5" onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="you@email.com"
            className="min-w-0 flex-1 rounded-lg border border-rule bg-background px-2.5 py-2 text-xs text-foreground outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-3 py-2 font-heading text-xs font-bold text-accent-foreground"
          >
            Subscribe
          </button>
        </form>
      </SidebarCard>
    </aside>
  );
}
