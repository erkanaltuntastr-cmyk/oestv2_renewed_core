import React from 'react';

interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ message = 'Loading...' }) => (
  <div className="p-4 text-sm text-gray-600" role="status" aria-live="polite">
    {message}
  </div>
);

export default LoadingFallback;
