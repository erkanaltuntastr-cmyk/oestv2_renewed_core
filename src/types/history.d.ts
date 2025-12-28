import type { WorkoutMovement } from './workout';

export interface HistoryEntry {
  id: string;
  date: number;
  movements: WorkoutMovement[];
  totalVolume: number;
  durationMinutes: number;
}

export type HistoryCollection = HistoryEntry[];
