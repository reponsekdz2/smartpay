import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactElement;
}

const Input: React.FC<InputProps> = ({ label, icon, id, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{React.cloneElement(icon as React.ReactElement<any>, {className: "h-5 w-5 text-text-tertiary"})}</div>}
        <input
          id={id}
          className={`w-full p-3 bg-background border border-gray-300 rounded-lg text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-primary focus:border-primary/50 focus:outline-none transition-colors duration-200 ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;