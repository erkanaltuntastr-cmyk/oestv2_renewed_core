# Developer Guide

Welcome to OESTV2. This guide helps you get productive quickly and build features safely.

## Prerequisites
- Node.js 18+
- npm 9+
- Modern browser for local dev

## Install & Run
```bash
npm install
npm run dev # starts Vite dev server
```

## Build
```bash
npm run build
```

## Tests
- Core/unit/UI tests use Vitest + React Testing Library.
```bash
npm run test       # watch mode
npm run test:run   # single run (if script exists; otherwise use `npx vitest run`)
```

## Project Layout
- `src/core` — auth, storage, user model, gym engine, history, analytics.
- `src/core/hooks` — workout session/history hooks.
- `src/shared/hooks` — shared auth hook.
- `src/ui` — atoms, molecules, organisms, screens, navigation.
- `src/types` — domain declarations for TS migration.
- `docs` — architecture, type system, contributing guides.

## Coding Conventions
- **TypeScript-first**: All runtime files are `.ts/.tsx`; use domain types from `src/types`.
- **No silent anys**: Prefer explicit interfaces and utility types (`Nullable`, `DeepPartial`).
- **Functional purity**: Analytics and rules engines are pure; avoid side effects in core logic.
- **Zustand stores**: Keep initial state and actions typed; selectors exported separately.
- **Tailwind**: Use utility classes; avoid inline styles when possible.

## Adding New Components
1. Place atoms/molecules/organisms/screens under `src/ui` in their respective layers.
2. Type props via domain types or dedicated interfaces.
3. Keep components presentational; business logic lives in hooks or core services.
4. Update Storybook (if/when added) and add minimal tests.

## Extending the Rules Engine
1. Add new movements to `src/core/gym/movementLibrary.ts`.
2. Update `rulesEngine` filters to include/exclude based on new attributes.
3. Ensure program builder respects new categories/difficulties.
4. Add tests mirroring the new logic in `rulesEngine.test.js`.

## Adding New Movements
- Append to `movementLibrary.ts` with `code`, `name`, `category`, `difficulty`, `equipment`, `targetMuscles`, `cues`.
- Keep codes unique and descriptive.
- Favor safe, scalable exercises; ensure categories stay balanced.

## Adding New Analytics
1. Add pure functions under `src/core/analytics`.
2. Type inputs/outputs using `src/types/analytics.d.ts`.
3. Write unit tests alongside (Vitest).
4. Surface in UI via analytics components/screens.

## Writing Tests
- Use Vitest with jsdom environment.
- For React components, prefer React Testing Library queries (`getByRole`, `getByText`).
- Mock external services (Firebase, storage) within the test file using `vi.mock`.
- Keep tests deterministic with fixed timestamps/fixtures.

## TypeScript Conventions
- Import domain types from `src/types/*` (not relative `.d.ts` paths when possible).
- Use utility types for optional/partial shapes.
- Prefer readonly data where applicable; avoid mutation in analytics/rules.

## Folder Naming Rules
- Lowercase with dashes or camelCase for files; no spaces.
- Keep tests alongside core logic where feasible.

## Adding New Features
1. Define data contracts in `src/types`.
2. Implement core logic in `src/core`.
3. Expose via hooks/services.
4. Build UI with atoms → molecules → organisms → screens.
5. Add analytics/history updates if relevant.
6. Cover with tests and update docs as needed.

## Troubleshooting
- **Auth in mock mode**: Password must be `test` when Firebase env vars are missing.
- **Session not persisting**: Verify `storageService.session` wiring and browser storage availability.
- **Analytics empty**: Ensure history entries exist via `useWorkoutHistory.saveCurrentSession()`.

Happy building!
