export interface Movement {
  code: string;
  name: string;
  category: 'warmup' | 'main' | 'optional';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: 'bodyweight' | 'dumbbell' | 'machine';
  targetMuscles: string[];
  cues: string[];
}

export type MovementCategory = Movement['category'];
export type MovementDifficulty = Movement['difficulty'];
export type MovementEquipment = Movement['equipment'];
