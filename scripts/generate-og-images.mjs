#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Imported lazily inside generate() so the ESM loader (tsx) is fully
// registered before resolving the TS module. Static imports of `.ts` from
// a `.mjs` entry can race the loader on Node 22+.
let _renderOgPng;
async function getRenderOgPng() {
  if (!_renderOgPng) {
    const mod = await import('../lib/og-render.ts');
    _renderOgPng = mod.renderOgPng;
  }
  return _renderOgPng;
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VELITE_OUT = path.join(ROOT, '.velite', 'posts.json');
const OG_DIR = path.join(ROOT, 'public', 'og');
const MANIFEST_PATH = path.join(OG_DIR, '.manifest.json');
const METADATA_PATH = path.join(ROOT, 'config', 'metadata.ts');
const GITHUB_URL = 'https://github.com/nehiljain';


async function readSiteUrl() {
  // config/metadata.ts is TS; we extract the siteUrl literal with a regex
  // rather than transpiling the file. This is robust as long as the field
  // stays a simple string literal.
  const src = await fs.readFile(METADATA_PATH, 'utf8');
  const match = src.match(/siteUrl\s*:\s*['"]([^'"]+)['"]/);
  if (!match) {
    throw new Error(`Could not find siteUrl in ${METADATA_PATH}`);
  }
  return match[1];
}

async function readManifest(manifestPath = MANIFEST_PATH) {
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

function hashPost(post) {
  return crypto
    .createHash('sha256')
    .update(`${post.title}|${post.slugAsParams}`)
    .digest('hex')
    .slice(0, 16);
}

export async function generate({
  veliteOut = VELITE_OUT,
  ogDir = OG_DIR,
  manifestPath = MANIFEST_PATH,
  siteUrlOverride
} = {}) {
  const siteUrl = siteUrlOverride ?? (await readSiteUrl());
  const renderOgPng = await getRenderOgPng();
  const postsRaw = await fs.readFile(veliteOut, 'utf8');
  // Only render OG images for posts that will actually be exported.
  // Unpublished posts are filtered out by generateStaticParams in
  // app/writing/[...slug]/page.tsx, so their PNGs would be orphaned.
  const posts = JSON.parse(postsRaw).filter(
    (p) => p.published === undefined || p.published
  );
  await fs.mkdir(ogDir, { recursive: true });
  const manifest = await readManifest(manifestPath);
  const newManifest = {};
  let written = 0;
  let skipped = 0;

  for (const post of posts) {
    const hash = hashPost(post);
    newManifest[post.slugAsParams] = hash;
    const outPath = path.join(ogDir, `${post.slugAsParams}.png`);
    let exists = false;
    try {
      await fs.access(outPath);
      exists = true;
    } catch {}
    if (exists && manifest[post.slugAsParams] === hash) {
      skipped += 1;
      continue;
    }
    const png = await renderOgPng({
      title: post.title,
      footerUrl: siteUrl.replace(/^https?:\/\//, ''),
      githubUrl: GITHUB_URL.replace(/^https?:\/\//, '')
    });
    await fs.writeFile(outPath, png);
    written += 1;
  }
  await fs.writeFile(manifestPath, JSON.stringify(newManifest, null, 2));
  return { written, skipped, total: posts.length };
}

const isMain =
  import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (isMain) {
  const result = await generate();
  console.log(
    `[og] wrote ${result.written}, skipped ${result.skipped}, total ${result.total}`
  );
}
