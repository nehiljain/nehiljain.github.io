import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  accent?: boolean;
  size?: 'sm' | 'md';
  className?: string;
};
export function TagPill({
  children,
  accent = false,
  size = 'sm',
  className
}: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-mono font-medium lowercase tracking-wide border',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        accent
          ? 'border-accent bg-accent-soft text-foreground'
          : 'border-rule text-muted-foreground',
        className
      )}
    >
      {children}
    </span>
  );
}
