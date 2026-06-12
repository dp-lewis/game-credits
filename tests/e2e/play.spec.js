import { test, expect } from '@playwright/test';

// Correct groups for the 3-film puzzle (public/puzzles/2026-06-14.json).
const GROUPS = [
  ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Tom Hardy', 'Elliot Page'],
  ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Cillian Murphy'],
  ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
];

test('play the 3-film puzzle through to a win', async ({ page }) => {
  // Force the 3-film puzzle so the test is independent of the run date.
  await page.goto('/?puzzle=2026-06-14');

  // Board renders the group buckets once the puzzle loads.
  await expect(page.getByRole('button', { name: 'Group 1' })).toBeVisible();

  // Drop each correct group into a bucket (brush: pick bucket, tap its actors).
  for (let i = 0; i < GROUPS.length; i++) {
    await page.getByRole('button', { name: `Group ${i + 1}` }).click();
    for (const name of GROUPS[i]) {
      await page.getByRole('button', { name, exact: true }).click();
    }
  }

  await page.getByRole('button', { name: 'Submit' }).click();

  // Result view with a spoiler-free share grid, confirming a clean win.
  await expect(page.getByRole('button', { name: 'Copy result' })).toBeVisible();
  await expect(page.getByText('Call Sheet 2026-06-14')).toBeVisible();
  await expect(page.getByText(/Solved 3\/3 with 0 mistakes/)).toBeVisible();

  // Reload: the finished puzzle is restored (localStorage), not replayable.
  await page.reload();
  await expect(page.getByText(/already played/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy result' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Group 1' })).toHaveCount(0);
});
