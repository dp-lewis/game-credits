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
