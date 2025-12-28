import React from 'react';
import SectionTitle from '../atoms/SectionTitle';
import WeeklyPlanView from '../organisms/WeeklyPlanView';

export const WorkoutPlanScreen = () => {
  return (
    <div className="p-4 space-y-4">
      <SectionTitle>Weekly Plan</SectionTitle>
      <WeeklyPlanView />
    </div>
  );
};

export default WorkoutPlanScreen;
