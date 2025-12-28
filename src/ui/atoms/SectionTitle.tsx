import React from 'react';

export interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold text-gray-800 mb-3 ${className}`}>{children}</h2>
);

export default SectionTitle;
