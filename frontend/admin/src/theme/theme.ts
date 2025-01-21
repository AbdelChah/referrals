import { createTheme } from '@mui/material/styles';

// Default theme
export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Default Primary color
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f4f6f8',
    },
  },
});

// Bob theme
export const bobTheme = createTheme({
  palette: {
    primary: {
      main: '#FFD740', // Bob's yellow color
    },
    secondary: {
      main: '#FF9800',
    },
    background: {
      default: '#f9f9f9',
    },
  },
});

// Weepay theme
export const weepayTheme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0', // Weepay's purple color
    },
    secondary: {
      main: '#673AB7',
    },
    background: {
      default: '#f9f9f9',
    },
  },
});
