# Type System

This document summarizes the domain types defined in `src/types` and how they flow through the system.

## Global Types
- `ID = string`
- `Timestamp = number`
- `Nullable<T>` — `T | null`
- `Dictionary<T>` — record-like map of strings to `T`
- `DeepPartial<T>` — recursively partial fields

## User Types
```ts
User {
  uid: string;
  email: string;
  displayName?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  weight?: number;
  experience?: "beginner" | "intermediate" | "advanced";
  onboardingCompleted: boolean;
}
```
- **UserMandatoryFields**: `uid`, `email`, `onboardingCompleted`
- **UserOptionalFields**: `displayName`, `age`, `gender`, `weight`, `experience`
- **UserInput**: union of mandatory + optional for onboarding/profile updates

Used by: auth store (`user`), rules engine, program builder, onboarding screen.

## Movement Types
```ts
Movement {
  code: string;
  name: string;
  category: "warmup" | "main" | "optional";
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: "bodyweight" | "dumbbell" | "machine";
  targetMuscles: string[];
  cues: string[];
}
```

Used by: movement library, rules engine filters, program builder, workout engine, UI lists/cards.

## Workout Types
### WorkoutMovement
```ts
{
  id: number;
  code: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
}
```

### DailyProgram
```ts
{
  warmUp: Movement[];
  main: Movement[];
  optional: Movement[];
}
```

### WeeklyPlan
- `DailyProgram[]` (7 items typical)

Used by: `useWorkoutSession`, `programBuilder`, `workoutEngine`, session panel UI, plan/workout screens.

## History Types
```ts
HistoryEntry {
  id: string;
  date: number;
  movements: WorkoutMovement[];
  totalVolume: number;
  durationMinutes: number;
}
```

Used by: `historyService`, `useWorkoutHistory`, history/analytics UI screens, analytics modules.

## Analytics Types
- **VolumeMap**: `Record<string, number>` (daily, weekly, monthly volume aggregations)
- **FrequencyMap**: `Record<string, number>` (movement code → count)
- **ProgressionPoint**: `{ date: number; volume: number; movementCode: string; }`
- **PRRecord**: `{ movementCode: string; weight: number; }`

Functions:
- `getDailyVolume(history): VolumeMap`
- `getWeeklyVolume(history): VolumeMap`
- `getMonthlyVolume(history): VolumeMap`
- `getTotalVolume(history): number`
- `getMovementFrequency(history): FrequencyMap`
- `getTopMovements(history, limit): { movementCode: string; count: number; }[]`
- `getMovementProgression(history, movementCode): ProgressionPoint[]`
- `getPRs(history): PRRecord[]`

## Type Flow
- **Auth → Rules**: `User` feeds `rulesEngine` to tailor movements.
- **Rules → Program**: Filtered `Movement[]` shape drives `DailyProgram` generation.
- **Program → Session**: `Movement` info becomes `WorkoutMovement` entries in session state.
- **Session → History**: `WorkoutMovement[]` becomes `HistoryEntry.movements` with computed `totalVolume`.
- **History → Analytics**: `HistoryEntry[]` feeds analytics maps for UI dashboards.

## Extending Types Safely
1. Add fields to `src/types/*` declarations.
2. Update corresponding core modules to honor new data (rules, program builder, analytics).
3. Add normalization/validation in models/services if new mandatory fields are introduced.
4. Expand tests to cover the new shape.
