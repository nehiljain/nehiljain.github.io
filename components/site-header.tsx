import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { MainNav } from './main-nav';
import { ModeToggle } from './mode-toggle';
import { DATA } from '@/data/resume';
import { Icons } from './icons';

export function SiteHeader() {
  const ContactIcon = Icons.mail;

  return (
    <header className="z-10 sticky top-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-1">
            {/* Social Links */}
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

            {/* Contact Link */}
            <Link
              href={`mailto:${DATA.email}`}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'hidden sm:inline-flex'
              )}
            >
              <ContactIcon className="h-4 w-4" />
              <span className="sr-only">Contact</span>
            </Link>

            {/* Theme Toggle */}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
