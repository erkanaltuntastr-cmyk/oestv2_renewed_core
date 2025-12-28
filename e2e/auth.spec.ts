import { test, expect } from '@playwright/test';
import { resetStorage, uiLogin, completeOnboarding } from './utils/testUser';

test.beforeEach(async ({ page }) => {
  await resetStorage(page);
});

test('login screen loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});

test('invalid login shows error', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('wrong');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByText(/invalid credentials/i)).toBeVisible();
});

test('valid login redirects to onboarding', async ({ page }) => {
  await uiLogin(page);
  await expect(page).toHaveURL(/onboarding/);
  await expect(page.getByRole('heading', { name: /complete onboarding/i })).toBeVisible();
});

test('session persists after refresh', async ({ page }) => {
  await uiLogin(page);
  await completeOnboarding(page);
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
