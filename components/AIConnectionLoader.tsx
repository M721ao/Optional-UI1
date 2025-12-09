
import React from 'react';
import { Loader2 } from 'lucide-react';

interface AIConnectionLoaderProps {
  message?: string;
  overlay?: boolean; // If true, absolute positioning over parent with backdrop blur
  size?: 'sm' | 'md' | 'lg'; // Size of the spinner
}

export const AIConnectionLoader: React.FC<AIConnectionLoaderProps> = ({ 
  message, 
  overlay = false,
  size = 'md'
}) => {
  // Size mappings
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-4'
  };

  const containerClasses = overlay 
    ? "absolute inset-0 z-50 bg-white/80 dark:bg-[#0c0c10]/80 backdrop-blur-[2px]" 
    : "w-full py-4";

  return (
    <div className={`${containerClasses} flex flex-col items-center justify-center animate-in fade-in duration-200 rounded-lg`}>
       
       <div className="relative flex items-center justify-center">
          {/* Outer Ring - Static Glow */}
          <div className={`absolute inset-0 rounded-full border-transparent border-t-purple-500/50 dark:border-t-cyber-neon/50 blur-[2px] animate-spin`} style={{ animationDuration: '2s' }}></div>
          
          {/* Main Spinner */}
          <div className={`${sizeClasses[size]} border-gray-200 dark:border-white/10 border-t-purple-600 dark:border-t-cyber-neon rounded-full animate-spin`}></div>
          
          {/* Center Dot (only for md/lg) */}
          {size !== 'sm' && (
              <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-purple-600 dark:bg-cyber-neon rounded-full animate-pulse shadow-[0_0_10px_currentColor]"></div>
          )}
       </div>

       {/* Optional Message */}
       {message && (
         <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest animate-pulse">
               {message}
            </span>
         </div>
       )}
    </div>
  );
}
