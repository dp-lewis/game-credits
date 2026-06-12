import { test, expect } from '@playwright/test';

// Smoke: the app boots and renders its title. Playwright locators pierce the
// open shadow DOM of the Lit component by default.
test('home page renders the Call Sheet title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Call Sheet' })).toBeVisible();
});
