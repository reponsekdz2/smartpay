import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactElement;
}

const Input: React.FC<InputProps> = ({ label, icon, id, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{React.cloneElement(icon as React.ReactElement<any>, {className: "h-5 w-5 text-gray-400"})}</div>}
        <input
          id={id}
          className={`w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-neon-accent focus:border-neon-accent/50 focus:outline-none transition-all duration-300 ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;