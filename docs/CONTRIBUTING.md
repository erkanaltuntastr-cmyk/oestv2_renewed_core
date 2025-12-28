# Contributing Guide

Thank you for considering a contribution! This document outlines how we work together.

## Branching Strategy
- `main`: stable, deployable branch.
- Feature branches: `feature/<short-description>`.
- Fix branches: `fix/<short-description>`.

## Commit Messages
- Use concise, imperative messages (e.g., `Add onboarding validation`).
- Group related changes into a single commit when reasonable.

## Pull Requests
- Keep PRs focused and scoped.
- Include a clear summary and testing notes.
- Link to related issues or specs.
- Address review comments promptly; prefer follow-up commits over force-push unless history is noisy.

## Code Style
- TypeScript for runtime code; import domain types from `src/types`.
- Prefer pure functions in analytics and rules; avoid hidden side effects.
- Tailwind for styling; keep utility classes readable and grouped logically.
- Keep components small and focused; push business logic into hooks/services.

## Testing Requirements
- Add/maintain Vitest coverage for core logic and UI behaviors touched by your change.
- Mock external integrations (Firebase, storage) inside test files.
- Ensure tests are deterministic (fixed dates/fixtures where applicable).

## Feature Proposals
- Open an issue or doc outlining the problem, proposed solution, and affected areas (types, core, UI, analytics).
- Consider backward compatibility with existing types and data.

## Review Expectations
- Be respectful and constructive.
- Explain trade-offs and decisions in review comments.
- Prefer clarity and maintainability over cleverness.

## Release Hygiene
- Update docs (README, guides) when user flows or contracts change.
- Ensure no stale JS/JSX copies exist alongside TS/TSX.

Thank you for helping improve OESTV2!
