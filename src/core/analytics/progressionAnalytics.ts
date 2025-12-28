import type { HistoryEntry } from '../../types/history';
import type { PRRecord, ProgressionPoint } from '../../types/analytics';

const computeMovementVolume = (movement: { sets?: number; reps?: number; weight?: number | null }): number => {
  const sets = Number.isFinite(movement.sets) ? (movement.sets as number) : 0;
  const reps = Number.isFinite(movement.reps) ? (movement.reps as number) : 0;
  const weight = Number.isFinite(movement.weight as number) ? ((movement.weight as number) || 0) : 0;
  return sets * reps * weight;
};

export const getMovementProgression = (history: HistoryEntry[] = [], movementCode: string): ProgressionPoint[] => {
  if (!movementCode) return [];
  const progression = history
    .map((entry) => {
      const movement = (entry.movements || []).find((m) => m.code === movementCode);
      if (!movement) return null;
      return {
        date: entry.date,
        volume: computeMovementVolume(movement),
      } as ProgressionPoint;
    })
    .filter(Boolean) as ProgressionPoint[]
    .sort((a, b) => a.date - b.date);
  return progression;
};

export const getPRs = (history: HistoryEntry[] = []): PRRecord => {
  const prs: PRRecord = {};
  history.forEach((entry) => {
    (entry.movements || []).forEach((movement) => {
      const weight = Number.isFinite(movement.weight) ? (movement.weight as number) : 0;
      if (!prs[movement.code] || weight > prs[movement.code]) {
        prs[movement.code] = weight;
      }
    });
  });
  return prs;
};

export default {
  getMovementProgression,
  getPRs,
};
