import { DATA } from '@/data/resume';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const ICON_MAP = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter
} as const;

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {DATA.social.map((social) => {
        const Icon = ICON_MAP[social.platform as keyof typeof ICON_MAP];
        return (
          <Link
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{social.platform}</span>
          </Link>
        );
      })}
    </div>
  );
}
