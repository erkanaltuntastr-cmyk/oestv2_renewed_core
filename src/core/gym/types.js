/**
 * @typedef {Object} Movement
 * @property {string} code
 * @property {string} name
 * @property {'warmup' | 'main' | 'optional'} category
 * @property {'beginner' | 'intermediate' | 'advanced'} difficulty
 * @property {'bodyweight' | 'dumbbell' | 'machine'} equipment
 * @property {string[]} targetMuscles
 * @property {string[]} cues
 */

/**
 * @typedef {Object} DailyProgram
 * @property {Movement[]} warmUp
 * @property {Movement[]} main
 * @property {Movement[]} optional
 */

/**
 * @typedef {DailyProgram[]} WeeklyPlan
 */

export {};
