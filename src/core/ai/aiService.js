const describeProfile = (user = {}) => {
  const parts = [];
  if (user.gender) parts.push(`${user.gender}`);
  if (user.age) parts.push(`${user.age} yrs`);
  if (user.weight) parts.push(`${user.weight} kg`);
  if (user.experience) parts.push(`${user.experience} experience`);
  return parts.length ? parts.join(', ') : 'your current profile';
};

const guidanceLibrary = {
  warmup: 'Start with gentle mobility work to wake up your joints, then ease into dynamic stretches.',
  strength: 'Focus on controlled movements and prioritize form over load. Add pauses to build stability.',
  cardio: 'Use conversational pace intervals to build endurance without burning out early.',
  recovery: 'Give yourself room to breathe. Lighter movement days make your strong days even better.',
};

export const getGuidanceText = (questionId, user = {}) => {
  const profile = describeProfile(user);
  const cue = guidanceLibrary[questionId] || 'Keep moving forward with intention and kindness to yourself.';

  const tone =
    'Imagine a supportive coach at your side—steady, encouraging, and attentive to how your body feels today.';

  return `${tone} Based on ${profile}, ${cue}`;
};

const aiService = {
  getGuidanceText,
};

export default aiService;
