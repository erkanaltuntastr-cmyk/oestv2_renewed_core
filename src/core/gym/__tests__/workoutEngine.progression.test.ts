import { describe, expect, it } from 'vitest';
import { workoutEngine } from '../workoutEngine';

const userProfile = { equipment: 'dumbbell', experience: 'intermediate' } as const;

describe('workoutEngine progression', () => {
  const weeklyPlan = workoutEngine.generateWeeklyPlan(userProfile);

  it('generates a full seven-day plan', () => {
    expect(weeklyPlan).toHaveLength(7);
    weeklyPlan.forEach((day) => {
      expect(day.warmUp.length).toBeGreaterThanOrEqual(2);
      expect(day.main.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('progressively increases reps across days for the same movement slot', () => {
    const dayOneMain = weeklyPlan[0].main[0];
    const dayFourMain = weeklyPlan[3].main[0];

    expect(dayFourMain.prescribedReps).toBeGreaterThan(dayOneMain.prescribedReps);
  });

  it('progressively increases weight for loaded movements', () => {
    const dayOneLoaded = weeklyPlan[0].main.find((m) => m.prescribedWeight !== null);
    const dayFiveLoaded = weeklyPlan[4].main.find((m) => m.prescribedWeight !== null);

    expect(dayOneLoaded).toBeDefined();
    expect(dayFiveLoaded).toBeDefined();
    expect((dayFiveLoaded as typeof dayOneLoaded).prescribedWeight ?? 0).toBeGreaterThan(
      (dayOneLoaded as typeof dayOneLoaded).prescribedWeight ?? 0,
    );
  });
});
