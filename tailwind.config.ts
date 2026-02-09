import type { Config } from "tailwindcss";

// Mavi Sigorta - Blue color scheme
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Apple Liquid Glass Color System
        glass: {
          white: 'rgba(255, 255, 255, 0.7)',
          'white-80': 'rgba(255, 255, 255, 0.8)',
          'white-60': 'rgba(255, 255, 255, 0.6)',
          'white-40': 'rgba(255, 255, 255, 0.4)',
          'white-20': 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.3)',
          'dark-50': 'rgba(0, 0, 0, 0.5)',
          'dark-70': 'rgba(0, 0, 0, 0.7)',
          blur: 'rgba(255, 255, 255, 0.18)',
        },
        // Blue-Centered Professional Color Palette (Mavi Sigorta)
        primary: {
          red: '#0066CC', // Parlak Mavi (bright blue)
          'red-dark': '#004C99', // Koyu Mavi (dark blue)
          'red-light': '#3399FF', // Açık Mavi (light blue)
          crimson: '#0052A3', // Royal Blue
          scarlet: '#0073E6', // Vivid Blue
        },
        secondary: {
          orange: '#00A3E0', // Açık Cyan (light cyan)
          'orange-dark': '#0088CC', // Orta Cyan (medium cyan)
          amber: '#33B8FF', // Sky Blue
          'amber-dark': '#0099CC', // Teal Blue
          gold: '#66C2FF', // Pastel Blue
        },
        accent: {
          rose: '#0099FF', // Bright Accent Blue
          'rose-dark': '#0066CC', // Dark Accent Blue
          coral: '#66B3FF', // Soft Blue
          burgundy: '#003D7A', // Navy Blue
          wine: '#002952', // Deep Navy
        },
        // Legacy Apple colors (keeping for compatibility)
        apple: {
          blue: '#007AFF',
          'blue-dark': '#0A84FF',
          green: '#34C759',
          'green-dark': '#30D158',
          orange: '#FF9500',
          'orange-dark': '#FF9F0A',
          purple: '#AF52DE',
          'purple-dark': '#BF5AF2',
          pink: '#FF2D55',
          'pink-dark': '#FF375F',
          teal: '#5AC8FA',
          'teal-dark': '#64D2FF',
          indigo: '#5856D6',
          'indigo-dark': '#5E5CE6',
        },
        depth: {
          surface: 'rgba(255, 255, 255, 0.8)',
          elevated: 'rgba(255, 255, 255, 0.95)',
          floating: 'rgba(255, 255, 255, 1)',
          'dark-surface': 'rgba(28, 28, 30, 0.7)',
          'dark-elevated': 'rgba(28, 28, 30, 0.85)',
          'dark-floating': 'rgba(28, 28, 30, 0.95)',
        },
        // Legacy colors (keeping for compatibility)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#34C759',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF9500',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 0% 0%, var(--tw-gradient-stops))',
        'glass-reflection': 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      backdropSaturate: {
        180: '1.8',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.12)',
        'glass-xl': '0 20px 64px rgba(0, 0, 0, 0.16)',
        'glass-inner': 'inset 0 1px 1px rgba(255, 255, 255, 0.5)',
        'glow': '0 0 20px rgba(0, 102, 204, 0.4)',
        'glow-lg': '0 0 40px rgba(0, 102, 204, 0.5)',
        'glow-red': '0 0 30px rgba(0, 102, 204, 0.6)',
        'glow-red-lg': '0 0 50px rgba(0, 102, 204, 0.7)',
        'glow-orange': '0 0 30px rgba(0, 163, 224, 0.5)',
        'glow-gold': '0 0 30px rgba(102, 194, 255, 0.5)',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.015em',
        normal: '0em',
        wide: '0.005em',
      },
    },
  },
  plugins: [],
};

export default config;
