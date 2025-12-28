import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;
const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
const release = typeof __APP_VERSION__ !== 'undefined' ? (__APP_VERSION__ as string) : 'unknown';

const tracesSampleRate = environment === 'production' ? 0.2 : 0.0;

export const initSentry = (): void => {
  if (!dsn) return;
  if (Sentry.getCurrentHub().getClient()) return;

  Sentry.init({
    dsn,
    environment,
    release,
    integrations: [new BrowserTracing()],
    tracesSampleRate,
  });
};

export default Sentry;
