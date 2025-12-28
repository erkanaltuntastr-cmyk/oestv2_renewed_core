import React from 'react';
import SectionTitle from '../atoms/SectionTitle';
import DailyWorkoutView from '../organisms/DailyWorkoutView';
import { useWorkoutSession } from '../../core/hooks/useWorkoutSession';
import type { Movement } from '../../types/movement';

export const DailyWorkoutScreen: React.FC = () => {
  const { addMovement } = useWorkoutSession();

  return (
    <div className="p-4 space-y-4">
      <SectionTitle>Today’s Workout</SectionTitle>
      <DailyWorkoutView onAddMovement={(movement: Movement) => addMovement(movement)} />
    </div>
  );
};

export default DailyWorkoutScreen;
