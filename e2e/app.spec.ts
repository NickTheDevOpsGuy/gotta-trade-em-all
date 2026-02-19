import { test, expect } from '@playwright/test';

// Wait for auth + initial load to complete (Supabase anon sign-in + API calls)
async function waitForAppReady(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.getByText('Loading TradeDex…')).toBeHidden({ timeout: 30000 });
}

test.describe('TradeDex', () => {
  test('loads and shows catalog section', async ({ page }) => {
    await waitForAppReady(page);
    await expect(page.getByRole('heading', { name: /TradeDex/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Card Catalog/i })).toBeVisible();
  });

  test('shows collection section', async ({ page }) => {
    await waitForAppReady(page);
    await expect(page.getByRole('heading', { name: /Your Collection/i })).toBeVisible();
  });

  test('has catalog filter and sort controls', async ({ page }) => {
    await waitForAppReady(page);
    const filterSelect = page.locator('select').first();
    await expect(filterSelect).toBeVisible();
  });
});
