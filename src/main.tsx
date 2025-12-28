import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import AppRouter from './ui/navigation/AppRouter';
import ErrorFallback from './ui/utility/ErrorFallback';
import { initSentry } from './monitoring/sentry';
import { log } from './monitoring/logger';

initSentry();

window.onerror = (message, source, lineno, colno, error) => {
  log.error('GlobalError', { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = (event) => {
  log.error('UnhandledRejection', event.reason);
};

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
        <AppRouter />
      </Sentry.ErrorBoundary>
    </React.StrictMode>,
  );
}
