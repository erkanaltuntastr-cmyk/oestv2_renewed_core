import { useEffect, useMemo, useState } from 'react';
import { storageService } from '../storage/storageService';

const createMovementEntry = (movement, id) => ({
  id,
  code: movement.code,
  name: movement.name,
  sets: movement.sets ?? movement.prescribedSets ?? 3,
  reps: movement.reps ?? movement.prescribedReps ?? 10,
  weight: movement.weight ?? movement.prescribedWeight ?? null,
});

export const useWorkoutSession = () => {
  const [session, setSession] = useState(() => storageService.session.get() || []);

  useEffect(() => {
    storageService.session.set(session);
  }, [session]);

  const addMovement = (movement) => {
    setSession((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((item) => item.id)) + 1 : 1;
      return [...prev, createMovementEntry(movement, nextId)];
    });
  };

  const updateMovement = (id, data) => {
    setSession((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data, id: item.id } : item)),
    );
  };

  const removeMovement = (id) => {
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
