# Monitoring & Logging

This project uses **Sentry** for production error monitoring and a lightweight client-side logger for diagnostics.

## Sentry Initialization
- Located at `src/monitoring/sentry.ts`.
- Reads DSN from `VITE_SENTRY_DSN` and environment from `VITE_ENVIRONMENT`.
- Release version is injected at build time from `VERSION.md` via `__APP_VERSION__`.
- Browser tracing is enabled with a conservative sample rate (0.2 in production, disabled in non-production).
- Initialization runs once during app bootstrap; if no DSN is provided, Sentry remains inactive.

## Error Boundary
- The root render in `src/main.tsx` wraps the app with `Sentry.ErrorBoundary` and renders `ErrorFallback` when errors occur.
- To test, throw an error inside any component and verify the fallback renders.

## Global Error Handling
- `window.onerror` and `window.onunhandledrejection` forward errors to the logger (and Sentry in production).
- This captures unexpected runtime errors and rejected promises outside React.

## Logger Usage
- `src/monitoring/logger.ts` exposes `log.info`, `log.warn`, and `log.error`.
- In development, logs are suppressed unless `DEBUG_LOGS=true`.
- In production, `log.error` forwards to Sentry when a DSN is configured.
- Use `log.info('event', data)` to add contextual breadcrumbs around important flows.

## Adding Breadcrumbs
- Use `log.info`/`log.warn` before and after critical actions to trace user flows.
- For explicit Sentry breadcrumbs, call `Sentry.addBreadcrumb({ message, category, level })` from `@sentry/react`.

## Testing Error Boundaries
1. Set `VITE_SENTRY_DSN` to a test project DSN.
2. Run `npm run dev` and trigger a render error.
3. Confirm `ErrorFallback` displays and Sentry receives the event (check Sentry dashboard).

## Local Development Notes
- Ensure `.env` contains `VITE_ENVIRONMENT=development` and `DEBUG_LOGS=true` if you want verbose logging while coding.
- When testing production behavior locally, set `VITE_ENVIRONMENT=production` and provide a DSN.
