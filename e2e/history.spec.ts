import { test, expect } from '@playwright/test';
import { resetStorage, seedAuthenticatedWithHistory } from './utils/testUser';
import type { HistoryEntry } from '../src/types/history';

const now = Date.now();
const historyEntries: HistoryEntry[] = [
  {
    id: 'hist-1',
    date: now - 24 * 60 * 60 * 1000,
    movements: [
      { id: 1, code: 'main_pushup', name: 'Push Up', sets: 3, reps: 12, weight: 10 },
      { id: 2, code: 'main_squat', name: 'Goblet Squat', sets: 3, reps: 10, weight: 15 },
    ],
    totalVolume: 3 * 12 * 10 + 3 * 10 * 15,
    durationMinutes: 25,
  },
  {
    id: 'hist-2',
    date: now,
    movements: [
      { id: 3, code: 'main_pushup', name: 'Push Up', sets: 4, reps: 12, weight: 12 },
    ],
    totalVolume: 4 * 12 * 12,
    durationMinutes: 18,
  },
];

test.beforeEach(async ({ page }) => {
  await resetStorage(page);
});

test('history screen lists entries and analytics widgets', async ({ page }) => {
  await seedAuthenticatedWithHistory(page, historyEntries);
  await page.goto('/history');

  await expect(page.getByRole('heading', { name: /history & analytics/i })).toBeVisible();
  await expect(page.getByText(/Recent Workouts/i)).toBeVisible();
  await expect(page.getByText(/movements/)).toBeVisible();
  await expect(page.getByText(/Volume Summary/i)).toBeVisible();
  await expect(page.getByText(/Top Movements/i)).toBeVisible();
  await expect(page.getByText(/Personal Records/i)).toBeVisible();

  await page.getByLabel('Select Movement').selectOption('main_pushup');
  await expect(page.getByText(/Progression for main_pushup/i)).toBeVisible();
});
