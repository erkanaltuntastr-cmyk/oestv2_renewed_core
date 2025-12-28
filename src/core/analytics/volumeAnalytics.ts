import type { HistoryEntry } from '../../types/history';
import type { VolumeMap } from '../../types/analytics';

const getDateKey = (timestamp: number): string => new Date(timestamp).toISOString().slice(0, 10);
const getMonthKey = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
};
const getWeekKey = (timestamp: number): string => {
  const date = new Date(timestamp);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${`${week}`.padStart(2, '0')}`;
};

const aggregateByKey = (history: HistoryEntry[] = [], keyGetter: (timestamp: number) => string): VolumeMap =>
  history.reduce<VolumeMap>((acc, entry) => {
    const key = keyGetter(entry.date);
    acc[key] = (acc[key] || 0) + (entry.totalVolume || 0);
    return acc;
  }, {});

export const getDailyVolume = (history: HistoryEntry[] = []): VolumeMap => aggregateByKey(history, getDateKey);
export const getWeeklyVolume = (history: HistoryEntry[] = []): VolumeMap => aggregateByKey(history, getWeekKey);
export const getMonthlyVolume = (history: HistoryEntry[] = []): VolumeMap => aggregateByKey(history, getMonthKey);
export const getTotalVolume = (history: HistoryEntry[] = []): number =>
  history.reduce((total, entry) => total + (entry.totalVolume || 0), 0);

export default {
  getDailyVolume,
  getWeeklyVolume,
  getMonthlyVolume,
  getTotalVolume,
};
