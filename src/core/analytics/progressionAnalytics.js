const computeMovementVolume = (movement) => {
  const sets = Number.isFinite(movement.sets) ? movement.sets : 0;
  const reps = Number.isFinite(movement.reps) ? movement.reps : 0;
  const weight = Number.isFinite(movement.weight) ? movement.weight : 0;
  return sets * reps * weight;
};

export const getMovementProgression = (history = [], movementCode) => {
  if (!movementCode) return [];
  const progression = history
    .map((entry) => {
      const movement = (entry.movements || []).find((m) => m.code === movementCode);
      if (!movement) return null;
      return {
        date: entry.date,
        volume: computeMovementVolume(movement),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);
  return progression;
};

export const getPRs = (history = []) => {
  const prs = {};
  history.forEach((entry) => {
    (entry.movements || []).forEach((movement) => {
      const weight = Number.isFinite(movement.weight) ? movement.weight : 0;
      if (!prs[movement.code] || weight > prs[movement.code]) {
        prs[movement.code] = weight;
      }
    });
  });
  return prs;
};

export default {
  getMovementProgression,
  getPRs,
};
