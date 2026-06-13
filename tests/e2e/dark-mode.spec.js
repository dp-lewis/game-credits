import { test, expect } from '@playwright/test';

// Regression for the dark-mode contrast bug: group buttons and Submit must not
// render light-on-light (the bug was an un-overridden white --cs-card surface).
test.use({ colorScheme: 'dark' });

const channelSum = (rgb) =>
  rgb
    .match(/\d+/g)
    .slice(0, 3)
    .map(Number)
    .reduce((a, b) => a + b, 0);

test('group buttons and submit are legible in dark mode', async ({ page }) => {
  await page.goto('/?puzzle=2026-06-14');

  const inactiveGroup = page.getByRole('button', { name: 'Group 2' });
  const submit = page.getByRole('button', { name: 'Submit' });
  await expect(inactiveGroup).toBeVisible();
  await expect(submit).toBeVisible();

  // Surfaces must be dark in dark mode (sum of RGB well below the 765 max).
  const groupBg = await inactiveGroup.evaluate(
    (el) => getComputedStyle(el).backgroundColor
  );
  const submitBg = await submit.evaluate(
    (el) => getComputedStyle(el).backgroundColor
  );
  expect(channelSum(groupBg)).toBeLessThan(500);
  expect(channelSum(submitBg)).toBeLessThan(500);
});
