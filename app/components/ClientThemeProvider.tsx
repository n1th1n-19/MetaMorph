'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00a8e8',
    },
    secondary: {
      main: '#667eea',
    },
    background: {
      default: '#0c0c0c',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Gugi", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    h1: {
      fontFamily: '"Gugi", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: '"Gugi", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    h3: {
      fontFamily: '"Gugi", sans-serif',
      fontWeight: 400,
    },
    h4: {
      fontFamily: '"Gugi", sans-serif',
      fontWeight: 400,
    },
    h5: {
      fontFamily: '"Gugi", sans-serif',
      fontWeight: 400,
    },
    h6: {
      fontFamily: '"Gugi", sans-serif',
      fontWeight: 400,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Gugi", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    overline: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.08em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Gugi", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
          fontOpticalSizing: 'auto',
          fontFeatureSettings: '"liga" 1, "calt" 1',
          scrollbarWidth: 'thin',
          scrollbarColor: '#333 #0c0c0c',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0c0c0c',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#333',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        },
      },
    },
  },
});

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}