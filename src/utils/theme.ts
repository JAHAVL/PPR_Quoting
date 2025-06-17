/**
 * PPR Quoting Software Theme Configuration
 * 
 * This file contains the central theme configuration for the Paver Pressure and Repair
 * quoting application, including colors, spacing, typography, and other design tokens.
 */

export const theme = {
  // Brand Colors
  colors: {
    primary: '#1e73be', // Primary blue color
    secondary: '#23a455', // Secondary green color
    accent: '#ff6b00', // Orange accent
    dark: '#333333',
    light: '#f7f7f7',
    gray: '#6c757d',
    border: '#e0e0e0',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    shadow: 'rgba(0, 0, 0, 0.1)',
    white: '#ffffff',
  },
  
  // Typography
  typography: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px',
  },
  
  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    toast: 1600,
    tooltip: 1700,
  },
  
  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Touch target minimum sizes (for mobile optimization)
  touchTarget: {
    minHeight: '44px',
    minWidth: '44px',
  },
};

/**
 * Helper function to access theme values with dot notation
 * Example: getThemeValue('colors.primary') returns the primary color
 */
export const getThemeValue = (path: string): any => {
  const keys = path.split('.');
  return keys.reduce((obj, key) => {
    return obj && obj[key] !== undefined ? obj[key] : undefined;
  }, theme as any);
};

export default theme;
