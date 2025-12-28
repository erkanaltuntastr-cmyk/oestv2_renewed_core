import { movementLibrary } from './movementLibrary';

const getExperience = (user = {}) => user.experienceLevel || user.experience || 'beginner';
const getEquipmentPreference = (user = {}) => user.equipment || user.equipmentPreference || user.availableEquipment || 'bodyweight';

const difficultyOrder = {
  beginner: ['beginner'],
  intermediate: ['beginner', 'intermediate'],
  advanced: ['beginner', 'intermediate', 'advanced'],
};

const isHigherRiskProfile = (user = {}) => {
  const age = user.age || 0;
  const weight = user.weight || 0;
  return age >= 55 || weight >= 110;
};

const filterByCategory = (category, user = {}) => {
  const experience = getExperience(user);
  const equipment = getEquipmentPreference(user);
  const allowedDifficulties = difficultyOrder[experience] || difficultyOrder.beginner;
  const highRisk = isHigherRiskProfile(user);

  return movementLibrary.filter((movement) => {
    if (movement.category !== category) return false;

    if (highRisk && movement.difficulty === 'advanced') return false;
    if (!allowedDifficulties.includes(movement.difficulty)) return false;

    if (equipment === 'machine') return true;
    if (equipment === 'dumbbell') {
      return movement.equipment === 'dumbbell' || movement.equipment === 'bodyweight';
    }

    return movement.equipment === 'bodyweight';
  });
};

export const filterWarmups = (user) => filterByCategory('warmup', user);

export const filterMain = (user) => filterByCategory('main', user).filter((movement) => {
  if (!user || !user.gender) return true;
  if (movement.code === 'main_pushup' && user.gender === 'female' && getExperience(user) === 'beginner') {
    return false;
  }
  return true;
});

export const filterOptional = (user) => filterByCategory('optional', user);

export default {
  filterWarmups,
  filterMain,
  filterOptional,
};
