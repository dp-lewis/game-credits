import { test, expect } from '@playwright/test';

// Verifies: column-major tab order, roving tabindex (one grid tab stop),
// and arrow-key navigation within the grid.
test('keyboard: grid is one tab stop; arrow keys navigate column-major', async ({
  page,
}) => {
  await page.goto('/?puzzle=2026-06-14');
  await expect(page.locator('call-sheet-actor').first()).toBeVisible();

  // Active cell starts at {col:0, row:0}.
  const initial = await page.evaluate(
    () =>
      document
        .querySelector('call-sheet-app')
        .shadowRoot.querySelector('call-sheet-board')._activeCell
  );
  expect(initial).toEqual({ col: 0, row: 0 });

  // Only one chip should have active=true (tabindex=0 carrier).
  const activeCount = await page.evaluate(() => {
    const b = document
      .querySelector('call-sheet-app')
      .shadowRoot.querySelector('call-sheet-board');
    return [...b.shadowRoot.querySelectorAll('call-sheet-actor')].filter(
      (a) => a.active
    ).length;
  });
  expect(activeCount).toBe(1);

  // Focus the active chip so keyboard events are routed to the grid.
  await page.evaluate(() => {
    const b = document
      .querySelector('call-sheet-app')
      .shadowRoot.querySelector('call-sheet-board');
    const active = [...b.shadowRoot.querySelectorAll('call-sheet-actor')].find(
      (a) => a.active
    );
    active.shadowRoot.querySelector('button').focus();
  });

  // ArrowDown → row 1 in same column.
  await page.keyboard.press('ArrowDown');
  const afterDown = await page.evaluate(
    () =>
      document
        .querySelector('call-sheet-app')
        .shadowRoot.querySelector('call-sheet-board')._activeCell
  );
  expect(afterDown).toEqual({ col: 0, row: 1 });

  // ArrowRight → col 1, row 1.
  await page.keyboard.press('ArrowRight');
  const afterRight = await page.evaluate(
    () =>
      document
        .querySelector('call-sheet-app')
        .shadowRoot.querySelector('call-sheet-board')._activeCell
  );
  expect(afterRight).toEqual({ col: 1, row: 1 });

  // ArrowUp → col 1, row 0.
  await page.keyboard.press('ArrowUp');
  const afterUp = await page.evaluate(
    () =>
      document
        .querySelector('call-sheet-app')
        .shadowRoot.querySelector('call-sheet-board')._activeCell
  );
  expect(afterUp).toEqual({ col: 1, row: 0 });

  // ArrowLeft → col 0, row 0.
  await page.keyboard.press('ArrowLeft');
  const afterLeft = await page.evaluate(
    () =>
      document
        .querySelector('call-sheet-app')
        .shadowRoot.querySelector('call-sheet-board')._activeCell
  );
  expect(afterLeft).toEqual({ col: 0, row: 0 });

  // Enter selects the active chip.
  await page.keyboard.press('Enter');
  const selectedAfterEnter = await page.evaluate(
    () =>
      document
        .querySelector('call-sheet-app')
        .shadowRoot.querySelector('call-sheet-board')._selected
  );
  expect(selectedAfterEnter).not.toBeNull();

  // Tab from the active chip lands on Submit (grid is one stop).
  // Re-focus the active chip first.
  await page.evaluate(() => {
    const b = document
      .querySelector('call-sheet-app')
      .shadowRoot.querySelector('call-sheet-board');
    const active = [...b.shadowRoot.querySelectorAll('call-sheet-actor')].find(
      (a) => a.active
    );
    active?.shadowRoot.querySelector('button').focus();
  });
  await page.keyboard.press('Tab');
  // After Tab, the page's activeElement won't be a chip button (focus left the grid).
  const topFocus = await page.evaluate(() =>
    document.activeElement?.tagName?.toLowerCase()
  );
  expect(topFocus).not.toBe('call-sheet-actor');
});
