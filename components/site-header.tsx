'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NJLockup } from '@/components/brand/nj-mark';
import { Icon } from '@/components/brand/icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileNav } from '@/components/mobile-nav';
import { DATA } from '@/data/resume';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/writing', label: 'Writing', Icon: Icon.Writing },
  { href: '/projects', label: 'Projects', Icon: Icon.Projects },
  { href: '/cv', label: 'CV', Icon: Icon.CV }
];

const SOCIAL = [
  { url: DATA.contact.social.GitHub.url, label: 'GitHub', Icon: Icon.Github },
  {
    url: DATA.contact.social.LinkedIn.url,
    label: 'LinkedIn',
    Icon: Icon.LinkedIn
  },
  {
    url: DATA.contact.social.Twitter.url,
    label: 'Twitter',
    Icon: Icon.Twitter
  },
  { url: `mailto:${DATA.email}`, label: 'Email', Icon: Icon.Mail }
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-nav items-center justify-between gap-6 px-4 py-3.5 sm:px-8">
        <Link href="/" aria-label="Home" className="no-underline">
          <NJLockup size={26} />
        </Link>

        <MobileNav />

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => {
            const isActive = pathname?.startsWith(item.href) ?? false;
            const I = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13.5px] font-semibold transition-colors no-underline',
                  isActive
                    ? 'border-accent bg-accent-soft text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <I size={16} fill="hsl(var(--accent))" />
                {item.label}
              </Link>
            );
          })}
          <span className="mx-1.5 h-[18px] w-px bg-rule" />
          {SOCIAL.map((s) => (
            <Link
              key={s.label}
              href={s.url}
              target={s.url.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            >
              <s.Icon size={18} fill="hsl(var(--accent))" />
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
