import { cn } from '@/lib/utils';
import * as React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

// Solid (peach). At rest: 3px stamped shadow.
// Hover: translates 1px toward the shadow so the press feels physical, shadow
// shrinks to 1px. Active: collapses fully (looks pressed-in).
export function SolidBtn({ children, className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        'group/btn inline-flex items-center gap-2 rounded-[10px] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground',
        'shadow-[3px_3px_0_hsl(var(--foreground))] transition-[transform,box-shadow,background-color] duration-150 ease-out',
        'hover:-translate-y-0.5 hover:shadow-[4px_5px_0_hsl(var(--foreground))] hover:brightness-110',
        'active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_hsl(var(--foreground))]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      <span className="inline-flex items-center gap-2 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5">
        {children}
      </span>
    </button>
  );
}

// Outline. Hover: peach border + peach text + a soft peach tint behind so it
// feels reachable. Active: snaps into the accent-soft.
export function OutlineBtn({ children, className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center gap-2 rounded-[10px] border-[1.5px] border-foreground bg-transparent px-[15px] py-[9px] text-sm font-semibold text-foreground',
        'transition-[color,background-color,border-color,transform] duration-150 ease-out',
        'hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft hover:text-accent',
        'active:translate-y-0 active:bg-accent-soft',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      {children}
    </button>
  );
}

// Ghost. Subtle: deepens the tint on hover, no lift.
export function GhostBtn({ children, className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center gap-2 rounded-[10px] bg-accent-soft px-[15px] py-[9px] text-sm font-semibold text-foreground',
        'transition-colors duration-150 ease-out hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      {children}
    </button>
  );
}
