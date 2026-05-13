import { cn } from '@/lib/utils';
import * as React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SolidBtn({ children, className, ...props }: Props) {
  return (
    <button {...props} className={cn(
      'inline-flex items-center gap-2 rounded-[10px] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground',
      'shadow-[3px_3px_0_hsl(var(--foreground))]',
      className
    )}>
      {children}
    </button>
  );
}

export function OutlineBtn({ children, className, ...props }: Props) {
  return (
    <button {...props} className={cn(
      'inline-flex items-center gap-2 rounded-[10px] border-[1.5px] border-foreground bg-transparent px-[15px] py-[9px] text-sm font-semibold text-foreground',
      className
    )}>
      {children}
    </button>
  );
}

export function GhostBtn({ children, className, ...props }: Props) {
  return (
    <button {...props} className={cn(
      'inline-flex items-center gap-2 rounded-[10px] bg-accent-soft px-[15px] py-[9px] text-sm font-semibold text-foreground',
      className
    )}>
      {children}
    </button>
  );
}
