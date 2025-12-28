import type { HistoryEntry } from '../../types/history';
import type { WorkoutMovement } from '../../types/workout';

type NormalizedHistoryEntry = HistoryEntry;

type HistoryValidationResult = { valid: boolean; errors: string[] };

const normalizeMovement = (movement: Partial<WorkoutMovement>): WorkoutMovement => ({
  code: movement.code ?? '',
  name: movement.name ?? '',
  sets: Number.isFinite(movement.sets) ? Number(movement.sets) : 0,
  reps: Number.isFinite(movement.reps) ? Number(movement.reps) : 0,
  weight: movement.weight === null || movement.weight === undefined ? null : Number(movement.weight),
  id: Number.isFinite(movement.id) ? Number(movement.id) : 0,
});

export const normalizeHistoryEntry = (raw: Partial<HistoryEntry> = {}): NormalizedHistoryEntry => {
  const movements = Array.isArray(raw.movements) ? raw.movements.map(normalizeMovement) : [];

  return {
    id: String(raw.id ?? ''),
    date: Number(raw.date ?? Date.now()),
    movements,
    totalVolume: Number.isFinite(raw.totalVolume) ? Number(raw.totalVolume) : 0,
    durationMinutes: Number.isFinite(raw.durationMinutes)
      ? Number(raw.durationMinutes)
      : movements.length * 2,
  };
};

export const validateHistoryEntry = (entry: Partial<HistoryEntry>): HistoryValidationResult => {
  const errors: string[] = [];
  if (!entry || typeof entry !== 'object') {
    return { valid: false, errors: ['Entry must be an object'] };
  }

  const { id, date, movements, totalVolume, durationMinutes } = entry;
  if (!id || typeof id !== 'string') errors.push('id must be a non-empty string');
  if (!Number.isFinite(date as number)) errors.push('date must be a number (timestamp)');
  if (!Array.isArray(movements) || movements.length === 0)
    errors.push('movements must be a non-empty array');

  (movements || []).forEach((movement, idx) => {
    if (!movement.code || typeof movement.code !== 'string')
      errors.push(`movements[${idx}].code must be a string`);
    if (!movement.name || typeof movement.name !== 'string')
      errors.push(`movements[${idx}].name must be a string`);
    if (!Number.isFinite(movement.sets)) errors.push(`movements[${idx}].sets must be a number`);
    if (!Number.isFinite(movement.reps)) errors.push(`movements[${idx}].reps must be a number`);
    if (!(movement.weight === null || movement.weight === undefined || Number.isFinite(movement.weight)))
      errors.push(`movements[${idx}].weight must be a number or null`);
  });

  if (!Number.isFinite(totalVolume as number) || (totalVolume as number) < 0)
    errors.push('totalVolume must be a non-negative number');
  if (!Number.isFinite(durationMinutes as number) || (durationMinutes as number) < 0)
    errors.push('durationMinutes must be a non-negative number');

  return { valid: errors.length === 0, errors };
};

export default {
  normalizeHistoryEntry,
  validateHistoryEntry,
};
