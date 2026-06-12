import { test, expect } from '@playwright/test';

// The correct film for each actor in the default puzzle (public/puzzles/2026-06-12.json).
const ANSWERS = {
  'George Clooney': "Ocean's Eleven",
  'Brad Pitt': "Ocean's Eleven",
  'Matt Damon': "Ocean's Eleven",
  'Julia Roberts': "Ocean's Eleven",
  'Meryl Streep': 'The Devil Wears Prada',
  'Anne Hathaway': 'The Devil Wears Prada',
  'Emily Blunt': 'The Devil Wears Prada',
  'Stanley Tucci': 'The Devil Wears Prada',
};

test('play the daily puzzle through to a win', async ({ page }) => {
  await page.goto('/');

  // Board renders after the puzzle loads.
  await expect(
    page.getByRole('group', { name: 'George Clooney' })
  ).toBeVisible();

  // Assign every actor to their correct film.
  for (const [actor, film] of Object.entries(ANSWERS)) {
    await page
      .getByRole('group', { name: actor })
      .getByRole('button', { name: film, exact: true })
      .click();
  }

  await page.getByRole('button', { name: 'Submit' }).click();

  // The result view with a copyable, spoiler-free share grid appears,
  // confirming a clean win (zero mistakes).
  await expect(page.getByRole('button', { name: 'Copy result' })).toBeVisible();
  await expect(page.getByText('Call Sheet 2026-06-12')).toBeVisible();
  await expect(page.getByText(/Solved with 0 mistakes/)).toBeVisible();
});
