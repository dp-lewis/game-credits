import { test, expect } from '@playwright/test';

// Smoke: the app boots and renders. Playwright locators pierce the open shadow
// DOM of the Lit component by default. (The big title was removed in the layout
// tighten; the tagline now leads the page.)
test('home page boots and shows the tagline', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText(/Sort the scrambled cast back into their films/i)
  ).toBeVisible();
});
