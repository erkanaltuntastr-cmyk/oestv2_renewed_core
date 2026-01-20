
import type { HistoryEntry } from '../../types/history';
import type { WorkoutMovement } from '../../types/movement';

type NormalizedHistoryEntry = HistoryEntry;
type HistoryValidationResult = { valid: boolean; errors: string[] };

/** Helpers: safe coercions */
const toFiniteNumber = (value: unknown): number | null => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const toFiniteOrZero = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const toFiniteOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/** Normalize a single movement row */
const normalizeMovement = (movement: Partial<WorkoutMovement>): WorkoutMovement => ({
  code: movement.code ?? '',
  name: movement.name ?? '',
  // "3" -> 3 else 0
  sets: toFiniteOrZero(movement.sets),
  reps: toFiniteOrZero(movement.reps),
  // keep null for null/undefined; coerce finite numeric; non‑finite -> null
  weight: toFiniteOrNull(movement.weight),
  // finite number else 0
  id: toFiniteOrZero(movement.id),
});

/** Public normaliser used by tests/services */
export const normalizeHistoryEntry = (raw: Partial<HistoryEntry> = {}): NormalizedHistoryEntry => {
  const movements = Array.isArray(raw.movements) ? raw.movements.map(normalizeMovement) : [];

  return {
    id: String(raw.id ?? ''),
    date: Number(raw.date ?? Date.now()),
    movements,
    // keep other logic intact; default 0 if non‑finite
    totalVolume: toFiniteOrZero(raw.totalVolume),
    // if duration invalid/missing, derive a tiny positive heuristic from movement count
    durationMinutes: Number.isFinite(Number(raw.durationMinutes))
      ? Number(raw.durationMinutes)
      : movements.length * 2,
  } as NormalizedHistoryEntry;
};

/** Optional validator kept for compatibility */
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

  (movements || []).forEach((m, i) => {
    if (!m?.code || typeof m.code !== 'string') errors.push(`movements[${i}].code must be a string`);
    if (!m?.name || typeof m.name !== 'string') errors.push(`movements[${i}].name must be a string`);
    if (!Number.isFinite(m?.sets as number)) errors.push(`movements[${i}].sets must be a number`);
    if (!Number.isFinite(m?.reps as number)) errors.push(`movements[${i}].reps must be a number`);
    if (!(m?.weight === null || m?.weight === undefined || Number.isFinite(m?.weight as number)))
      errors.push(`movements[${i}].weight must be a number or null`);
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
