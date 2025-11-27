import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  isLoading, 
  variant = 'primary', 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 focus:ring-primary-500 border border-transparent",
    secondary: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm focus:ring-primary-500",
    outline: "bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 ml-2 animate-spin" />
          <span>מעבד...</span>
        </>
      ) : (
        <>
          {icon && <span className="ml-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
