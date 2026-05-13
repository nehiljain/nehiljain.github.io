import { Icon } from '@/components/brand/icon';
import { cn } from '@/lib/utils';

type Props = { title?: string; children: React.ReactNode; className?: string };

export function Callout({ title, children, className }: Props) {
  return (
    <aside className={cn(
      'my-7 flex items-start gap-3 rounded-r-xl border-l-4 border-accent bg-accent-soft px-4 py-3',
      className
    )}>
      <Icon.Spark size={20} stroke="hsl(var(--foreground))" fill="hsl(var(--accent))" />
      <div>
        {title && <div className="font-semibold text-foreground">{title}</div>}
        <div className="mt-0.5 leading-relaxed text-foreground">{children}</div>
      </div>
    </aside>
  );
}
