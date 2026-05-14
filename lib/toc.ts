import GithubSlugger from 'github-slugger';

export type TocItem = { depth: number; text: string; id: string };

export function extractToc(mdx: string): TocItem[] {
  const slugger = new GithubSlugger();
  const lines = mdx.split('\n');
  const items: TocItem[] = [];
  for (const line of lines) {
    const m = line.match(/^(##+)\s+(.+)$/);
    if (!m) continue;
    const depth = m[1].length;
    if (depth > 3) continue;
    const text = m[2].replace(/[#*`]/g, '').trim();
    items.push({ depth, text, id: slugger.slug(text) });
  }
  return items;
}
