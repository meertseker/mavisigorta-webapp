/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 * Apple-inspired accessible design
 */

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First color in hex format (#RRGGBB)
 * @param color2 - Second color in hex format (#RRGGBB)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const rgb = color
      .substring(1)
      .match(/.{2}/g)!
      .map((hex) => parseInt(hex, 16) / 255);

    const [r, g, b] = rgb.map((val) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
 */
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standard (7:1 for normal text, 4.5:1 for large text)
 */
export function meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Accessibility attributes for interactive elements
 */
export const a11yProps = {
  // For buttons
  button: (label: string, pressed?: boolean) => ({
    role: 'button',
    'aria-label': label,
    ...(pressed !== undefined && { 'aria-pressed': pressed }),
    tabIndex: 0,
  }),

  // For links
  link: (label: string, external = false) => ({
    'aria-label': label,
    ...(external && {
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': `${label} (opens in new tab)`,
    }),
  }),

  // For inputs
  input: (label: string, required = false, error?: string) => ({
    'aria-label': label,
    'aria-required': required,
    ...(error && {
      'aria-invalid': true,
      'aria-describedby': `${label}-error`,
    }),
  }),

  // For modals
  modal: (label: string) => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': `${label}-title`,
  }),

  // For tabs
  tab: (label: string, selected: boolean, index: number) => ({
    role: 'tab',
    'aria-label': label,
    'aria-selected': selected,
    'aria-controls': `panel-${index}`,
    id: `tab-${index}`,
    tabIndex: selected ? 0 : -1,
  }),

  tabPanel: (index: number) => ({
    role: 'tabpanel',
    'aria-labelledby': `tab-${index}`,
    id: `panel-${index}`,
    tabIndex: 0,
  }),
};

/**
 * Focus management utilities
 */
export const focusManagement = {
  // Trap focus within an element (for modals)
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },

  // Restore focus to previous element
  saveFocus: () => {
    const activeElement = document.activeElement as HTMLElement;
    return () => activeElement?.focus();
  },
};

/**
 * Screen reader announcements
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Keyboard navigation helpers
 */
export const keyboardNav = {
  // Handle arrow key navigation in lists
  handleArrowKeys: (
    e: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    options: { circular?: boolean; orientation?: 'horizontal' | 'vertical' } = {}
  ) => {
    const { circular = true, orientation = 'vertical' } = options;
    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    let newIndex = currentIndex;

    if (e.key === nextKey) {
      e.preventDefault();
      newIndex = currentIndex + 1;
      if (newIndex >= items.length) {
        newIndex = circular ? 0 : items.length - 1;
      }
    } else if (e.key === prevKey) {
      e.preventDefault();
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = circular ? items.length - 1 : 0;
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = items.length - 1;
    }

    items[newIndex]?.focus();
    return newIndex;
  },

  // Handle Enter and Space for custom buttons
  handleActivation: (e: KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },
};

/**
 * Touch target size checker (minimum 44x44px for mobile)
 */
export function hasAccessibleTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // 44px is Apple's recommended minimum
  return rect.width >= minSize && rect.height >= minSize;
}

/**
 * Skip navigation link component props
 */
export const skipNavProps = {
  href: '#main-content',
  className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-apple-blue text-white px-6 py-3 rounded-2xl z-50 font-semibold shadow-glass-lg',
  children: 'Ana içeriğe atla',
};
