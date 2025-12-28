import React, { memo, useMemo } from 'react';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import Button from '../atoms/Button';
import SessionMovementItem from '../molecules/SessionMovementItem';
import { useWorkoutSession } from '../../core/hooks/useWorkoutSession';
import { useWorkoutHistory } from '../../core/hooks/useWorkoutHistory';

export const WorkoutSessionPanel: React.FC = memo(() => {
  const { session, updateMovement, removeMovement, clearSession } = useWorkoutSession();
  const { saveCurrentSession } = useWorkoutHistory();
  const movementItems = useMemo(() => session || [], [session]);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle className="mb-0">Current Session</SectionTitle>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={clearSession}>
            Clear Session
          </Button>
          <Button variant="primary" onClick={saveCurrentSession}>
            Complete Workout
          </Button>
        </div>
      </div>
      {movementItems && movementItems.length ? (
        <div className="space-y-2">
          {movementItems.map((movement) => (
            <SessionMovementItem
              key={movement.id}
              movement={movement}
              onUpdate={updateMovement}
              onRemove={removeMovement}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No movements in session yet.</p>
      )}
    </Card>
  );
});

WorkoutSessionPanel.displayName = 'WorkoutSessionPanel';

export default WorkoutSessionPanel;
