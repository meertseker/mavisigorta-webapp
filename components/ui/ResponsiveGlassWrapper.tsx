'use client';

import { useGlassEffects, useResponsiveGlass } from '@/lib/hooks/useGlassEffects';
import { ReactNode } from 'react';

interface ResponsiveGlassWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component that adapts glass effects based on device capabilities
 * Provides graceful degradation for low-end devices
 */
export default function ResponsiveGlassWrapper({
  children,
  fallback,
}: ResponsiveGlassWrapperProps) {
  const { canUseGlass, glassLevel } = useGlassEffects();
  const { blurLevel } = useResponsiveGlass();

  // If glass effects are disabled and fallback is provided, show fallback
  if (!canUseGlass && fallback) {
    return <>{fallback}</>;
  }

  // Add appropriate classes based on glass level
  const glassClasses = {
    full: 'glass-full',
    reduced: 'glass-reduced',
    minimal: 'glass-minimal',
  };

  const deviceClasses = {
    mobile: 'glass-mobile',
    tablet: 'glass-tablet',
    desktop: 'glass-desktop',
  };

  return (
    <div
      className={`${glassClasses[glassLevel]} ${deviceClasses[blurLevel]}`}
      data-glass-level={glassLevel}
      data-blur-level={blurLevel}
    >
      {children}
    </div>
  );
}

/**
 * Hook-based approach for conditional glass rendering
 */
export function useConditionalGlass() {
  const { canUseGlass, glassLevel } = useGlassEffects();
  const { blurLevel, blurClass } = useResponsiveGlass();

  const getGlassClass = (baseClass: string) => {
    if (!canUseGlass) {
      // Fallback to solid backgrounds
      return baseClass.replace(/backdrop-blur-\w+/, 'bg-white dark:bg-gray-900');
    }

    // Adjust blur based on device
    if (glassLevel === 'reduced') {
      return baseClass.replace(/backdrop-blur-\w+/, blurClass);
    }

    return baseClass;
  };

  return {
    canUseGlass,
    glassLevel,
    blurLevel,
    blurClass,
    getGlassClass,
  };
}
