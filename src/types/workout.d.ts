import type { Movement } from './movement';

export interface WorkoutMovement {
  id: number;
  code: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
}

export interface DailyProgram {
  warmUp: Movement[];
  main: Movement[];
  optional: Movement[];
}

export type WeeklyPlan = DailyProgram[];
