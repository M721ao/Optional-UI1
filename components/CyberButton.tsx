
import React from 'react';
import { Loader2 } from 'lucide-react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neon';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  active?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon, 
  children, 
  className = '', 
  disabled,
  active = false,
  ...props 
}) => {
  // Base structural styles
  const baseStyles = "relative inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden focus:outline-none";
  
  // Variant styles
  const variants = {
    primary: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 clip-path-polygon shadow-md hover:shadow-lg",
    
    secondary: "bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/40 clip-path-polygon backdrop-blur-sm",
    
    danger: "bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-500 hover:bg-red-500 hover:text-white clip-path-polygon shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    
    neon: "bg-purple-600 dark:bg-cyber-neon text-white dark:text-black hover:bg-purple-700 dark:hover:bg-white shadow-[0_0_15px_rgba(168,85,247,0.3)] dark:shadow-[0_0_15px_rgba(0,243,255,0.3)] clip-path-polygon hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] dark:hover:shadow-[0_0_25px_rgba(0,243,255,0.5)] border border-transparent",
    
    ghost: "bg-transparent text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-md border border-transparent" 
  };

  // Active state overrides for ghost/secondary
  const activeStyles = active 
    ? (variant === 'ghost' ? 'bg-gray-200 dark:bg-white/10 text-black dark:text-white font-bold shadow-inner' : '')
    : '';

  // Size configurations
  const sizes = {
    xs: "text-[9px] px-3 py-1.5 gap-1.5",
    sm: "text-[10px] px-5 py-2.5 gap-2",
    md: "text-xs px-8 py-3.5 gap-2.5",
    lg: "text-sm px-10 py-4 gap-3"
  };

  const selectedVariant = variants[variant];
  const selectedSize = sizes[size];
  const isClipped = variant !== 'ghost';

  return (
    <button 
      className={`${baseStyles} ${selectedVariant} ${selectedSize} ${activeStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Glitch/Scanline overlay for clipped buttons */}
      {isClipped && !disabled && (
        <div className="absolute inset-0 bg-white/20 dark:bg-black/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none skew-x-12"></div>
      )}

      {isLoading ? (
        <>
          <Loader2 className="animate-spin shrink-0" size={size === 'xs' ? 10 : 14} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className={`shrink-0 ${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} flex items-center justify-center`}>{icon}</span>}
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </>
      )}
    </button>
  );
};
