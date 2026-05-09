import { test, expect } from '@playwright/test';

test('an OG image is served as 1200x630 PNG', async ({ page, request }) => {
  // Find a post link from /writing
  await page.goto('/writing');
  const href = await page
    .locator('a[href^="/writing/"]')
    .first()
    .getAttribute('href');
  expect(href).toBeTruthy();
  const slug = href!.replace(/^\/writing\//, '').replace(/\/$/, '');
  const ogPath = `/og/${slug}.png`;

  const resp = await request.get(ogPath);
  expect(resp.status()).toBe(200);
  expect(resp.headers()['content-type']).toContain('image/png');
  const buf = Buffer.from(await resp.body());
  expect(buf.length).toBeGreaterThan(1000);
  // PNG IHDR
  expect(buf.readUInt32BE(16)).toBe(1200);
  expect(buf.readUInt32BE(20)).toBe(630);
});

test('post page references its OG image', async ({ page }) => {
  await page.goto('/writing');
  const href = await page
    .locator('a[href^="/writing/"]')
    .first()
    .getAttribute('href');
  await page.goto(href!);
  const ogContent = await page
    .locator('meta[property="og:image"]')
    .getAttribute('content');
  expect(ogContent).toMatch(/\/og\/.+\.png$/);
});
