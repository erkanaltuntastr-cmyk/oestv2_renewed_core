import React, { memo, useMemo } from 'react';
import MovementCard from './MovementCard';
import type { Movement } from '../../types/movement';

export interface MovementListProps {
  movements?: Movement[];
  onAdd?: (movement: Movement) => void;
}

export const MovementList: React.FC<MovementListProps> = memo(({ movements = [], onAdd }) => {
  const movementItems = useMemo(() => movements, [movements]);

  if (!movementItems.length) {
    return <p className="text-sm text-gray-500">No movements available.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {movementItems.map((movement) => (
        <MovementCard key={movement.code} movement={movement} onAdd={onAdd} />
      ))}
    </div>
  );
});

MovementList.displayName = 'MovementList';

export default MovementList;
