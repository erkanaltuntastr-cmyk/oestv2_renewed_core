import type { HistoryEntry } from '../../types/history';
import type { FrequencyMap, TopMovement } from '../../types/analytics';

export const getMovementFrequency = (history: HistoryEntry[] = []): FrequencyMap =>
  history.reduce<FrequencyMap>((acc, entry) => {
    (entry.movements || []).forEach((movement) => {
      acc[movement.code] = (acc[movement.code] || 0) + 1;
    });
    return acc;
  }, {});

export const getTopMovements = (history: HistoryEntry[] = [], limit: number = 5): TopMovement[] => {
  const frequency = getMovementFrequency(history);
  return Object.entries(frequency)
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export default {
  getMovementFrequency,
  getTopMovements,
};
