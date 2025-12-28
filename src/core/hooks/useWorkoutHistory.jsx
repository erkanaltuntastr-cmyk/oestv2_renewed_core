import { useMemo } from 'react';
import { useWorkoutSession } from './useWorkoutSession';
import { historyService } from '../history/historyService';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export const useWorkoutHistory = () => {
  const { session, clearSession } = useWorkoutSession();

  const saveCurrentSession = () => {
    if (!session || session.length === 0) return null;
    const totalVolume = historyService.computeTotalVolume({ movements: session });
    const movements = session.map(({ id, ...rest }) => rest);
    const entry = {
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

  const getHistory = () => historyService.getAllHistory();
  const clearHistory = () => historyService.clearHistory();

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
