export function WritingHero() {
  return (
    <section className="border-b border-dashed border-rule pb-7">
      <h1 className="m-0 font-heading text-6xl font-semibold leading-[1.0] tracking-tight text-foreground lg:text-[84px]">
        Notes from the field<span className="text-accent">.</span>
      </h1>
      <p className="mt-3.5 max-w-[640px] text-[19px] leading-snug text-muted-foreground">
        Experiments, TILs, retros, and sketchnotes on AI infra, data
        engineering, and the unglamorous bits of making AI reliable in
        production.
      </p>
    </section>
  );
}
