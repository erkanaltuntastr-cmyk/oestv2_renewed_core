import React from 'react';

export const Input = ({ label, value, onChange, type = 'text', placeholder = '', className = '', ...rest }) => {
  return (
    <label className={`flex flex-col space-y-1 text-sm text-gray-700 ${className}`}>
      {label && <span className="font-medium">{label}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...rest}
      />
    </label>
  );
};

export default Input;
