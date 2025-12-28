import React from 'react';
import SectionTitle from '../atoms/SectionTitle';
import DailyWorkoutView from '../organisms/DailyWorkoutView';
import { useWorkoutSession } from '../../core/hooks/useWorkoutSession';

export const DailyWorkoutScreen = () => {
  const { addMovement } = useWorkoutSession();

  return (
    <div className="p-4 space-y-4">
      <SectionTitle>Today’s Workout</SectionTitle>
      <DailyWorkoutView onAddMovement={addMovement} />
    </div>
  );
};

export default DailyWorkoutScreen;
