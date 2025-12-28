import { test, expect } from '@playwright/test';
import { resetStorage, seedAuthenticatedUser } from './utils/testUser';

test.beforeEach(async ({ page }) => {
  await resetStorage(page);
});

test('unauthenticated users are redirected to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/login/);
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
});

test('onboarding guard redirects incomplete users', async ({ page }) => {
  await seedAuthenticatedUser(page, { onboardingCompleted: false });
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/onboarding/);
  await expect(page.getByRole('heading', { name: /complete onboarding/i })).toBeVisible();
});

test('authenticated users reach dashboard and plan screens', async ({ page }) => {
  await seedAuthenticatedUser(page);
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

  await page.goto('/plan');
  await expect(page.getByRole('heading', { name: /weekly plan/i })).toBeVisible();
});

test('unknown routes fallback to login or dashboard', async ({ page }) => {
  await page.goto('/unknown');
  await expect(page).toHaveURL(/login/);

  await seedAuthenticatedUser(page);
  await page.goto('/does-not-exist');
  await expect(page).toHaveURL(/dashboard/);
});
