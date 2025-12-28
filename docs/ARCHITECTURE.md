# OESTV2 Architecture

## Core Philosophy (Z2 Minimal Core)
- **Small, explicit seams**: Each layer exposes a narrow API to keep dependencies minimal and predictable.
- **Mock-first**: Firebase, auth, and AI all support mock modes to keep local/dev workflows frictionless.
- **Layered growth**: Data, business rules, and UI are separated so each can evolve independently.
- **Type-led safety**: Stage 9+ TypeScript declarations and the full TS migration provide IntelliSense and early error detection without sacrificing iteration speed.

## Folder Structure (High Level)
- `src/core` — Business logic and platform services (auth, storage, gym engine, history, analytics).
- `src/core/auth` — Zustand auth store, auth actions, selectors, Firebase/mock service.
- `src/core/config` — Environment-aware Firebase config (mock-safe).
- `src/core/storage` — Namespaced storage adapters for user/session/history/flags.
- `src/core/user` — User model normalization and validation.
- `src/core/gym` — Movement library, rules engine, program builder, and workout engine facade.
- `src/core/history` — History model and service for persisting completed sessions.
- `src/core/analytics` — Pure functions for volume, frequency, and progression analytics.
- `src/core/hooks` — Domain hooks (workout session, workout history).
- `src/shared/hooks` — Cross-cutting hooks (auth store access).
- `src/ui` — UI atoms → molecules → organisms → screens + navigation.
- `src/types` — Global/domain type declarations supporting the TS migration.
- `docs` — Architecture, developer guide, type system, and contributing docs.

## Data Flow
1. **Auth**: `authService` (Firebase or mock) → Zustand auth store (state/actions/selectors) → UI gates.
2. **User Profile**: Normalized via `userModel`, stored in auth store, and read by rules/program builders.
3. **Workout Generation**: `workoutEngine` facade uses `programBuilder` + `rulesEngine` + `movementLibrary` to generate daily/weekly plans.
4. **Session Management**: `useWorkoutSession` hook persists current session movements via `storageService.session`.
5. **History Pipeline**: `useWorkoutHistory` wraps `historyService` to convert a session into a serializable `HistoryEntry` and clear the session.
6. **Analytics**: Pure analytics modules consume history to derive volume trends, frequencies, progression, and PRs for UI dashboards.
7. **UI Composition**: Screens consume hooks and engines, rendering through atoms/molecules/organisms with navigation managed in `AppRouter`.

## State Management (Zustand)
- **Auth store**: typed state (`user`, `token`, `isAuthenticated`, `expiresAt`, `onboardingCompleted`, `isLoading`). Actions include login/logout, setters, and `checkSession`.
- **Session**: Managed by `useWorkoutSession`, persisted to `storageService.session`.
- **History**: Managed by `useWorkoutHistory` + `historyService`, persisted to `storageService.history`.

## TypeScript Layering
- **Global utility types**: `ID`, `Timestamp`, `Nullable<T>`, `Dictionary<T>`, `DeepPartial<T>`.
- **Domain declarations**: User, Movement, WorkoutMovement, DailyProgram, WeeklyPlan, HistoryEntry, Analytics maps.
- **JSDoc bridges**: `src/core/*/types.js` retain compatibility while TS types drive IntelliSense and safety.

## Rules Engine Architecture
- Inputs: user profile (age, gender, weight, experience, equipment availability).
- Filters: `filterWarmups`, `filterMain`, `filterOptional` apply safety constraints (e.g., avoid advanced moves for high-risk users; equipment-aware filtering; gender/experience nuance).
- Outputs: Movement subsets feeding program builder.

## Workout Engine Architecture
- **Movement Library**: Curated list with category, difficulty, equipment, target muscles, cues.
- **Program Builder**: Constructs `{ warmUp, main, optional }` respecting movement counts and applies `applyProgressiveOverload` to adjust reps/weight over days.
- **Workout Engine Facade**: `generateDailyWorkout(user)` + `generateWeeklyPlan(user)` wrapping program builder for screens.

## History Pipeline
- **Model**: `HistoryEntry` with date, movements, totalVolume, durationMinutes.
- **Service**: `saveHistoryEntry`, `getAllHistory`, `clearHistory`, `computeTotalVolume` using `storageService.history`.
- **Hook**: `useWorkoutHistory` saves current session (from `useWorkoutSession`) to history and clears session.

## UI Composition
- **Atoms** → **Molecules** → **Organisms** → **Screens** layering for reuse and readability.
- **Navigation**: React Router v6 in `AppRouter` with auth/onboarding guards.
- **Styling**: TailwindCSS across all components.

## Analytics Pipeline
- Volume: `getDailyVolume`, `getWeeklyVolume`, `getMonthlyVolume`, `getTotalVolume`.
- Frequency: `getMovementFrequency`, `getTopMovements`.
- Progression: `getMovementProgression`, `getPRs`.
- UI: Analytics components visualize summaries, top movements, PRs, and progression bars.

## Environment & Mocking
- Firebase config auto-falls back to mock when env vars are missing.
- Auth mock accepts any email with password `"test"` and returns a mock user.
- AI guidance mock returns on-device coaching text (no network).

## Persistence
- `storageService` namespaces (`user`, `session`, `history`, `flags`) wrap `localStorage`-style APIs with `get/set/clear` contracts.

## Testing
- Vitest + React Testing Library configured via `vitest.config.mts` and `src/setupTests.js`.
- Core logic tests cover program builder, rules engine, history service, and analytics; UI smoke test for Dashboard.

## Build & Tooling
- Vite + React + TypeScript.
- TailwindCSS for utility-first styling.
- npm scripts (see README) for dev/build/test.
