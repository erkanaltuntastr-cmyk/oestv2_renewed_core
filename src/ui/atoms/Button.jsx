import React from 'react';
import clsx from 'clsx';

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

export const Button = ({ children, onClick, variant = 'primary', className = '', ...rest }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClasses[variant] || variantClasses.primary,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
