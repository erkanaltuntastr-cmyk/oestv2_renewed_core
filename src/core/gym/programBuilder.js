import { filterMain, filterOptional, filterWarmups } from './rulesEngine';

const clampCount = (items, min, max) => {
  if (items.length === 0) return [];
  const desired = Math.min(max, Math.max(min, items.length));
  return items.slice(0, desired);
};

const basePrescriptions = {
  warmup: { sets: 2, reps: 10, weight: null },
  main: { sets: 3, reps: 10, weight: null },
  optional: { sets: 2, reps: 12, weight: null },
};

export const applyProgressiveOverload = (movement, dayIndex = 0) => {
  const base = basePrescriptions[movement.category] || basePrescriptions.main;
  const difficultyBump = movement.difficulty === 'advanced' ? 2 : movement.difficulty === 'intermediate' ? 1 : 0;
  const reps = base.reps + difficultyBump + dayIndex;
  const sets = base.sets;
  const startingWeight = base.weight !== null
    ? base.weight
    : movement.equipment === 'dumbbell' || movement.equipment === 'machine'
      ? 10
      : null;
  const weight = startingWeight !== null ? startingWeight + dayIndex * 2.5 : null;

  return {
    ...movement,
    prescribedSets: sets,
    prescribedReps: reps,
    prescribedWeight: weight,
  };
};

export const buildDailyProgram = (user = {}, dayIndex = 0) => {
  const warmups = clampCount(filterWarmups(user), 2, 3);
  const main = clampCount(filterMain(user), 3, 5);
  const optional = clampCount(filterOptional(user), 0, 2);

  const buildWithPrescription = (list) => list.map((movement) => applyProgressiveOverload(movement, dayIndex));

  return {
    warmUp: buildWithPrescription(warmups),
    main: buildWithPrescription(main),
    optional: buildWithPrescription(optional),
  };
};

export default {
  buildDailyProgram,
  applyProgressiveOverload,
};
