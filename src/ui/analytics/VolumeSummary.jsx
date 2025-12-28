import React, { useMemo } from 'react';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import {
  getTotalVolume,
  getDailyVolume,
  getWeeklyVolume,
  getMonthlyVolume,
} from '../../core/analytics/volumeAnalytics';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getCurrentWeekKey = () => {
  const date = new Date();
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${`${week}`.padStart(2, '0')}`;
};

const getCurrentMonthKey = () => {
  const date = new Date();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
};

const formatNumber = (value) => new Intl.NumberFormat().format(Math.round(value || 0));

const VolumeCard = ({ label, value }) => (
  <Card className="p-4 bg-white border border-gray-100 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-semibold text-gray-900">{formatNumber(value)}</p>
  </Card>
);

export const VolumeSummary = ({ history = [] }) => {
  const summary = useMemo(() => {
    const totalVolume = getTotalVolume(history);
    const dailyVolumes = getDailyVolume(history);
    const weeklyVolumes = getWeeklyVolume(history);
    const monthlyVolumes = getMonthlyVolume(history);

    const todayKey = getTodayKey();
    const weekKey = getCurrentWeekKey();
    const monthKey = getCurrentMonthKey();

    return {
      totalVolume,
      todayVolume: dailyVolumes[todayKey] || 0,
      weeklyVolume: weeklyVolumes[weekKey] || 0,
      monthlyVolume: monthlyVolumes[monthKey] || 0,
    };
  }, [history]);

  return (
    <div className="space-y-2">
      <SectionTitle className="mb-0">Volume Summary</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <VolumeCard label="Total Volume" value={summary.totalVolume} />
        <VolumeCard label="This Week" value={summary.weeklyVolume} />
        <VolumeCard label="This Month" value={summary.monthlyVolume} />
        <VolumeCard label="Today" value={summary.todayVolume} />
      </div>
    </div>
  );
};

export default VolumeSummary;
