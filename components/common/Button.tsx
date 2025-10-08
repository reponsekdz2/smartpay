import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = "w-full font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-accent/50 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-quantum-primary to-quantum-secondary text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20',
    danger: 'bg-status-error text-white shadow-lg hover:shadow-xl',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;