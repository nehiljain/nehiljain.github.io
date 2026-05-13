import { Icon } from '@/components/brand/icon';

type IconComponent = (props: { size?: number; stroke?: string; fill?: string }) => JSX.Element;

type Post = { title: string; body: string; slug: string };

function RailStat({ label, value, I }: { label: string; value: string; I: IconComponent }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
        {label}
      </div>
      <div className="inline-flex items-center gap-2 text-[15px] font-semibold text-foreground">
        <I size={16} fill="hsl(var(--accent))" />
        {value}
      </div>
    </div>
  );
}

export function PostMetaRail({ post }: { post: Post }) {
  const wordCount = post.body.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  const shareUrl = `https://nehiljain.com/${post.slug}`;
  const shares = [
    {
      I: Icon.Twitter,
      label: 'Tweet',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`
    },
    {
      I: Icon.LinkedIn,
      label: 'Share',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      I: Icon.Mail,
      label: 'Email',
      href: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`
    }
  ];

  return (
    <aside className="sticky top-20 flex flex-col gap-[18px] self-start">
      <RailStat label="Reading" value={`${minutes} min`} I={Icon.Clock} />
      <RailStat label="Words" value={wordCount.toLocaleString()} I={Icon.Writing} />
      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
          Share
        </div>
        <div className="flex flex-col gap-1.5">
          {shares.map(({ I, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-start gap-2 rounded-lg border border-rule px-2.5 py-1.5 text-xs font-semibold text-foreground no-underline"
            >
              <I size={14} fill="hsl(var(--accent))" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
