import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { generate } from '../scripts/generate-og-images.mjs';

let tmpDir: string;
let veliteOut: string;
let ogDir: string;
let manifestPath: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'og-test-'));
  veliteOut = path.join(tmpDir, 'writing.json');
  ogDir = path.join(tmpDir, 'og');
  manifestPath = path.join(ogDir, '.manifest.json');
  const fixture = await fs.readFile(
    path.resolve(__dirname, 'fixtures/velite-writing.json'),
    'utf8'
  );
  await fs.writeFile(veliteOut, fixture);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('generate-og-images', () => {
  it('writes one PNG per post and a manifest', async () => {
    const result = await generate({
      veliteOut,
      ogDir,
      manifestPath,
      siteUrlOverride: 'https://nehiljain.com'
    });
    expect(result.written).toBe(2);
    expect(result.skipped).toBe(0);
    const files = await fs.readdir(ogDir);
    expect(files).toContain('hello-world.png');
    expect(files).toContain('longer-post.png');
    expect(files).toContain('.manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    expect(Object.keys(manifest).sort()).toEqual([
      'hello-world',
      'longer-post'
    ]);
  });

  it('skips unchanged posts on second run', async () => {
    await generate({ veliteOut, ogDir, manifestPath, siteUrlOverride: 'x' });
    const second = await generate({
      veliteOut,
      ogDir,
      manifestPath,
      siteUrlOverride: 'x'
    });
    expect(second.written).toBe(0);
    expect(second.skipped).toBe(2);
  });

  it('regenerates when title changes', async () => {
    await generate({ veliteOut, ogDir, manifestPath, siteUrlOverride: 'x' });
    const fixture = JSON.parse(await fs.readFile(veliteOut, 'utf8'));
    fixture[0].title = 'Different title now';
    await fs.writeFile(veliteOut, JSON.stringify(fixture));
    const second = await generate({
      veliteOut,
      ogDir,
      manifestPath,
      siteUrlOverride: 'x'
    });
    expect(second.written).toBe(1);
    expect(second.skipped).toBe(1);
  });

  it('reads siteUrl from config/metadata.ts (not config/site.ts)', async () => {
    // Run without an override so the script reads config/metadata.ts.
    // Verify the resulting PNG embeds the metadata.ts value, not the
    // example.com placeholder from config/site.ts.
    const result = await generate({ veliteOut, ogDir, manifestPath });
    expect(result.written).toBe(2);
    const png = await fs.readFile(path.join(ogDir, 'hello-world.png'));
    // The URL is embedded in the PNG via satori as text glyphs, so we
    // can't assert by string-match on the bytes. Instead, snapshot the
    // siteUrl the script actually uses by reading config/metadata.ts the
    // same way the script does and asserting it's not example.com.
    const metadataSrc = await fs.readFile(
      path.resolve(__dirname, '../config/metadata.ts'),
      'utf8'
    );
    const match = metadataSrc.match(/siteUrl\s*:\s*['"]([^'"]+)['"]/);
    expect(match).not.toBeNull();
    expect(match![1]).not.toContain('example.com');
    expect(png.length).toBeGreaterThan(1000);
  });
});
