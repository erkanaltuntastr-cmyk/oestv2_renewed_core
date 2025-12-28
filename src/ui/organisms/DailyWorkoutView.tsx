import React, { useMemo } from 'react';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import MovementList from '../molecules/MovementList';
import { workoutEngine } from '../../core/gym/workoutEngine';
import { useAuthStore } from '../../core/auth/auth.state';
import type { Movement } from '../../types/movement';
import type { DailyProgram } from '../../types/workout';
import type { User } from '../../types/user';

export interface DailyWorkoutViewProps {
  onAddMovement?: (movement: Movement) => void;
}

export const DailyWorkoutView: React.FC<DailyWorkoutViewProps> = ({ onAddMovement }) => {
  const user = (useAuthStore((state) => state.user) as User | null) || ({} as Partial<User>);
  const program = useMemo<DailyProgram>(() => workoutEngine.generateDailyWorkout(user), [user]);

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
