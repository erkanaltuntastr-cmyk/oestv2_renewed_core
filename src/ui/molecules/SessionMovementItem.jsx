import React from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

export const SessionMovementItem = ({ movement, onUpdate, onRemove }) => {
  if (!movement) return null;

  const handleChange = (key) => (e) => {
    const value = key === 'weight' ? Number(e.target.value) || 0 : Number(e.target.value) || 0;
    onUpdate?.(movement.id, { [key]: value });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 border-b border-gray-100 py-2">
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{movement.name}</p>
        <p className="text-xs text-gray-500">Code: {movement.code}</p>
      </div>
      <div className="flex space-x-2">
        <Input
          label="Sets"
          type="number"
          value={movement.sets}
          onChange={handleChange('sets')}
          className="w-24"
        />
        <Input
          label="Reps"
          type="number"
          value={movement.reps}
          onChange={handleChange('reps')}
          className="w-24"
        />
        <Input
          label="Weight"
          type="number"
          value={movement.weight ?? ''}
          onChange={handleChange('weight')}
          className="w-24"
          placeholder="kg"
        />
      </div>
      <Button variant="danger" className="self-start md:self-center" onClick={() => onRemove?.(movement.id)}>
        Remove
      </Button>
    </div>
  );
};

export default SessionMovementItem;
