import React from 'react';
import clsx from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={clsx('bg-white rounded-lg shadow-sm border border-gray-100 p-4', className)}>{children}</div>;
};

export default Card;
