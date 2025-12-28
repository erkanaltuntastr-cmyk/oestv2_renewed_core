import React from 'react';

interface ErrorFallbackProps {
  errorId?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ errorId }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6 text-gray-900">
    <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
    <p className="mb-4 text-gray-600">An unexpected error occurred. Please try reloading the app.</p>
    {errorId && <p className="text-sm text-gray-500 mb-2">Error ID: {errorId}</p>}
    <button
      type="button"
      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
      onClick={() => window.location.reload()}
    >
      Reload App
    </button>
  </div>
);

export default ErrorFallback;
