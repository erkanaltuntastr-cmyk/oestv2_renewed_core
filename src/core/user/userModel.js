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

const coerceNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
};

export const normalizeUserInput = (raw = {}) => {
  const normalized = {
    uid: raw.uid?.toString?.().trim?.() || raw.uid || null,
    email: raw.email?.toString?.().trim?.().toLowerCase?.() || raw.email || null,
  };

  if (raw.displayName !== undefined) normalized.displayName = raw.displayName?.toString?.().trim?.();
  if (raw.age !== undefined) normalized.age = coerceNumber(raw.age);
  if (raw.gender !== undefined) normalized.gender = raw.gender?.toString?.().trim?.();
  if (raw.weight !== undefined) normalized.weight = coerceNumber(raw.weight);
  if (raw.experience !== undefined) normalized.experience = raw.experience?.toString?.().trim?.();
  if (raw.onboardingCompleted !== undefined) normalized.onboardingCompleted = Boolean(raw.onboardingCompleted);

  return normalized;
};

export const validateMandatory = (user) => {
  const errors = [];

  Object.entries(userSchema.mandatory).forEach(([key, type]) => {
    const value = user[key];
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

export const validateOptional = (user) => {
  const errors = [];

  Object.entries(userSchema.optional).forEach(([key, type]) => {
    const value = user[key];
    if (value === undefined || value === null) return;

    if (type === 'number') {
      if (!Number.isFinite(value)) {
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
