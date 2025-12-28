import type { User, UserInput } from '../../types/user';

export const userSchema = {
  mandatory: {
    uid: 'string',
    email: 'string',
  },
  optional: {
    displayName: 'string',
    age: 'number',
    gender: 'string',
    weight: 'number',
    experience: 'string',
    onboardingCompleted: 'boolean',
  },
};

type NormalizedUserInput = Partial<User> & { uid: string | null; email: string | null };

const coerceNumber = (value: unknown): number | undefined => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
};

export const normalizeUserInput = (raw: Partial<UserInput> = {}): NormalizedUserInput => {
  const normalized: NormalizedUserInput = {
    uid: raw.uid?.toString?.().trim?.() || (raw.uid as string) || null,
    email: raw.email?.toString?.().trim?.().toLowerCase?.() || (raw.email as string) || null,
  };

  if (raw.displayName !== undefined) normalized.displayName = raw.displayName?.toString?.().trim?.();
  if (raw.age !== undefined) normalized.age = coerceNumber(raw.age);
  if (raw.gender !== undefined) normalized.gender = raw.gender?.toString?.().trim?.() as User['gender'];
  if (raw.weight !== undefined) normalized.weight = coerceNumber(raw.weight);
  if (raw.experience !== undefined) normalized.experience = raw.experience?.toString?.().trim?.() as User['experience'];
  if (raw.onboardingCompleted !== undefined) normalized.onboardingCompleted = Boolean(raw.onboardingCompleted);

  return normalized;
};

export const validateMandatory = (user: Partial<User>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  Object.entries(userSchema.mandatory).forEach(([key, type]) => {
    const value = (user as Record<string, unknown>)[key];
    if (value === undefined || value === null || value === '') {
      errors.push(`${key} is required`);
      return;
    }
    if (typeof value !== type) {
      errors.push(`${key} must be a ${type}`);
    }
  });

  return { valid: errors.length === 0, errors };
};

export const validateOptional = (user: Partial<User>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  Object.entries(userSchema.optional).forEach(([key, type]) => {
    const value = (user as Record<string, unknown>)[key];
    if (value === undefined || value === null) return;

    if (type === 'number') {
      if (!Number.isFinite(value as number)) {
        errors.push(`${key} must be a finite number`);
      }
      return;
    }

    if (typeof value !== type) {
      errors.push(`${key} must be a ${type}`);
    }
  });

  return { valid: errors.length === 0, errors };
};

export default {
  userSchema,
  normalizeUserInput,
  validateMandatory,
  validateOptional,
};
