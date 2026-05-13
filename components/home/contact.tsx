import Link from 'next/link';
import { NJMark } from '@/components/brand/nj-mark';
import { SolidBtn, OutlineBtn } from '@/components/brand/buttons';
import { DATA } from '@/data/resume';

export function HomeContact() {
  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl border border-dashed border-accent bg-card p-8">
      <div className="pointer-events-none absolute -bottom-16 -right-10 rotate-[-8deg] opacity-[0.18]">
        <NJMark size={220} />
      </div>
      <div className="relative max-w-[620px]">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
          03 · GET IN TOUCH
        </div>
        <h2 className="mt-2 font-heading text-[44px] font-semibold leading-tight tracking-tight text-foreground">
          Always down to geek out about distributed systems.
        </h2>
        <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">
          Collaborations, hard infra questions, hackathon team-ups, or just a
          friendly hello.
        </p>
        <div className="mt-5 flex gap-3">
          <Link href={`mailto:${DATA.email}`} className="no-underline">
            <SolidBtn>{DATA.email}</SolidBtn>
          </Link>
          <Link
            href={DATA.contact.social.LinkedIn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <OutlineBtn>Book a call</OutlineBtn>
          </Link>
        </div>
      </div>
    </section>
  );
}
