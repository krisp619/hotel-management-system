/**
 * Design System - Hotel Management Frontend
 * Inspired by premium travel platforms (MakeMyTrip, Airbnb, Booking.com)
 */

export const colors = {
  // Primary - Trust & Travel (Deep Blue)
  primary: {
    50: '#f0f8ff',
    100: '#e0f1fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
    950: '#051c33',
  },

  // Secondary - Premium Orange (Action & Deals)
  secondary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },

  // Accent - Green (Success & Availability)
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
    950: '#0c2618',
  },

  // Error - Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#5e0505',
  },

  // Warning - Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  // Neutral - Grays
  gray: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
};

export const typography = {
  // Font families
  fonts: {
    display: "'Poppins', sans-serif", // Headings - Bold, friendly
    body: "'Inter', sans-serif", // Body text - Clean, readable
    mono: "'JetBrains Mono', monospace", // Code - Precision
  },

  // Font sizes (in rem)
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export const spacing = {
  // 8px base unit
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
};

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Elevation shadows
  elevation: {
    1: '0 1px 3px rgba(0, 0, 0, 0.08)',
    2: '0 3px 8px rgba(0, 0, 0, 0.12)',
    3: '0 8px 16px rgba(0, 0, 0, 0.16)',
    4: '0 12px 24px rgba(0, 0, 0, 0.20)',
    5: '0 16px 32px rgba(0, 0, 0, 0.24)',
  },

  // Hover effects
  hover: '0 10px 25px rgba(0, 0, 0, 0.15)',
};

export const borderRadius = {
  none: '0',
  xs: '0.25rem', // 4px
  sm: '0.375rem', // 6px
  base: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  full: '9999px',
};

export const transitions = {
  fast: '150ms ease-in-out',
  base: '250ms ease-in-out',
  slow: '350ms ease-in-out',
  
  // Specific properties
  property: {
    all: 'all',
    colors: 'background-color, border-color, color, fill, stroke',
    opacity: 'opacity',
    transform: 'transform',
    shadow: 'box-shadow',
  },
};

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Component variants
export const buttonVariants = {
  primary: {
    base: {
      background: colors.primary[600],
      color: colors.gray[0],
      border: 'none',
    },
    hover: {
      background: colors.primary[700],
      boxShadow: shadows.elevation[2],
    },
    active: {
      background: colors.primary[800],
    },
    disabled: {
      background: colors.gray[300],
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },

  secondary: {
    base: {
      background: colors.secondary[500],
      color: colors.gray[0],
      border: 'none',
    },
    hover: {
      background: colors.secondary[600],
      boxShadow: shadows.elevation[2],
    },
    active: {
      background: colors.secondary[700],
    },
    disabled: {
      background: colors.gray[300],
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },

  outline: {
    base: {
      background: 'transparent',
      border: `2px solid ${colors.primary[600]}`,
      color: colors.primary[600],
    },
    hover: {
      background: colors.primary[50],
      borderColor: colors.primary[700],
    },
    active: {
      background: colors.primary[100],
      borderColor: colors.primary[800],
    },
    disabled: {
      borderColor: colors.gray[300],
      color: colors.gray[400],
      cursor: 'not-allowed',
    },
  },

  text: {
    base: {
      background: 'transparent',
      color: colors.primary[600],
      border: 'none',
    },
    hover: {
      color: colors.primary[700],
      background: colors.primary[50],
    },
    active: {
      color: colors.primary[800],
    },
    disabled: {
      color: colors.gray[400],
      cursor: 'not-allowed',
    },
  },
};

export const cardVariants = {
  elevated: {
    base: {
      background: colors.gray[0],
      boxShadow: shadows.elevation[1],
      borderRadius: borderRadius.lg,
    },
    hover: {
      boxShadow: shadows.elevation[3],
    },
  },

  outlined: {
    base: {
      background: colors.gray[0],
      border: `1px solid ${colors.gray[200]}`,
      borderRadius: borderRadius.lg,
    },
    hover: {
      borderColor: colors.primary[300],
      boxShadow: shadows.md,
    },
  },

  flat: {
    base: {
      background: colors.gray[50],
      border: 'none',
      borderRadius: borderRadius.lg,
    },
    hover: {
      background: colors.gray[100],
    },
  },
};

export const inputVariants = {
  default: {
    borderColor: colors.gray[300],
    focusBorderColor: colors.primary[500],
    focusShadow: `0 0 0 3px ${colors.primary[50]}, 0 0 0 1px ${colors.primary[500]}`,
  },

  error: {
    borderColor: colors.error[500],
    focusBorderColor: colors.error[600],
    focusShadow: `0 0 0 3px ${colors.error[50]}, 0 0 0 1px ${colors.error[500]}`,
  },

  success: {
    borderColor: colors.accent[500],
    focusBorderColor: colors.accent[600],
    focusShadow: `0 0 0 3px ${colors.accent[50]}, 0 0 0 1px ${colors.accent[500]}`,
  },

  warning: {
    borderColor: colors.warning[500],
    focusBorderColor: colors.warning[600],
    focusShadow: `0 0 0 3px ${colors.warning[50]}, 0 0 0 1px ${colors.warning[500]}`,
  },
};

// Why these choices fit hotel booking:
// - Primary Blue: Trust, security (users share payment info)
// - Secondary Orange: Urgency, limited availability (drives bookings)
// - Accent Green: Availability confirmed, safe to proceed
// - Poppins: Friendly, modern (appeals to travelers)
// - Inter: Readable at all sizes (important for mobile)
// - Elevation shadows: Premium feel, visual hierarchy

export default {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  transitions,
  breakpoints,
  buttonVariants,
  cardVariants,
  inputVariants,
};
