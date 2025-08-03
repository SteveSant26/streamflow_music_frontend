import { ThemeOptions } from '@angular/material/core';

// Paleta de colores personalizada estilo Spotify
export const SPOTIFY_COLORS = {
  primary: {
    50: '#f0f9f3',
    100: '#dcf2e3',
    200: '#bce4ca',
    300: '#8dcfa7',
    400: '#56b37e',
    500: '#1db954', // Color principal de Spotify
    600: '#169c46',
    700: '#137d39',
    800: '#13642f',
    900: '#115228',
    A100: '#1ed760',
    A200: '#1db954',
    A400: '#169c46',
    A700: '#137d39'
  },
  accent: {
    50: '#ffffff',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    A100: '#ffffff',
    A200: '#eeeeee',
    A400: '#bdbdbd',
    A700: '#616161'
  }
};

// Tema claro estilo Spotify
export const LIGHT_THEME: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#404040',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1db954',
      light: '#56b37e',
      dark: '#137d39',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
    surface: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    text: {
      primary: '#000000',
      secondary: '#6a6a6a',
      disabled: '#b3b3b3',
    },
    divider: '#e0e0e0',
    action: {
      active: '#000000',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
    error: {
      main: '#e22134',
      light: '#ff5983',
      dark: '#a8001b',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffa724',
      light: '#ffd95b',
      dark: '#c77800',
      contrastText: '#000000',
    },
    info: {
      main: '#0d72ea',
      light: '#5ca3ff',
      dark: '#0044b7',
      contrastText: '#ffffff',
    },
    success: {
      main: '#1db954',
      light: '#56b37e',
      dark: '#137d39',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Circular Sp", "Circular Std", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.6875rem',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.03em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '500px',
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.875rem',
          padding: '8px 32px',
          transition: 'all 0.3s cubic-bezier(0.3, 0, 0, 1)',
          '&:hover': {
            transform: 'scale(1.04)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.3s cubic-bezier(0.3, 0, 0, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.3, 0, 0, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 4,
        },
        thumb: {
          width: 12,
          height: 12,
          '&:hover': {
            boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.16)',
          },
        },
        track: {
          border: 'none',
        },
        rail: {
          opacity: 0.3,
        },
      },
    },
  },
};

// Tema oscuro estilo Spotify
export const DARK_THEME: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#b3b3b3',
      contrastText: '#000000',
    },
    secondary: {
      main: '#1db954',
      light: '#56b37e',
      dark: '#137d39',
      contrastText: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    surface: {
      main: '#121212',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#535353',
    },
    divider: '#282828',
    action: {
      active: '#ffffff',
      hover: 'rgba(255, 255, 255, 0.04)',
      selected: 'rgba(255, 255, 255, 0.08)',
      disabled: 'rgba(255, 255, 255, 0.26)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
    error: {
      main: '#e22134',
      light: '#ff5983',
      dark: '#a8001b',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffa724',
      light: '#ffd95b',
      dark: '#c77800',
      contrastText: '#000000',
    },
    info: {
      main: '#8ab4f8',
      light: '#c4d7ff',
      dark: '#5584c5',
      contrastText: '#000000',
    },
    success: {
      main: '#1db954',
      light: '#56b37e',
      dark: '#137d39',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Circular Sp", "Circular Std", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.6875rem',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.03em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '500px',
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.875rem',
          padding: '8px 32px',
          transition: 'all 0.3s cubic-bezier(0.3, 0, 0, 1)',
          '&:hover': {
            transform: 'scale(1.04)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.3s cubic-bezier(0.3, 0, 0, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.3, 0, 0, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 4,
        },
        thumb: {
          width: 12,
          height: 12,
          '&:hover': {
            boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
          },
        },
        track: {
          border: 'none',
        },
        rail: {
          opacity: 0.3,
        },
      },
    },
  },
};
