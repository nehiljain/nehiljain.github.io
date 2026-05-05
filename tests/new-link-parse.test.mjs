import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseOgTags } from '../scripts/new-link-parse.mjs';

const html = `
<html>
  <head>
    <title>Plain Title</title>
    <meta property="og:title" content="OG Title">
    <meta property="og:description" content="OG description text.">
    <meta property="og:site_name" content="Example Site">
    <meta name="author" content="Jane Author">
  </head>
</html>
`;

test('parseOgTags prefers og:title over <title>', () => {
  assert.equal(parseOgTags(html).title, 'OG Title');
});

test('parseOgTags returns description, author, siteName', () => {
  const r = parseOgTags(html);
  assert.equal(r.description, 'OG description text.');
  assert.equal(r.author, 'Jane Author');
  assert.equal(r.siteName, 'Example Site');
});

test('parseOgTags falls back to <title> when og:title is absent', () => {
  const r = parseOgTags('<html><head><title>Fallback</title></head></html>');
  assert.equal(r.title, 'Fallback');
});

test('parseOgTags returns empty object on empty input', () => {
  const r = parseOgTags('');
  assert.equal(r.title, undefined);
  assert.equal(r.description, undefined);
});

test('parseOgTags decodes basic HTML entities in attribute values', () => {
  const r = parseOgTags('<meta property="og:title" content="A &amp; B">');
  assert.equal(r.title, 'A & B');
});
