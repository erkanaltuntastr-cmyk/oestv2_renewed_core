import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockStore = { history: [] };

vi.mock('../storage/storageService', () => {
  const historyNamespace = {
    get: vi.fn(() => mockStore.history),
    set: vi.fn((value) => {
      mockStore.history = value;
    }),
    clear: vi.fn(() => {
      mockStore.history = [];
    }),
  };
  return { storageService: { history: historyNamespace } };
});

import { historyService, computeTotalVolume } from './historyService';

describe('historyService', () => {
  beforeEach(() => {
    mockStore.history = [];
  });

  it('computes total volume across multiple movements', () => {
    const entry = {
      movements: [
        { sets: 3, reps: 10, weight: 50 },
        { sets: 4, reps: 8, weight: 20 },
        { sets: 2, reps: 12, weight: null },
      ],
    };

    expect(computeTotalVolume(entry)).toBe(3 * 10 * 50 + 4 * 8 * 20 + 0);
  });

  it('saves a normalized entry and computes total volume', () => {
    const saved = historyService.saveHistoryEntry({
      id: 'abc',
      date: 123,
      movements: [{ code: 'm1', name: 'Move 1', sets: 2, reps: 10, weight: 50 }],
      durationMinutes: 10,
    });

    expect(saved.totalVolume).toBe(1000);
    expect(mockStore.history).toHaveLength(1);
    expect(mockStore.history[0].id).toBe('abc');
  });

  it('returns history after saving entries', () => {
    historyService.saveHistoryEntry({
      id: '1',
      date: 1,
      movements: [{ code: 'm1', name: 'Move 1', sets: 1, reps: 10, weight: 10 }],
      durationMinutes: 5,
    });

    const all = historyService.getAllHistory();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('1');
  });

  it('clears history storage', () => {
    historyService.saveHistoryEntry({
      id: '1',
      date: 1,
      movements: [{ code: 'm1', name: 'Move 1', sets: 1, reps: 10, weight: 10 }],
      durationMinutes: 5,
    });

    historyService.clearHistory();
    expect(historyService.getAllHistory()).toEqual([]);
  });
});
