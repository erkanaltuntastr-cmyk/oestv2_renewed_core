import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { resetStorage, uiLogin } from './utils/testUser';

const fillOnboardingForm = async (page: Page) => {
  await page.getByLabel('Display Name').fill('E2E User');
  await page.getByLabel('Age').fill('32');
  await page.getByLabel('Gender').fill('other');
  await page.getByLabel('Weight (kg)').fill('75');
  await page.getByLabel('Experience').fill('intermediate');
};

test.beforeEach(async ({ page }) => {
  await resetStorage(page);
});

test('onboarding form loads after login', async ({ page }) => {
  await uiLogin(page);
  await expect(page).toHaveURL(/onboarding/);
  await expect(page.getByRole('heading', { name: /complete onboarding/i })).toBeVisible();
  await expect(page.getByLabel('Display Name')).toBeVisible();
});

test('user can save onboarding and reach dashboard', async ({ page }) => {
  await uiLogin(page);
  await fillOnboardingForm(page);
  await page.getByRole('button', { name: /save & continue/i }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
