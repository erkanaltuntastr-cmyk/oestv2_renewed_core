import React from 'react';

export const SectionTitle = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold text-gray-800 mb-3 ${className}`}>{children}</h2>
);

export default SectionTitle;
