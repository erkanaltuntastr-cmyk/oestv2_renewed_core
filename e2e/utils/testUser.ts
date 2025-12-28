import type { Page } from '@playwright/test';
import type { User } from '../../src/types/user';
import type { HistoryEntry } from '../../src/types/history';

const STORAGE_PREFIX = 'oestv2';
const ONE_HOUR_MS = 60 * 60 * 1000;

const baseUser: User = {
  uid: 'e2e-mock',
  email: 'tester@example.com',
  onboardingCompleted: true,
};

export const resetStorage = async (page: Page): Promise<void> => {
  await page.goto('about:blank');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage?.clear();
  });
};

export const seedAuthenticatedUser = async (
  page: Page,
  overrides: Partial<User> = {},
): Promise<User> => {
  const user: User = { ...baseUser, ...overrides };
  const session = { token: 'mock-token', expiresAt: Date.now() + ONE_HOUR_MS };
  await page.goto('about:blank');
  await page.evaluate(
    ({ userData, sessionData, prefix }) => {
      localStorage.setItem(`${prefix}:user`, JSON.stringify(userData));
      localStorage.setItem(`${prefix}:session`, JSON.stringify(sessionData));
    },
    { userData: user, sessionData: session, prefix: STORAGE_PREFIX },
  );
  return user;
};

export const seedHistoryEntries = async (
  page: Page,
  entries: HistoryEntry[],
): Promise<void> => {
  await page.goto('about:blank');
  await page.evaluate(
    ({ data, prefix }) => {
      localStorage.setItem(`${prefix}:history`, JSON.stringify(data));
    },
    { data: entries, prefix: STORAGE_PREFIX },
  );
};

export const uiLogin = async (
  page: Page,
  credentials: { email?: string; password?: string } = {},
): Promise<void> => {
  const email = credentials.email ?? baseUser.email;
  const password = credentials.password ?? 'test';
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /login/i }).click();
};

export const completeOnboarding = async (
  page: Page,
  values: Partial<{ displayName: string; age: string; gender: string; weight: string; experience: string }> = {},
): Promise<void> => {
  await page.waitForURL(/onboarding/);
  await page.getByLabel('Display Name').fill(values.displayName ?? 'Tester');
  await page.getByLabel('Age').fill(values.age ?? '30');
  await page.getByLabel('Gender').fill(values.gender ?? 'other');
  await page.getByLabel('Weight (kg)').fill(values.weight ?? '70');
  await page.getByLabel('Experience').fill(values.experience ?? 'beginner');
  await page.getByRole('button', { name: /save & continue/i }).click();
};

export const seedAuthenticatedWithHistory = async (
  page: Page,
  entries: HistoryEntry[],
  userOverrides: Partial<User> = {},
): Promise<void> => {
  await seedAuthenticatedUser(page, userOverrides);
  await seedHistoryEntries(page, entries);
};
