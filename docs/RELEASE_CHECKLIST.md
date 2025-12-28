# Release Checklist

## Build & Quality
- [ ] Run `npm run build` or `pnpm build` and ensure the build completes without errors.
- [ ] Run `npm run test:ci` to execute the full Vitest suite with coverage.
- [ ] Verify bundle size thresholds using `node scripts/verify-build.js`.
- [ ] Confirm TypeScript compilation passes with no errors.

## Manual QA
- [ ] Smoke test core flows: login, onboarding, dashboard navigation, workout generation, session save to history.
- [ ] Validate lazy-loaded routes render with Suspense fallback messaging.
- [ ] Exercise error boundaries by simulating a thrown error in a component.
- [ ] Confirm session persistence across refresh (auth + workout session).

## Browser & Device Matrix
- [ ] Chrome (latest), Firefox (latest), Safari (latest), Edge (latest).
- [ ] iOS Safari, Android Chrome across common viewport sizes (mobile, tablet, desktop).

## Performance
- [ ] Largest bundle under 5 MB; individual chunks under 2 MB.
- [ ] Verify code-splitting and preloading strategy via network waterfall.
- [ ] Confirm no unnecessary hydration or render loops in React DevTools.

## Accessibility
- [ ] Check keyboard navigation across all interactive elements.
- [ ] Validate ARIA roles for buttons, inputs, and fallbacks.
- [ ] Run automated a11y scan (e.g., axe) on primary screens.

## Release Notes
- [ ] Update `VERSION.md` with release number and notes.
- [ ] Summarize key changes, migrations, and known issues.
- [ ] Tag the release and push artifacts.
