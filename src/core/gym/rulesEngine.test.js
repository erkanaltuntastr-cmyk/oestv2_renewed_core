import { describe, it, expect } from 'vitest';
import { filterMain, filterOptional, filterWarmups } from './rulesEngine';

describe('rulesEngine filters', () => {
  it('defaults to bodyweight movements when user info missing', () => {
    const warmups = filterWarmups();
    const main = filterMain();
    const optional = filterOptional();

    [...warmups, ...main, ...optional].forEach((movement) => {
      expect(movement.equipment).toBe('bodyweight');
    });
  });

  it('includes dumbbell options when equipment is dumbbell', () => {
    const user = { equipment: 'dumbbell' };
    const movements = [...filterWarmups(user), ...filterMain(user), ...filterOptional(user)];

    expect(movements.length).toBeGreaterThan(0);
    movements.forEach((movement) => {
      expect(['bodyweight', 'dumbbell']).toContain(movement.equipment);
    });
  });

  it('excludes advanced movements for higher risk profiles', () => {
    const user = { age: 60, equipment: 'machine', experience: 'advanced' };
    const movements = [...filterWarmups(user), ...filterMain(user), ...filterOptional(user)];

    const hasAdvanced = movements.some((movement) => movement.difficulty === 'advanced');
    expect(hasAdvanced).toBe(false);
  });

  it('removes pushups for female beginner in main block', () => {
    const user = { gender: 'female', experience: 'beginner' };
    const movements = filterMain(user);

    const pushup = movements.find((movement) => movement.code === 'main_pushup');
    expect(pushup).toBeUndefined();
  });
});
