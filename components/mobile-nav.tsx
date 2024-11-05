'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { Mail, Menu } from 'lucide-react';
import { DATA } from '@/data/resume';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="sm:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:hidden">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={24}
                height={24}
                className="h-6 w-6 rounded-full"
              />
              <span className="font-bold">{DATA.name}</span>
            </Link>
            <nav className="mt-4 flex flex-col space-y-3">
              {DATA.navbar.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t py-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(DATA.contact.social).map(([name, social]) => (
                <Link
                  key={name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                >
                  <social.icon className="h-4 w-4 mr-2" />
                  {social.label}
                </Link>
              ))}
              <Link
                href={`mailto:${DATA.email}`}
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
