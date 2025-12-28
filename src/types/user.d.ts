export interface User {
  uid: string;
  email: string;
  displayName?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  experience?: 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted: boolean;
}

export type UserMandatoryFields = Pick<User, 'uid' | 'email'>;
export type UserOptionalFields = Omit<User, keyof UserMandatoryFields | 'onboardingCompleted'> & {
  onboardingCompleted?: boolean;
};
export type UserInput = UserMandatoryFields & Partial<UserOptionalFields>;

export type NormalizedUser = UserMandatoryFields & UserOptionalFields & { onboardingCompleted: boolean };

export type MaybeUser = Nullable<User>;
