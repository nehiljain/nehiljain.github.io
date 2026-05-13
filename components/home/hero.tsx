import Link from 'next/link';
import { ProfilePortrait } from '@/components/brand/profile-portrait';
import { DoodleArrow } from '@/components/brand/doodle-arrow';
import { SolidBtn, OutlineBtn } from '@/components/brand/buttons';
import { Icon } from '@/components/brand/icon';
import { DATA } from '@/data/resume';

export function HomeHero() {
  return (
    <section className="mb-16 grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1 font-mono text-[11px] uppercase tracking-[0.13em] text-muted-foreground">
          <span className="inline-block h-[7px] w-[7px] rounded-full bg-[hsl(var(--accent))]" />
          Now: {DATA.org} · {DATA.title}
        </div>
        <h1 className="m-0 font-heading text-6xl font-semibold leading-[1.02] tracking-tight text-foreground lg:text-[80px]">
          Hello, I&rsquo;m{' '}
          <span className="font-display text-accent leading-[0.9] tracking-tighter">
            Nehil
          </span>
          .
        </h1>
        <p className="mt-4 max-w-[560px] text-xl leading-snug text-muted-foreground lg:text-[22px]">
          {DATA.description}
        </p>
        <div className="mt-7 flex gap-3">
          <Link href="/writing" className="no-underline">
            <SolidBtn>
              Read the writing <Icon.ArrowRight size={16} />
            </SolidBtn>
          </Link>
          <Link href={`mailto:${DATA.email}`} className="no-underline">
            <OutlineBtn>Say hello</OutlineBtn>
          </Link>
        </div>
      </div>
      <div className="relative grid place-items-center">
        <ProfilePortrait
          size={300}
          src={DATA.avatarUrl}
          label="SF · 2026"
          sub="ai infra"
        />
        <DoodleArrow
          color="hsl(var(--accent))"
          width={90}
          height={50}
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            transform: 'rotate(15deg)'
          }}
        />
      </div>
    </section>
  );
}
