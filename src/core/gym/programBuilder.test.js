import { describe, it, expect } from 'vitest';
import { applyProgressiveOverload, buildDailyProgram } from './programBuilder';

const beginnerUser = {
  experience: 'beginner',
  equipment: 'bodyweight',
};

const sampleMovements = {
  beginnerBodyweight: {
    code: 'main_bodyweight_squat',
    name: 'Bodyweight Squat',
    category: 'main',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['quads'],
    cues: [],
  },
  intermediateDumbbell: {
    code: 'main_goblet_squat',
    name: 'Goblet Squat',
    category: 'main',
    difficulty: 'intermediate',
    equipment: 'dumbbell',
    targetMuscles: ['quads'],
    cues: [],
  },
  advancedMachine: {
    code: 'opt_machine_press',
    name: 'Machine Press',
    category: 'optional',
    difficulty: 'advanced',
    equipment: 'machine',
    targetMuscles: ['chest'],
    cues: [],
  },
};

describe('buildDailyProgram', () => {
  it('creates appropriate counts for a beginner bodyweight user', () => {
    const program = buildDailyProgram(beginnerUser, 0);

    expect(program.warmUp.length).toBeGreaterThanOrEqual(2);
    expect(program.warmUp.length).toBeLessThanOrEqual(3);

    expect(program.main.length).toBeGreaterThanOrEqual(3);
    expect(program.main.length).toBeLessThanOrEqual(5);

    expect(program.optional.length).toBeGreaterThanOrEqual(0);
    expect(program.optional.length).toBeLessThanOrEqual(2);
  });
});

describe('applyProgressiveOverload', () => {
  it('increases reps for beginner only by day index without weight', () => {
    const result = applyProgressiveOverload(sampleMovements.beginnerBodyweight, 2);
    expect(result.prescribedReps).toBe(12); // base 10 + dayIndex 2
    expect(result.prescribedSets).toBe(3);
    expect(result.prescribedWeight).toBeNull();
  });

  it('increases reps and weight appropriately for intermediate movements', () => {
    const result = applyProgressiveOverload(sampleMovements.intermediateDumbbell, 1);
    expect(result.prescribedReps).toBe(12); // base 10 + diff bump 1 + dayIndex 1
    expect(result.prescribedSets).toBe(3);
    expect(result.prescribedWeight).toBeCloseTo(12.5);
  });

  it('adds higher rep bump and weight progression for advanced movements', () => {
    const result = applyProgressiveOverload(sampleMovements.advancedMachine, 3);
    expect(result.prescribedReps).toBe(17); // base optional 12 + bump 2 + dayIndex 3
    expect(result.prescribedSets).toBe(2);
    expect(result.prescribedWeight).toBeCloseTo(17.5); // 10 + 2.5 * 3
  });
});
