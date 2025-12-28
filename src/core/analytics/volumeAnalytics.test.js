import { describe, it, expect } from 'vitest';
import { getDailyVolume, getWeeklyVolume, getMonthlyVolume, getTotalVolume } from './volumeAnalytics';

describe('volumeAnalytics', () => {
  const history = [
    { date: new Date('2024-01-02').getTime(), totalVolume: 100 },
    { date: new Date('2024-01-02').getTime(), totalVolume: 50 },
    { date: new Date('2024-01-08').getTime(), totalVolume: 70 },
    { date: new Date('2024-02-03').getTime(), totalVolume: 30 },
  ];

  it('aggregates daily volume by date key', () => {
    const result = getDailyVolume(history);
    expect(result['2024-01-02']).toBe(150);
    expect(result['2024-01-08']).toBe(70);
    expect(result['2024-02-03']).toBe(30);
  });

  it('aggregates weekly volume by ISO-ish week key', () => {
    const result = getWeeklyVolume(history);
    expect(result['2024-W01']).toBe(150);
    expect(result['2024-W02']).toBe(70);
    expect(result['2024-W05']).toBe(30);
  });

  it('aggregates monthly volume by month key', () => {
    const result = getMonthlyVolume(history);
    expect(result['2024-01']).toBe(220);
    expect(result['2024-02']).toBe(30);
  });

  it('sums total volume across history', () => {
    expect(getTotalVolume(history)).toBe(250);
  });
});
