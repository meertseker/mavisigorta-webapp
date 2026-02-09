'use client';

import { motion } from 'framer-motion';
import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { springs } from '@/lib/spring-animations';

interface GlassInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const stateClasses = error
      ? 'border-apple-pink focus:border-apple-pink focus:ring-apple-pink/20'
      : success
      ? 'border-apple-green focus:border-apple-green focus:ring-apple-green/20'
      : 'border-white/30 dark:border-white/20 focus:border-apple-blue focus:ring-apple-blue/20';

    return (
      <div className="relative w-full">
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <motion.input
            ref={ref}
            type={type}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            className={`
              w-full
              backdrop-blur-xl bg-white/60 dark:bg-white/5
              border-2 ${stateClasses}
              rounded-2xl
              px-4 py-3
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon ? 'pr-12' : ''}
              ${label ? 'pt-6 pb-2' : ''}
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              shadow-glass
              transition-all duration-300
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            whileFocus={{ scale: 1.01 }}
            transition={springs.smooth}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <motion.label
              className={`
                absolute left-4 transition-all duration-300 pointer-events-none
                ${leftIcon ? 'left-12' : 'left-4'}
                ${
                  isFocused || hasValue || props.value
                    ? 'top-2 text-xs'
                    : 'top-1/2 -translate-y-1/2 text-base'
                }
                ${
                  error
                    ? 'text-apple-pink'
                    : success
                    ? 'text-apple-green'
                    : isFocused
                    ? 'text-apple-blue'
                    : 'text-gray-500 dark:text-gray-400'
                }
              `}
              initial={false}
              animate={{
                fontSize: isFocused || hasValue || props.value ? '0.75rem' : '1rem',
                top: isFocused || hasValue || props.value ? '0.5rem' : '50%',
                y: isFocused || hasValue || props.value ? 0 : '-50%',
              }}
              transition={springs.snappy}
            >
              {label}
            </motion.label>
          )}

          {/* Right Icon / Status Icon */}
          {(rightIcon || error || success) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              {error ? (
                <svg
                  className="w-5 h-5 text-apple-pink"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : success ? (
                <motion.svg
                  className="w-5 h-5 text-apple-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={springs.bouncy}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </motion.svg>
              ) : (
                rightIcon
              )}
            </div>
          )}

          {/* Glass reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
        </div>

        {/* Helper Text / Error Message / Success Message */}
        {(error || success || helperText) && (
          <motion.p
            className={`
              mt-2 text-sm px-4
              ${error ? 'text-apple-pink' : success ? 'text-apple-green' : 'text-gray-500 dark:text-gray-400'}
            `}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.smooth}
          >
            {error || success || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;
