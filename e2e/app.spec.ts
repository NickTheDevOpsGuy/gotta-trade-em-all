import { test, expect } from '@playwright/test';

test.describe('TradeDex', () => {
  test('loads and shows catalog section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /TradeDex/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Card Catalog/i })).toBeVisible();
  });

  test('shows collection section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Your Collection/i })).toBeVisible();
  });

  test('has catalog filter and sort controls', async ({ page }) => {
    await page.goto('/');
    const filterSelect = page.locator('select').first();
    await expect(filterSelect).toBeVisible();
  });
});
