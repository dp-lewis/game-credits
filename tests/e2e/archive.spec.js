import { test, expect } from '@playwright/test';

test('archive index lists puzzles and links back to the game (native back button)', async ({
  page,
}) => {
  await page.goto('/');

  // Reach the archive via a real link from the game.
  await page.getByRole('link', { name: /Archive/i }).click();
  await expect(page).toHaveURL(/archive\.html/);

  // At least today's puzzle is listed.
  const rows = page.locator('call-sheet-archive a.row');
  await expect(rows.first()).toBeVisible();

  // Following a row navigates to the game page...
  await rows.first().click();
  await expect(page).toHaveURL(/index\.html/);
  await expect(page.getByText('Movie 1', { exact: true })).toBeVisible();

  // ...and the browser back button returns to the archive (native, no SPA router).
  await page.goBack();
  await expect(page).toHaveURL(/archive\.html/);
  await expect(page.locator('call-sheet-archive a.row').first()).toBeVisible();
});

test('a ?puzzle replay is a fresh, practice board', async ({ page }) => {
  await page.goto('/index.html?puzzle=2026-06-15');
  await expect(page.getByText(/Practice mode/i)).toBeVisible();
  await expect(page.getByText('Movie 1', { exact: true })).toBeVisible();
});

test('a future-dated puzzle is not playable', async ({ page }) => {
  // Far-future date: the guard fires on id > today before any fetch, so this
  // stays valid regardless of the run date.
  await page.goto('/index.html?puzzle=2099-01-01');
  await expect(page.getByText(/isn't available yet/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Check Answer' })).toHaveCount(
    0
  );
  await expect(page.locator('call-sheet-board')).toHaveCount(0);
});

test('archive rows show a theme label', async ({ page }) => {
  await page.goto('/archive.html');

  // At least the first row should have a theme element.
  const firstTheme = page.locator('call-sheet-archive .row .theme').first();
  await expect(firstTheme).toBeVisible();
  // Theme text should be a non-empty string (any director/era label will do).
  const themeText = await firstTheme.textContent();
  expect(themeText?.trim().length).toBeGreaterThan(0);
});

test('tomorrow locked teaser is shown on the archive page', async ({
  page,
}) => {
  await page.goto('/archive.html');

  // The locked teaser should exist as a non-link .preview div.
  const teaser = page.locator('call-sheet-archive .preview');
  await expect(teaser).toBeVisible();

  // It must NOT be an <a> (not playable).
  const teaserTag = await teaser.evaluate((el) => el.tagName.toLowerCase());
  expect(teaserTag).not.toBe('a');

  // The lock icon should be present.
  await expect(teaser.getByText('🔒')).toBeVisible();
});
