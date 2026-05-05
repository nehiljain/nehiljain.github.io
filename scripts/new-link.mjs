#!/usr/bin/env node
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { parseOgTags } from './new-link-parse.mjs';

const url = process.argv[2];
if (!url) {
  console.error('Usage: pnpm new-link <url>');
  process.exit(1);
}

try {
  new URL(url);
} catch {
  console.error(`Not a valid URL: ${url}`);
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

let html = '';
try {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/123.0 Safari/537.36'
    },
    redirect: 'follow'
  });
  if (res.ok) html = await res.text();
} catch (err) {
  console.warn(`Fetch failed (${err.message}); creating with empty defaults.`);
}

const og = parseOgTags(html);
const title = og.title || 'Untitled';
const slug = slugify(title) || 'untitled';
const date = todayISO();

const dir = 'content/links';
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const filePath = join(dir, `${date}-${slug}.mdx`);
if (existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

const yamlEscape = (s) => s.replace(/'/g, "''");
const fm = [
  '---',
  `title: '${yamlEscape(title)}'`,
  `url: '${url}'`,
  `date: ${date}`,
  og.author ? `author: '${yamlEscape(og.author)}'` : 'author:',
  'via:',
  'tags: []',
  og.description
    ? `description: '${yamlEscape(og.description)}'`
    : 'description:',
  'published: true',
  '---',
  '',
  ''
].join('\n');

writeFileSync(filePath, fm, 'utf8');
console.log(`Created ${filePath}`);

const editor = process.env.EDITOR || process.env.VISUAL;
if (editor) {
  const child = spawn(editor, [filePath], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code ?? 0));
} else {
  console.log('$EDITOR not set; open the file manually.');
}
