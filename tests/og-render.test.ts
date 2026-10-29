import { describe, it, expect } from 'vitest';
import { ogCardVdom, renderOgPng } from '@/lib/og-render';

// All text in a satori VDOM, in order.
function textOf(node: unknown): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return textOf((node as { props: { children?: unknown } }).props.children);
  }
  return '';
}

describe('ogCardVdom', () => {
  it('renders quotes, ampersands and angle brackets as written', () => {
    const title = `Hormozi's "notes" & <tags> &amp;`;
    const text = textOf(
      ogCardVdom({
        title,
        footerUrl: 'nehiljain.dev',
        githubUrl: 'github.com/nehiljain'
      })
    );
    expect(text).toContain(title);
    expect(text).not.toContain('&#x27;');
  });
});

describe('renderOgPng', () => {
  it('returns a non-empty PNG buffer with correct magic bytes', async () => {
    const buf = await renderOgPng({
      title: 'Hello World',
      footerUrl: 'https://nehiljain.com',
      githubUrl: 'https://github.com/nehiljain'
    });
    expect(buf.length).toBeGreaterThan(1000);
    // PNG magic: 89 50 4E 47 0D 0A 1A 0A
    expect(buf[0]).toBe(0x89);
    expect(buf[1]).toBe(0x50);
    expect(buf[2]).toBe(0x4e);
    expect(buf[3]).toBe(0x47);
  });

  it('produces output with 1200x630 dimensions', async () => {
    const buf = await renderOgPng({
      title: 'Dim test',
      footerUrl: 'https://nehiljain.com',
      githubUrl: 'https://github.com/nehiljain'
    });
    // PNG IHDR: width is bytes 16-19, height is 20-23 (big-endian uint32)
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });
});
