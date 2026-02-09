'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { useState, useRef } from 'react';
import { springs } from '@/lib/spring-animations';
import { glassButton } from '@/lib/glass-effects';

interface RippleType {
  x: number;
  y: number;
  id: number;
}

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  onClick,
  ...props
}: GlassButtonProps) {
  const [ripples, setRipples] = useState<RippleType[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        x,
        y,
        id: Date.now(),
      };
      
      setRipples([...ripples, newRipple]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'backdrop-blur-xl bg-apple-blue hover:bg-apple-blue-dark dark:bg-apple-blue-dark text-white shadow-glow hover:shadow-glow-lg',
    secondary: 'backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 shadow-glass hover:shadow-glass-lg text-gray-900 dark:text-white',
    ghost: 'backdrop-blur-lg bg-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-900 dark:text-white',
    success: 'backdrop-blur-xl bg-apple-green hover:bg-apple-green-dark text-white shadow-[0_0_20px_rgba(52,199,89,0.3)] hover:shadow-[0_0_40px_rgba(52,199,89,0.4)]',
    warning: 'backdrop-blur-xl bg-apple-orange hover:bg-apple-orange-dark text-white shadow-[0_0_20px_rgba(255,149,0,0.3)] hover:shadow-[0_0_40px_rgba(255,149,0,0.4)]',
  };

  const baseClasses = `
    relative overflow-hidden
    rounded-2xl font-semibold
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:ring-offset-2
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  return (
    <motion.button
      ref={buttonRef}
      className={baseClasses}
      disabled={disabled || isLoading}
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={springs.smooth}
      {...props}
    >
      {/* Shimmer effect for loading */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 400, height: 400, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Yükleniyor...</span>
          </>
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </span>
    </motion.button>
  );
}
