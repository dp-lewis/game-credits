import { test, expect } from '@playwright/test';

// The curator preview page lists every scheduled date (future included) and reveals
// a selected puzzle with its films, cast, and traps.
test('preview gallery reveals a puzzle with its traps', async ({ page }) => {
  await page.goto('/preview.html');

  await expect(page.getByText(/Curator preview/i)).toBeVisible();

  // The list includes a far-future date the play app would block (Sep 2026).
  const future = page.getByRole('button', { name: /Sep 14, 2026/i });
  await expect(future).toBeVisible();
  await future.click();

  // Reveals the board (solved) plus the curator detail.
  await expect(page.locator('call-sheet-board')).toBeVisible();
  await expect(page.getByText(/Films & cast/i)).toBeVisible();
  await expect(page.getByText(/Traps/i)).toBeVisible();
});
