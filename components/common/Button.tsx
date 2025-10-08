import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseClasses = "w-full font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ease-in-out active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-5 text-lg'
  }

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-md',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-text-primary',
    danger: 'bg-error text-white shadow-md',
  };

  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;