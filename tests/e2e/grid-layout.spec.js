import { test, expect } from '@playwright/test';

// Regression for the grid-wrap bug: on desktop, long names that wrap to two
// lines must not make the grid ragged — every actor chip stays the same height.
test('actor chips are equal height even when names wrap (desktop)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/?puzzle=2026-06-14'); // has long names (e.g. Joseph Gordon-Levitt)

  const chips = page.locator('call-sheet-actor');
  await expect(chips.first()).toBeVisible();

  const count = await chips.count();
  const heights = [];
  for (let i = 0; i < count; i++) {
    const box = await chips.nth(i).boundingBox();
    heights.push(Math.round(box.height));
  }

  const min = Math.min(...heights);
  const max = Math.max(...heights);
  expect(count).toBe(12);
  expect(max - min).toBeLessThanOrEqual(1); // all chips equal height
});
