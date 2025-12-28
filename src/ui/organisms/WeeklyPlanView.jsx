import React, { useMemo } from 'react';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import { workoutEngine } from '../../core/gym/workoutEngine';
import { useAuthStore } from '../../core/auth/auth.state';

export const WeeklyPlanView = () => {
  const user = useAuthStore((state) => state.user) || {};
  const weeklyPlan = useMemo(() => workoutEngine.generateWeeklyPlan(user), [user]);

  return (
    <Card className="space-y-3">
      <SectionTitle className="mb-1">Weekly Plan</SectionTitle>
      <div className="grid md:grid-cols-2 gap-3">
        {weeklyPlan.map((day) => (
          <div key={day.day} className="p-3 border border-gray-100 rounded-md bg-gray-50">
            <p className="font-semibold text-gray-800">Day {day.day}</p>
            <p className="text-sm text-gray-600">Warm-up: {day.warmUp.length} movements</p>
            <p className="text-sm text-gray-600">Main: {day.main.length} movements</p>
            <p className="text-sm text-gray-600">Optional: {day.optional.length} movements</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeeklyPlanView;
