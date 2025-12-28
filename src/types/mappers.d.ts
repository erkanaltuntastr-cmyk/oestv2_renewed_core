import type { Movement } from './movement';
import type { WorkoutMovement, DailyProgram, WeeklyPlan } from './workout';
import type { HistoryEntry } from './history';
import type { VolumeMap } from './analytics';
import type { User } from './user';

export type MapMovementToSession = (
  movement: Movement,
  overrides?: Partial<Omit<WorkoutMovement, 'code' | 'name'>>
) => WorkoutMovement;

export type MapHistoryToAnalytics = (
  history: HistoryEntry[]
) => {
  daily: VolumeMap;
  weekly: VolumeMap;
  monthly: VolumeMap;
  total: number;
};

export type MapUserToRulesEngine = (user: User & {
  equipment?: 'bodyweight' | 'dumbbell' | 'machine';
  equipmentPreference?: string;
  availableEquipment?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}) => User;

export type ProgramBuilderResult = DailyProgram | WeeklyPlan;
