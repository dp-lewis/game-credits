import { test, expect } from '@playwright/test';

// Correct groups for the 3-film puzzle (public/puzzles/2026-06-14.json), by name.
const GROUPS = [
  ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Tom Hardy', 'Elliot Page'],
  ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Cillian Murphy'],
  ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
];

const targetCol = {};
GROUPS.forEach((group, c) => group.forEach((name) => (targetCol[name] = c)));

// Read the live column arrangement (names) from the rendered chips. Each
// `call-sheet-actor` exposes its actor and its column via `bucketIndex`.
async function readColumns(page) {
  const placed = await page
    .locator('call-sheet-actor')
    .evaluateAll((nodes) =>
      nodes.map((n) => ({ name: n.actor.name, col: n.bucketIndex }))
    );
  const cols = [];
  for (const { name, col } of placed) {
    (cols[col] ||= []).push(name);
  }
  return cols;
}

const tapActor = (page, name) =>
  page.getByRole('button', { name, exact: true }).click();

test('play the 3-film puzzle through to a win via select-then-swap', async ({
  page,
}) => {
  // Force a specific puzzle so the test is independent of the run date.
  // `?puzzle=` is a practice replay (fresh board, no streak effect).
  await page.goto('/?puzzle=2026-06-14');

  await expect(page.getByText(/Practice mode/i)).toBeVisible();

  // Column board: three labelled group columns and the full cast (12 chips).
  await expect(page.getByText('Movie 1', { exact: true })).toBeVisible();
  await expect(page.locator('call-sheet-actor')).toHaveCount(12);

  // Sort each actor into its correct column by swapping (select, then swap).
  // For each column, swap in any missing member by trading with a wrong occupant.
  for (let c = 0; c < GROUPS.length; c++) {
    for (const member of GROUPS[c]) {
      const cols = await readColumns(page);
      if (cols[c].includes(member)) continue;
      const wrongOccupant = cols[c].find((name) => targetCol[name] !== c);
      await tapActor(page, member); // select
      await tapActor(page, wrongOccupant); // swap into column c
    }
  }

  await page.getByRole('button', { name: 'Submit' }).click();

  // Result view with a spoiler-free share grid, confirming a clean win.
  await expect(page.getByRole('button', { name: 'Copy result' })).toBeVisible();
  await expect(page.getByText('Call Sheet 2026-06-14')).toBeVisible();
  await expect(page.getByText(/Solved 3\/3 with 0 mistakes/)).toBeVisible();

  // A `?puzzle=` replay starts a fresh board on reload (it is not restored).
  await page.reload();
  await expect(page.getByText('Movie 1', { exact: true })).toBeVisible();
  await expect(page.getByText(/already played/i)).toHaveCount(0);
});
