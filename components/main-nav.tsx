'use client';

import { DATA } from '@/data/resume';
import { Icons } from './icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={24}
          height={24}
          className="h-6 w-6 rounded-full"
        />
        <span className="font-bold">{DATA.name}</span>
      </Link>
      {DATA.navbar
        .filter((item) => item.href !== '/') // Exclude home since it's already shown with logo
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary hidden sm:inline-block',
              pathname === item.href ? 'text-foreground' : 'text-foreground/60'
            )}
          >
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
