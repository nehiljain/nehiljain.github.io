import { DATA } from '@/data/resume';

import Link from 'next/link';

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {Object.entries(DATA.contact.social).map(([platform, data]) => {
        const Icon = data.icon;
        return (
          <Link
            key={platform}
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{data.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
