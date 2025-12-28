import React from 'react';
import MovementCard from './MovementCard';

export const MovementList = ({ movements = [], onAdd }) => {
  if (!movements.length) {
    return <p className="text-sm text-gray-500">No movements available.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {movements.map((movement) => (
        <MovementCard key={movement.code} movement={movement} onAdd={onAdd} />
      ))}
    </div>
  );
};

export default MovementList;
