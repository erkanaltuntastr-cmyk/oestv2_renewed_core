import * as Sentry from '@sentry/react';

const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
const isProd = environment === 'production' || import.meta.env.PROD;
const debugFlag = (import.meta.env.DEBUG_LOGS ?? import.meta.env.VITE_DEBUG_LOGS ?? 'false') === 'true';

const shouldEmit = (): boolean => isProd || debugFlag;

const emit = (level: 'info' | 'warn' | 'error', ...args: unknown[]): void => {
  if (!shouldEmit() && level !== 'error') return;
  if (level === 'error' && !shouldEmit()) {
    // In dev without debug flag, still surface errors for visibility
    console.error(...args);
    return;
  }
  // eslint-disable-next-line no-console
  (console as Console)[level](...args);
};

export const log = {
  info: (...args: unknown[]): void => emit('info', ...args),
  warn: (...args: unknown[]): void => emit('warn', ...args),
  error: (error: unknown, ...context: unknown[]): void => {
    emit('error', error, ...context);
    if (isProd && import.meta.env.VITE_SENTRY_DSN) {
      if (error instanceof Error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(typeof error === 'string' ? error : 'Unknown error', 'error');
      }
    }
  },
};

export default log;
