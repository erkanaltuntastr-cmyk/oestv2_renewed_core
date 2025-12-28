const getDateKey = (timestamp) => new Date(timestamp).toISOString().slice(0, 10);
const getMonthKey = (timestamp) => {
  const date = new Date(timestamp);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
};
const getWeekKey = (timestamp) => {
  const date = new Date(timestamp);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${`${week}`.padStart(2, '0')}`;
};

const aggregateByKey = (history = [], keyGetter) =>
  history.reduce((acc, entry) => {
    const key = keyGetter(entry.date);
    acc[key] = (acc[key] || 0) + (entry.totalVolume || 0);
    return acc;
  }, {});

export const getDailyVolume = (history = []) => aggregateByKey(history, getDateKey);
export const getWeeklyVolume = (history = []) => aggregateByKey(history, getWeekKey);
export const getMonthlyVolume = (history = []) => aggregateByKey(history, getMonthKey);
export const getTotalVolume = (history = []) =>
  history.reduce((total, entry) => total + (entry.totalVolume || 0), 0);

export default {
  getDailyVolume,
  getWeeklyVolume,
  getMonthlyVolume,
  getTotalVolume,
};
