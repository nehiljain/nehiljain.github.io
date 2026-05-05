import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractDomain } from '../lib/url.ts';

test('extractDomain strips protocol and www', () => {
  assert.equal(extractDomain('https://www.example.com/foo'), 'example.com');
});

test('extractDomain preserves subdomains other than www', () => {
  assert.equal(extractDomain('https://blog.example.com/x'), 'blog.example.com');
});

test('extractDomain returns empty string for invalid URLs', () => {
  assert.equal(extractDomain('not a url'), '');
});
