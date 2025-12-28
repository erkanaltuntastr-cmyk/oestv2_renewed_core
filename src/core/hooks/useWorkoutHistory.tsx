import { useMemo } from 'react';
import { useWorkoutSession } from './useWorkoutSession';
import { historyService } from '../history/historyService';
import type { HistoryEntry } from '../../types/history';
import type { WorkoutMovement } from '../../types/workout';

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export interface UseWorkoutHistoryReturn {
  session: WorkoutMovement[];
  saveCurrentSession: () => HistoryEntry | null;
  getHistory: () => HistoryEntry[];
  clearHistory: () => HistoryEntry[];
}

export const useWorkoutHistory = (): UseWorkoutHistoryReturn => {
  const { session, clearSession } = useWorkoutSession();

  const saveCurrentSession = (): HistoryEntry | null => {
    if (!session || session.length === 0) return null;
    const totalVolume = historyService.computeTotalVolume({ movements: session });
    const movements = session.map(({ id, ...rest }) => rest);
    const entry: Partial<HistoryEntry> = {
      id: generateId(),
      date: Date.now(),
      movements,
      totalVolume,
      durationMinutes: movements.length * 2,
    };
    const saved = historyService.saveHistoryEntry(entry);
    clearSession();
    return saved;
  };

  const getHistory = (): HistoryEntry[] => historyService.getAllHistory();
  const clearHistory = (): HistoryEntry[] => historyService.clearHistory();

  return useMemo(
    () => ({
      session,
      saveCurrentSession,
      getHistory,
      clearHistory,
    }),
    [session],
  );
};

export default useWorkoutHistory;
