/**
 * Apple Liquid Glass Effect Utilities
 * Inspired by iOS 26 Liquid Glass Design System
 */

export const glassEffects = {
  // Card variants
  card: {
    surface: 'backdrop-blur-lg bg-white/60 dark:bg-depth-dark-surface border border-white/20 dark:border-white/10 shadow-glass',
    elevated: 'backdrop-blur-xl bg-white/70 dark:bg-depth-dark-elevated border border-white/20 dark:border-white/10 shadow-glass-lg',
    floating: 'backdrop-blur-2xl bg-white/80 dark:bg-depth-dark-floating border border-white/30 dark:border-white/15 shadow-glass-xl',
  },
  
  // Navigation variants
  navbar: {
    default: 'backdrop-blur-sm bg-transparent border-b border-transparent',
    scrolled: 'backdrop-blur-xl bg-primary-red/80 border-b border-primary-red/30 shadow-glow-red',
  },
  
  // Button variants  
  button: {
    primary: 'backdrop-blur-xl bg-gradient-to-r from-primary-red to-secondary-orange hover:from-primary-red-dark hover:to-secondary-orange-dark text-white shadow-glow-red hover:shadow-glow-red-lg transition-all duration-300',
    secondary: 'backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 shadow-glass hover:shadow-glass-lg transition-all duration-300',
    ghost: 'backdrop-blur-lg bg-transparent hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-300',
  },
  
  // Surface backgrounds
  surface: {
    light: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
    mesh: 'bg-gradient-mesh from-primary-red/15 via-secondary-orange/10 to-accent-rose/10',
    gradient: 'bg-gradient-to-br from-primary-red/20 via-secondary-orange/20 to-secondary-gold/20',
  },
  
  // Input fields
  input: {
    default: 'backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/30 dark:border-white/20 focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 shadow-glass transition-all duration-300',
    error: 'backdrop-blur-xl bg-white/60 dark:bg-white/5 border-2 border-primary-red focus:border-primary-red-dark focus:ring-2 focus:ring-primary-red/20 shadow-glass',
    success: 'backdrop-blur-xl bg-white/60 dark:bg-white/5 border-2 border-secondary-orange focus:border-secondary-orange-dark focus:ring-2 focus:ring-secondary-orange/20 shadow-glass',
  },
};

// Utility function to combine glass classes
export const glassClass = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Glass card wrapper
export const glassCard = (level: 'surface' | 'elevated' | 'floating' = 'elevated') => {
  return glassEffects.card[level];
};

// Glass surface wrapper  
export const glassSurface = (type: 'light' | 'mesh' | 'gradient' = 'light') => {
  return glassEffects.surface[type];
};

// Glass navbar wrapper
export const glassNavbar = (scrolled: boolean = false) => {
  return scrolled ? glassEffects.navbar.scrolled : glassEffects.navbar.default;
};

// Glass button wrapper
export const glassButton = (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
  return glassEffects.button[variant];
};

// Glass input wrapper
export const glassInput = (state: 'default' | 'error' | 'success' = 'default') => {
  return glassEffects.input[state];
};

// Lens effect (light bending simulation)
export const lensEffect = {
  hover: 'transition-all duration-300 hover:backdrop-blur-2xl hover:backdrop-saturate-180',
  active: 'transition-all duration-150 backdrop-blur-xl backdrop-saturate-150',
};

// Glow effects
export const glowEffect = {
  subtle: 'shadow-[0_0_20px_rgba(0,102,204,0.3)]',
  medium: 'shadow-[0_0_30px_rgba(0,102,204,0.4)]',
  strong: 'shadow-[0_0_40px_rgba(0,102,204,0.5)]',
  pulse: 'animate-glow-pulse shadow-[0_0_30px_rgba(0,102,204,0.4)]',
};

// Reflection overlay
export const reflectionOverlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none before:rounded-inherit';

// Edge glow
export const edgeGlow = 'relative after:absolute after:inset-0 after:rounded-inherit after:p-[1px] after:bg-gradient-to-br after:from-white/50 after:via-transparent after:to-white/30 after:-z-10 after:blur-sm';

// Shimmer effect
export const shimmerEffect = 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-shimmer';

// Glass elevation levels (z-index coordination)
export const glassElevation = {
  base: 'z-0',
  surface: 'z-10',
  elevated: 'z-20',
  floating: 'z-30',
  overlay: 'z-40',
  modal: 'z-50',
};

// Responsive glass (performance optimized)
export const responsiveGlass = {
  mobile: 'backdrop-blur-md', // Reduced for performance
  tablet: 'md:backdrop-blur-lg',
  desktop: 'lg:backdrop-blur-xl',
  full: 'xl:backdrop-blur-2xl',
};
