
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  position = 'right', 
  children, 
  className = '',
  delay = 100
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 12; // Distance from trigger

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = rect.top - gap;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + gap;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - gap;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + gap;
          break;
      }
      setCoords({ top, left });
    }
  };

  const show = () => {
    updatePosition();
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
      if (isVisible) {
          window.addEventListener('scroll', updatePosition, true);
          window.addEventListener('resize', updatePosition);
          return () => {
              window.removeEventListener('scroll', updatePosition, true);
              window.removeEventListener('resize', updatePosition);
          }
      }
  }, [isVisible]);

  const getTransform = () => {
      switch(position) {
          case 'top': return 'translate(-50%, -100%)';
          case 'bottom': return 'translate(-50%, 0)';
          case 'left': return 'translate(-100%, -50%)';
          case 'right': return 'translate(0, -50%)';
      }
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div 
            className={`fixed z-[9999] pointer-events-none transition-all duration-200 ease-out ${className}`}
            style={{ 
                top: coords.top, 
                left: coords.left,
                transform: getTransform(),
                opacity: isVisible ? 1 : 0,
                // Subtle scale effect on enter
                scale: isVisible ? '1' : '0.95',
                filter: isVisible ? 'blur(0px)' : 'blur(4px)'
            }}
        >
            <div className="relative">
                {/* Neon Glow Background */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-600 via-pink-500 to-cyber-neon rounded opacity-70 blur-[4px]"></div>
                
                {/* Main Content Box */}
                <div className="relative bg-[#050505] border border-white/10 px-3 py-1.5 rounded-sm shadow-2xl flex items-center gap-2 min-w-max">
                     {/* Decorative Accent Bar */}
                     <div className="w-0.5 h-3 bg-cyber-neon rounded-full shadow-[0_0_8px_#00f3ff]"></div>
                     
                     <span className="text-[10px] font-bold text-gray-100 uppercase tracking-[0.15em] font-mono leading-none pt-[1px] text-glow">
                        {content}
                     </span>
                </div>
            </div>
        </div>,
        document.body
      )}
    </>
  );
};
