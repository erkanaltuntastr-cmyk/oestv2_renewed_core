import React, { useMemo } from 'react';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import MovementList from '../molecules/MovementList';
import { workoutEngine } from '../../core/gym/workoutEngine';
import { useAuthStore } from '../../core/auth/auth.state';

export const DailyWorkoutView = ({ onAddMovement }) => {
  const user = useAuthStore((state) => state.user) || {};
  const program = useMemo(() => workoutEngine.generateDailyWorkout(user), [user]);

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle>Warm-up</SectionTitle>
        <MovementList movements={program.warmUp} onAdd={onAddMovement} />
      </Card>
      <Card>
        <SectionTitle>Main</SectionTitle>
        <MovementList movements={program.main} onAdd={onAddMovement} />
      </Card>
      <Card>
        <SectionTitle>Optional</SectionTitle>
        <MovementList movements={program.optional} onAdd={onAddMovement} />
      </Card>
    </div>
  );
};

export default DailyWorkoutView;
