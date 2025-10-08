import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ children, title, className = '', padding = 'md' }) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  return (
    <div className={`bg-card rounded-xl shadow-fb ${paddingClasses[padding]} ${className}`}>
      {title && <h2 className="text-xl font-bold text-text-primary mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;