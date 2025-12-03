import React, { useState, useEffect } from 'react';

export const Loader: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    const fullText = "MAKE EVERYONE A QUANT MASTER";
    let timeout: any;
    let currentIndex = 0;
    let isDeleting = false;

    const animate = () => {
      if (!isDeleting) {
        // Typing
        if (currentIndex < fullText.length) {
          currentIndex++;
          setDisplayText(fullText.slice(0, currentIndex));
          // Random typing speed for realism (30ms - 80ms)
          timeout = setTimeout(animate, 30 + Math.random() * 50);
        } else {
          // Finished typing, pause for a while
          isDeleting = true;
          timeout = setTimeout(animate, 2500);
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayText(fullText.slice(0, currentIndex));
          timeout = setTimeout(animate, 20); // Fast delete
        } else {
          // Finished deleting, pause slightly then restart
          isDeleting = false;
          timeout = setTimeout(animate, 500);
        }
      }
    };

    // Start delay
    timeout = setTimeout(animate, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center font-mono selection:bg-none overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
      
      {/* Central Glow Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyber-purple/20 rounded-full blur-[80px] animate-pulse-slow"></div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center gap-12 z-10 w-full">
        
        {/* Custom Logo Construction (The Windmill) */}
        {/* We use an SVG to approximate the 4-ribbon shape */}
        <div className="relative w-32 h-32 animate-pulse-slow">
            {/* Inner Spinner Container - Rotates slowly */}
            <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full drop-shadow-[0_0_15px_rgba(188,19,254,0.5)] animate-spin-slow"
                style={{ animationDuration: '8s' }}
            >
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff00ff" /> {/* Pink */}
                        <stop offset="100%" stopColor="#bc13fe" /> {/* Purple */}
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff7e5f" /> {/* Orange */}
                        <stop offset="100%" stopColor="#feb47b" /> {/* Light Orange */}
                    </linearGradient>
                    <linearGradient id="grad3" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#bc13fe" /> {/* Purple */}
                        <stop offset="100%" stopColor="#240b36" /> {/* Dark Purple */}
                    </linearGradient>
                    <linearGradient id="grad4" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fcee0a" /> {/* Yellow/Orange */}
                        <stop offset="100%" stopColor="#fb8c00" /> {/* Orange */}
                    </linearGradient>
                </defs>

                {/* Top Right Ribbon (Pink/Purple) */}
                <path d="M52 50 Q 52 20 80 20 L 80 48 Q 52 48 52 50" fill="url(#grad1)" />
                
                {/* Bottom Right Ribbon (Orange) */}
                <path d="M50 52 Q 80 52 80 80 L 52 80 Q 52 52 50 52" fill="url(#grad2)" />

                {/* Bottom Left Ribbon (Dark Purple) */}
                <path d="M48 50 Q 48 80 20 80 L 20 52 Q 48 52 48 50" fill="url(#grad3)" />

                {/* Top Left Ribbon (Yellow/Orange) */}
                <path d="M50 48 Q 20 48 20 20 L 48 20 Q 48 48 50 48" fill="url(#grad4)" />
                
                {/* Center Gap/Glow */}
                <circle cx="50" cy="50" r="2" fill="#fff" className="animate-pulse" />
            </svg>
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-[0.2em] text-white">
                TRADING<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-neon">FLOW</span>
            </h2>
            
            {/* Slogan with Typewriter Effect */}
            <div className="flex items-center gap-3 mt-1 opacity-90 h-6">
                <span className="w-1 h-1 bg-cyber-neon rounded-full animate-pulse"></span>
                <span className="text-xs md:text-sm text-cyber-neon tracking-[0.25em] uppercase font-semibold whitespace-nowrap min-w-[20px] text-center">
                    {displayText}
                    <span className="animate-pulse border-r-2 border-cyber-neon ml-1 h-4 inline-block align-middle"></span>
                </span>
                <span className="w-1 h-1 bg-cyber-neon rounded-full animate-pulse"></span>
            </div>
        </div>

        {/* Bottom Decorative Data */}
        <div className="absolute bottom-10 flex flex-col items-center gap-1 opacity-30">
            <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-gray-500 mb-2"></div>
            <span className="text-[10px] text-gray-500 tracking-widest">SECURED BY GEMINI</span>
        </div>
      </div>
    </div>
  );
};
