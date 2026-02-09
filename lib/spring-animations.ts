/**
 * Apple Liquid Glass Spring Animations
 * Physics-based animations for smooth, organic motion
 */

import { Transition, Variants } from 'framer-motion';

// Spring presets matching Apple's motion design
export const springs = {
  // Gentle spring for subtle interactions
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
    mass: 1,
  },
  
  // Smooth spring for standard interactions
  smooth: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
  
  // Snappy spring for quick responses
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 35,
    mass: 0.6,
  },
  
  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 350,
    damping: 20,
    mass: 0.7,
  },
  
  // Liquid spring for fluid glass effects
  liquid: {
    type: 'spring' as const,
    stiffness: 280,
    damping: 28,
    mass: 0.9,
  },
};

// Easing curves matching Apple's design
export const easings = {
  // Apple's standard ease
  standard: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
  
  // Deceleration curve
  decelerate: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
  
  // Acceleration curve  
  accelerate: [0.4, 0.0, 1, 1] as [number, number, number, number],
  
  // Sharp curve for quick actions
  sharp: [0.4, 0.0, 0.6, 1] as [number, number, number, number],
};

// Transition presets
export const transitions = {
  // Fast transition for micro-interactions
  fast: {
    duration: 0.2,
    ease: easings.standard,
  },
  
  // Standard transition
  standard: {
    duration: 0.3,
    ease: easings.standard,
  },
  
  // Slow transition for emphasis
  slow: {
    duration: 0.5,
    ease: easings.decelerate,
  },
  
  // Spring transition
  spring: springs.smooth,
};

// Glass-specific animations
export const glassAnimations = {
  // Hover effect with lift and blur
  hover: {
    scale: 1.02,
    y: -4,
    transition: springs.smooth,
  },
  
  // Press effect with subtle shrink
  press: {
    scale: 0.98,
    transition: springs.snappy,
  },
  
  // Lens distortion effect
  lensHover: {
    backdropFilter: 'blur(20px) saturate(180%)',
    transition: {
      duration: 0.3,
      ease: easings.standard,
    },
  },
  
  // Glow expansion
  glowExpand: {
    boxShadow: '0 0 40px rgba(0, 122, 255, 0.4)',
    transition: springs.gentle,
  },
};

// Entrance animations
export const entranceAnimations: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: springs.smooth,
  },
};

// Stagger children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Fade animations with blur
export const fadeBlur: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: easings.decelerate,
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: easings.accelerate,
    },
  },
};

// Scale animations
export const scaleAnimation: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: springs.bouncy,
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: springs.snappy,
  },
};

// Slide animations
export const slideUp: Variants = {
  hidden: {
    y: 50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: springs.smooth,
  },
};

export const slideDown: Variants = {
  hidden: {
    y: -50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: springs.smooth,
  },
};

// Floating animation (values only - use with separate transition prop)
export const floatingAnimation = {
  y: [-10, 10, -10],
};

// Floating animation transition config
export const floatingTransition: Transition = {
  duration: 6,
  repeat: Infinity,
  ease: easings.standard,
};

// Shimmer animation (values only - use with separate transition prop)
export const shimmerAnimation = {
  backgroundPosition: ['200% 0', '-200% 0'],
};

// Shimmer animation transition config
export const shimmerTransition: Transition = {
  duration: 2,
  repeat: Infinity,
  ease: 'linear',
};

// Ripple animation (for button press)
export const rippleAnimation = {
  scale: [0, 4],
  opacity: [0.5, 0],
  transition: {
    duration: 0.6,
    ease: easings.decelerate,
  },
};

// Gradient shift animation (values only - use with separate transition prop)
export const gradientShift = {
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
};

// Gradient shift transition config
export const gradientShiftTransition: Transition = {
  duration: 8,
  repeat: Infinity,
  ease: 'linear',
};

// Page transition
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: springs.snappy,
  },
};

// Modal animations
export const modalAnimation: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: springs.snappy,
  },
};

// Backdrop animation
export const backdropAnimation: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(20px)',
    transition: {
      duration: 0.3,
      ease: easings.standard,
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.2,
      ease: easings.accelerate,
    },
  },
};
