import { describe, expect, it } from 'vitest';
import { filterMain, filterOptional, filterWarmups } from '../rulesEngine';
import { movementLibrary } from '../movementLibrary';

const hasOnlyBodyweight = (movements: { equipment: string }[]) =>
  movements.every((movement) => movement.equipment === 'bodyweight');

describe('rulesEngine edge cases', () => {
  it('defaults to bodyweight-only selections when no equipment is provided', () => {
    const warmups = filterWarmups();
    const main = filterMain();

    expect(warmups.length).toBeGreaterThan(0);
    expect(main.length).toBeGreaterThan(0);
    expect(hasOnlyBodyweight(warmups)).toBe(true);
    expect(hasOnlyBodyweight(main)).toBe(true);
  });

  it('includes dumbbell movements when equipment is available', () => {
    const user = { equipment: 'dumbbell', experience: 'intermediate' } as const;
    const main = filterMain(user);

    expect(main.length).toBeGreaterThan(0);
    expect(main.some((movement) => movement.equipment === 'dumbbell')).toBe(true);
    expect(main.every((movement) => movement.equipment === 'dumbbell' || movement.equipment === 'bodyweight')).toBe(true);
  });

  it('excludes advanced movements for high-risk profiles', () => {
    const user = { age: 60, weight: 120, equipment: 'machine', experience: 'advanced' } as const;
    const optional = filterOptional(user);

    expect(optional.length).toBeGreaterThan(0);
    expect(optional.every((movement) => movement.difficulty !== 'advanced')).toBe(true);
  });

  it('omits push-ups for beginner female users while keeping other beginner presses', () => {
    const user = { gender: 'female', experience: 'beginner', equipment: 'bodyweight' } as const;
    const main = filterMain(user);
    const hasPushup = main.find((movement) => movement.code === 'main_pushup');
    const hasIncline = main.find((movement) => movement.code === 'main_incline_pushup');

    expect(hasPushup).toBeUndefined();
    expect(hasIncline).toBeDefined();
  });

  it('preserves catalog order to keep deterministic programming', () => {
    const user = { equipment: 'machine', experience: 'advanced' } as const;
    const main = filterMain(user);
    const expectedCodes = movementLibrary.filter((m) => m.category === 'main').map((m) => m.code);

    const filteredCodes = main.map((m) => m.code);
    expect(filteredCodes.join(',')).toBe(filteredCodes.slice().sort((a, b) => expectedCodes.indexOf(a) - expectedCodes.indexOf(b)).join(','));
  });
});
