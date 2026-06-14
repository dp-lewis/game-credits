import { test, expect } from '@playwright/test';

// Dark-mode legibility: the pastel tiles keep dark text on a light pastel surface
// in dark mode (they don't flip), and Submit stays a dark surface with light text.
test.use({ colorScheme: 'dark' });

const channelSum = (rgb) =>
  rgb
    .match(/\d+/g)
    .slice(0, 3)
    .map(Number)
    .reduce((a, b) => a + b, 0);

test('movie headers keep dark text on pastel, and submit stays legible, in dark mode', async ({
  page,
}) => {
  await page.goto('/?puzzle=2026-06-14');

  const header = page.locator('.head').filter({ hasText: 'Movie 2' });
  const submit = page.getByRole('button', { name: 'Submit' });
  await expect(header).toBeVisible();
  await expect(submit).toBeVisible();

  // The header tile is a light pastel with dark text — even in dark mode.
  const headerBg = await header.evaluate(
    (el) => getComputedStyle(el).backgroundColor
  );
  const headerText = await header.evaluate((el) => getComputedStyle(el).color);
  expect(channelSum(headerBg)).toBeGreaterThan(600); // light pastel surface
  expect(channelSum(headerText)).toBeLessThan(200); // dark text

  // Submit stays a dark surface (light-on-dark), as before.
  const submitBg = await submit.evaluate(
    (el) => getComputedStyle(el).backgroundColor
  );
  expect(channelSum(submitBg)).toBeLessThan(500);
});
