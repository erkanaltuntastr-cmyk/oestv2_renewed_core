export const getMovementFrequency = (history = []) =>
  history.reduce((acc, entry) => {
    (entry.movements || []).forEach((movement) => {
      acc[movement.code] = (acc[movement.code] || 0) + 1;
    });
    return acc;
  }, {});

export const getTopMovements = (history = [], limit = 5) => {
  const frequency = getMovementFrequency(history);
  return Object.entries(frequency)
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export default {
  getMovementFrequency,
  getTopMovements,
};
