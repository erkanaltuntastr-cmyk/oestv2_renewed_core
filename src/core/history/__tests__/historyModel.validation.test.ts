import { describe, expect, it } from 'vitest';
import { normalizeHistoryEntry, validateHistoryEntry } from '../historyModel';

const sampleRaw = {
  id: 'entry-1',
  date: 1700000000000,
  movements: [
    { code: 'move', name: 'Movement', sets: '3', reps: '8', weight: '15', id: 1 },
  ],
  totalVolume: undefined,
  durationMinutes: undefined,
};

describe('historyModel normalization and validation', () => {
  it('normalizes numeric fields and fills defaults', () => {
    const normalized = normalizeHistoryEntry(sampleRaw);

    expect(normalized.movements[0].sets).toBe(3);
    expect(normalized.movements[0].reps).toBe(8);
    expect(normalized.movements[0].weight).toBe(15);
    expect(normalized.totalVolume).toBe(0);
    expect(normalized.durationMinutes).toBeGreaterThan(0);
  });

  it('fails validation for incomplete entries', () => {
    const invalid = validateHistoryEntry({ id: '', date: NaN, movements: [], totalVolume: -1, durationMinutes: -5 });

    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  it('passes validation after normalization', () => {
    const normalized = normalizeHistoryEntry(sampleRaw);
    const result = validateHistoryEntry(normalized);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
