import type { TocItem } from '@/lib/toc';

export function PostTOCRail({ items }: { items: TocItem[] }) {
  return (
    <aside className="sticky top-20 self-start">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
        On this page
      </div>
      {items.length === 0 ? (
        <div className="text-[13px] text-muted-foreground">—</div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 border-l border-rule pl-3.5">
          {items.map((it, i) => (
            <li
              key={it.id}
              className={`text-[13px] ${i === 0 ? 'font-semibold text-accent' : 'font-normal text-muted-foreground'}`}
              style={{ paddingLeft: (it.depth - 2) * 10 }}
            >
              <a href={`#${it.id}`} className="text-inherit no-underline">
                {it.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
