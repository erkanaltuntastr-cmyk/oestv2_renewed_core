import { useEffect, useMemo, useState } from 'react';
import { storageService } from '../storage/storageService';
import type { Movement } from '../../types/movement';
import type { WorkoutMovement } from '../../types/workout';

type SessionMovementInput = Movement &
  Partial<Pick<WorkoutMovement, 'sets' | 'reps' | 'weight'>> & {
    prescribedSets?: number;
    prescribedReps?: number;
    prescribedWeight?: number | null;
  };

const createMovementEntry = (movement: SessionMovementInput, id: number): WorkoutMovement => ({
  id,
  code: movement.code,
  name: movement.name,
  sets: movement.sets ?? movement.prescribedSets ?? 3,
  reps: movement.reps ?? movement.prescribedReps ?? 10,
  weight: movement.weight ?? movement.prescribedWeight ?? null,
});

export interface UseWorkoutSessionReturn {
  session: WorkoutMovement[];
  addMovement: (movement: SessionMovementInput) => void;
  updateMovement: (id: number, data: Partial<WorkoutMovement>) => void;
  removeMovement: (id: number) => void;
  clearSession: () => void;
}

export const useWorkoutSession = (): UseWorkoutSessionReturn => {
  const [session, setSession] = useState<WorkoutMovement[]>(() => {
    const stored = storageService.session.get();
    return Array.isArray(stored) ? (stored as WorkoutMovement[]) : [];
  });

  useEffect(() => {
    storageService.session.set(session);
  }, [session]);

  const addMovement = (movement: SessionMovementInput) => {
    setSession((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((item) => item.id)) + 1 : 1;
      return [...prev, createMovementEntry(movement, nextId)];
    });
  };

  const updateMovement = (id: number, data: Partial<WorkoutMovement>) => {
    setSession((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data, id: item.id } : item)),
    );
  };

  const removeMovement = (id: number) => {
    setSession((prev) => prev.filter((item) => item.id !== id));
  };

  const clearSession = () => {
    setSession([]);
    storageService.session.clear();
  };

  return useMemo(
    () => ({
      session,
      addMovement,
      updateMovement,
      removeMovement,
      clearSession,
    }),
    [session],
  );
};

export default useWorkoutSession;
