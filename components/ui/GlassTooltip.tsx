'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { springs, scaleAnimation } from '@/lib/spring-animations';

interface GlassTooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function GlassTooltip({
  content,
  children,
  position = 'top',
  delay = 300,
}: GlassTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({ x: rect.left, y: rect.top });
      }
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-white/90 dark:border-t-depth-dark-floating',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-white/90 dark:border-b-depth-dark-floating',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-white/90 dark:border-l-depth-dark-floating',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-white/90 dark:border-r-depth-dark-floating',
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={scaleAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute ${positionClasses[position]} z-50 pointer-events-none`}
          >
            <div className="relative backdrop-blur-2xl bg-white/90 dark:bg-depth-dark-floating rounded-xl px-3 py-2 shadow-glass-lg border border-white/30 dark:border-white/20 overflow-hidden whitespace-nowrap">
              {/* Glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />

              {/* Content */}
              <div className="relative text-sm text-gray-900 dark:text-white font-medium">
                {content}
              </div>

              {/* Arrow */}
              <div
                className={`absolute ${arrowClasses[position]} w-0 h-0 border-4 border-transparent`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
