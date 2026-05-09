import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/writing', '/projects', '/cv', '/tags'];

for (const route of ROUTES) {
  test(`route ${route} loads with no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
    });
    const resp = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(resp?.status(), `status for ${route}`).toBe(200);
    // Some routes use h1, others use h2 (e.g. /writing). Accept either.
    await expect(page.locator('h1, h2').first()).toBeVisible();
    expect(errors, `console/page errors for ${route}`).toEqual([]);
  });
}

test('a writing post page loads', async ({ page }) => {
  await page.goto('/writing');
  const firstPostLink = page.locator('a[href^="/writing/"]').first();
  const href = await firstPostLink.getAttribute('href');
  expect(href).toBeTruthy();
  const resp = await page.goto(href!);
  expect(resp?.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
});
