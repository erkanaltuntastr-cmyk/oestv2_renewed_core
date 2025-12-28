import { buildDailyProgram } from './programBuilder';
import type { DailyProgram, WeeklyPlan } from '../../types/workout';

export const workoutEngine = {
  generateDailyWorkout(user: Record<string, unknown> = {}, dayIndex: number = 0): DailyProgram {
    return buildDailyProgram(user, dayIndex);
  },
  generateWeeklyPlan(user: Record<string, unknown> = {}): WeeklyPlan {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const program = buildDailyProgram(user, dayIndex);
      return {
        day: dayIndex + 1,
        warmUp: program.warmUp,
        main: program.main,
        optional: program.optional,
      } as DailyProgram & { day: number };
    });
  },
};

export default workoutEngine;
