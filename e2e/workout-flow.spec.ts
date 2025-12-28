import { test, expect } from '@playwright/test';
import { resetStorage, seedAuthenticatedUser } from './utils/testUser';

test.beforeEach(async ({ page }) => {
  await resetStorage(page);
});

test('user can add, update, and complete a workout session', async ({ page }) => {
  await seedAuthenticatedUser(page);
  await page.goto('/workout');
  await expect(page.getByRole('heading', { name: /today’s workout/i })).toBeVisible();

  const addButton = page.getByRole('button', { name: /add to session/i }).first();
  await addButton.click();

  await page.goto('/session');
  await expect(page.getByText(/current session/i)).toBeVisible();
  const setsInput = page.getByLabel('Sets').first();
  await setsInput.fill('4');
  await page.getByLabel('Reps').first().fill('12');
  await page.getByLabel('Weight').first().fill('20');

  await page.getByRole('button', { name: /complete workout/i }).click();
  await expect(page.getByText(/no movements in session yet/i)).toBeVisible();
});
