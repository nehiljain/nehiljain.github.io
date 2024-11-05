import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DATA } from '@/data/resume';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-1">
            {Object.entries(DATA.contact.social)
              .filter(([, social]) => social.navbar)
              .map(([name, social]) => (
                <Link
                  key={name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'hidden sm:inline-flex'
                  )}
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}

            <Link
              href={`mailto:${DATA.email}`}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'hidden sm:inline-flex'
              )}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Contact</span>
            </Link>

            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
