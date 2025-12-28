import { buildDailyProgram } from './programBuilder';

export const workoutEngine = {
  generateDailyWorkout(user = {}, dayIndex = 0) {
    return buildDailyProgram(user, dayIndex);
  },
  generateWeeklyPlan(user = {}) {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const program = buildDailyProgram(user, dayIndex);
      return {
        day: dayIndex + 1,
        warmUp: program.warmUp,
        main: program.main,
        optional: program.optional,
      };
    });
  },
};

export default workoutEngine;
