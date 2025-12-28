# E2E Tests (Playwright)

## Getting Started
1. Install dependencies (includes Playwright browsers):
   ```bash
   npm install
   npx playwright install
   ```
2. Start the dev server via Playwright (handled automatically by `playwright.config.ts`).

## Running Tests
- Headless default:
  ```bash
  npm run test:e2e
  ```
- UI mode for debugging:
  ```bash
  npm run test:e2e:ui
  ```
- Debug mode with inspector:
  ```bash
  npm run test:e2e:debug
  ```

## Debugging Tips
- Traces, screenshots, and videos are captured on failure (see `playwright.config.ts`).
- Use the Playwright trace viewer:
  ```bash
  npx playwright show-trace trace.zip
  ```
- Record new tests:
  ```bash
  npx playwright codegen http://localhost:4173
  ```

## CI Integration
- Tests run in Chromium, Firefox, WebKit, plus mobile emulations.
- The dev server is started via the `webServer` option; set `PLAYWRIGHT_BASE_URL` to override the host.
- Use `CI=true` to disable server reuse.

## Storage & Helpers
- Helper utilities live in `e2e/utils/testUser.ts` for login, onboarding, and history seeding.
- All helpers reset localStorage/sessionStorage to keep specs independent.
