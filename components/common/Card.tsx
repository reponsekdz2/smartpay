import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl ${className}`}>
      {title && <h2 className="text-xl font-bold text-white mb-4 tracking-wide">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;