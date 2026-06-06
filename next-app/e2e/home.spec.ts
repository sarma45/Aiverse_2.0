import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AIVerse Omega/);
});

test('login link works', async ({ page }) => {
  await page.goto('/');

  // Click the login link.
  await page.getByRole('link', { name: 'Nexus Login' }).click();

  // Expects the URL to contain login.
  await expect(page).toHaveURL(/.*login/);
});
