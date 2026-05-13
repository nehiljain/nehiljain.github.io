import Link from 'next/link';
import { NJMark } from '@/components/brand/nj-mark';
import { Icon } from '@/components/brand/icon';
import { DATA } from '@/data/resume';

const socials = [
  { key: 'GitHub', url: DATA.contact.social.GitHub.url, I: Icon.Github },
  { key: 'LinkedIn', url: DATA.contact.social.LinkedIn.url, I: Icon.LinkedIn },
  { key: 'Twitter', url: DATA.contact.social.Twitter.url, I: Icon.Twitter },
  { key: 'Mail', url: `mailto:${DATA.email}`, I: Icon.Mail }
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-dashed border-rule px-8 py-8">
      <div className="mx-auto flex max-w-nav flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <NJMark size={28} />
          <div>
            <div className="text-[13.5px] font-semibold text-foreground">
              {DATA.name}
            </div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              SF · AI INFRASTRUCTURE · {year}
            </div>
          </div>
        </div>
        <div className="flex gap-3.5">
          {socials.map((s) => (
            <Link
              key={s.key}
              href={s.url}
              target={s.url.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={s.key}
              className="text-muted-foreground hover:text-foreground"
            >
              <s.I size={18} fill="hsl(var(--accent))" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
