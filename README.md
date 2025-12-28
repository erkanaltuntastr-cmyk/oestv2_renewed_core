# OESTV2 Renewed Core

A modular, Tailwind-styled fitness coaching app built with React, Vite, Zustand, and TypeScript. OESTV2 follows a Z2 Minimal Core philosophy: small seams, mock-friendly services, and composable UI layers.

## Project Purpose
- Generate personalized daily/weekly workouts from user profile inputs.
- Track active sessions and persist completed workouts to history.
- Surface analytics (volume, frequency, progression, PRs) via dashboards.
- Keep onboarding and auth flows lightweight with Firebase-or-mock support.

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **State**: Zustand stores and domain hooks
- **Styling**: TailwindCSS
- **Testing**: Vitest + React Testing Library
- **Tooling**: Local/mock-friendly services (Firebase optional)

## Architecture Summary
- **Core Logic**: Auth, storage, user model, gym rules/program builders, workout engine, history service, analytics (pure functions).
- **Hooks**: Workout session/history management and shared auth access.
- **UI Layers**: Atoms → molecules → organisms → screens, wired through React Router.
- **Type System**: Domain declarations in `src/types` underpin the TS migration and IntelliSense.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full details.

## Quick Start
```bash
npm install
npm run dev
```

Run tests:
```bash
npm run test  # or npx vitest run
```

## Screenshots
_Add screenshots of key screens (Dashboard, Plan, Workout, History/Analytics) once available._

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Type System](docs/TYPE_SYSTEM.md)
- [Contributing](docs/CONTRIBUTING.md)

## Contributing
See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for branching, PR, and testing expectations.

