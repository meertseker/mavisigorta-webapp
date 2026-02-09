'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to determine if glass effects should be enabled based on device capabilities
 * Helps with performance optimization
 */
export function useGlassEffects() {
  const [canUseGlass, setCanUseGlass] = useState(true);
  const [glassLevel, setGlassLevel] = useState<'full' | 'reduced' | 'minimal'>('full');

  useEffect(() => {
    // Check if running on server
    if (typeof window === 'undefined') {
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check device capabilities
    const userAgent = navigator.userAgent.toLowerCase();
    const isLowEndDevice = /android|webos|blackberry|iemobile|opera mini/i.test(userAgent);
    const isOldBrowser = !/chrome|firefox|safari|edge/i.test(userAgent);
    
    // Check for GPU acceleration support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;
    
    // Determine glass effect level
    if (prefersReducedMotion || isOldBrowser || !hasWebGL) {
      setCanUseGlass(false);
      setGlassLevel('minimal');
    } else if (isLowEndDevice) {
      setCanUseGlass(true);
      setGlassLevel('reduced');
    } else {
      setCanUseGlass(true);
      setGlassLevel('full');
    }

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setCanUseGlass(false);
        setGlassLevel('minimal');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { canUseGlass, glassLevel };
}

/**
 * Hook to get responsive glass blur levels
 */
export function useResponsiveGlass() {
  const [blurLevel, setBlurLevel] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateBlurLevel = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBlurLevel('mobile');
      } else if (width < 1024) {
        setBlurLevel('tablet');
      } else {
        setBlurLevel('desktop');
      }
    };

    updateBlurLevel();
    window.addEventListener('resize', updateBlurLevel);
    return () => window.removeEventListener('resize', updateBlurLevel);
  }, []);

  const blurClasses = {
    mobile: 'backdrop-blur-md',
    tablet: 'backdrop-blur-lg',
    desktop: 'backdrop-blur-xl',
  };

  return { blurLevel, blurClass: blurClasses[blurLevel] };
}

/**
 * Hook for performance-conscious animations
 */
export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceMotion;
}

/**
 * Hook to detect if device is in dark mode
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check initial theme
    const checkDarkMode = () => {
      const darkModeClass = document.documentElement.classList.contains('dark');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(darkModeClass || prefersDark);
    };

    checkDarkMode();

    // Watch for class changes on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkDarkMode();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return { isDark, toggleDarkMode };
}
