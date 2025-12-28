import React from 'react';
import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import Button from '../atoms/Button';

export const MovementCard = ({ movement, onAdd }) => {
  if (!movement) return null;

  return (
    <Card className="flex flex-col space-y-2">
      <div className="flex items-start justify-between">
        <SectionTitle className="mb-0 text-lg">{movement.name}</SectionTitle>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full uppercase tracking-wide">
          {movement.category}
        </span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Difficulty:</strong> {movement.difficulty}
        </p>
        <p>
          <strong>Equipment:</strong> {movement.equipment}
        </p>
        <p>
          <strong>Targets:</strong> {movement.targetMuscles?.join(', ')}
        </p>
      </div>
      <ul className="list-disc pl-4 text-xs text-gray-500 space-y-1">
        {movement.cues?.map((cue) => (
          <li key={cue}>{cue}</li>
        ))}
      </ul>
      {onAdd && (
        <Button className="self-start" onClick={() => onAdd(movement)}>
          Add to Session
        </Button>
      )}
    </Card>
  );
};

export default MovementCard;
