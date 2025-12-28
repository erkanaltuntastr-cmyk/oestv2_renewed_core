import { storageService } from '../storage/storageService';
import { normalizeHistoryEntry, validateHistoryEntry } from './historyModel';
import type { HistoryEntry } from '../../types/history';

export const computeTotalVolume = (entry: Partial<HistoryEntry>): number => {
  if (!entry || !Array.isArray(entry.movements)) return 0;
  return entry.movements.reduce((total, movement) => {
    const sets = Number.isFinite(movement.sets) ? (movement.sets as number) : 0;
    const reps = Number.isFinite(movement.reps) ? (movement.reps as number) : 0;
    const weight = Number.isFinite(movement.weight) ? (movement.weight as number) : 0;
    return total + sets * reps * weight;
  }, 0);
};

export const getAllHistory = (): HistoryEntry[] => {
  const history = storageService.history.get();
  return Array.isArray(history) ? (history as HistoryEntry[]) : [];
};

export const clearHistory = (): HistoryEntry[] => {
  storageService.history.clear();
  return [];
};

export const saveHistoryEntry = (entry: Partial<HistoryEntry>): HistoryEntry => {
  const normalized = normalizeHistoryEntry(entry);
  const totalVolume = computeTotalVolume(normalized);
  const preparedEntry = { ...normalized, totalVolume } as HistoryEntry;
  const { valid, errors } = validateHistoryEntry(preparedEntry);
  if (!valid) {
    throw new Error(`Invalid history entry: ${errors.join(', ')}`);
  }
  const history = getAllHistory();
  const nextHistory = [...history, preparedEntry];
  storageService.history.set(nextHistory);
  return preparedEntry;
};

export const historyService = {
  saveHistoryEntry,
  getAllHistory,
  clearHistory,
  computeTotalVolume,
};

export default historyService;
