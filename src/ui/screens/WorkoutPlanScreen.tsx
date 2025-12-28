import React from 'react';
import SectionTitle from '../atoms/SectionTitle';
import WeeklyPlanView from '../organisms/WeeklyPlanView';

export const WorkoutPlanScreen: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <SectionTitle>Weekly Plan</SectionTitle>
      <WeeklyPlanView />
    </div>
  );
};

export default WorkoutPlanScreen;
