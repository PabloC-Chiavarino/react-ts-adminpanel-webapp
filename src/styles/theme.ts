import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const darkPalette = {
    primary: { main: '#7858f5' },
    secondary: { main: '#613affbb' },
    tertiary: { main: '#b2a1ff' },

    background: {
        default: '#0e0e11',
        alt: '#3d3d494d',
        alt2: '#201f23',
        paper: '#131316',
        paper2: '#19191d',
    },

    text: {
        primary: '#f0edf1',
        secondary: '#959397',
    }
};

const lightPalette = {
    primary: { main: '#7388faff' },
    secondary: { main: '#6177f8ff' },
    tertiary: { main: '#5c6bc0' },

    background: {
        default: '#fafbfd',
        paper: '#ffffffff',
        alt: '#f4f5f9',
        alt2: '#f0f1f5',
        paper2: '#ffffff',
    },

    text: {
        primary: '#1f2937',
        secondary: '#666666',
    }
};

const darkPriorityStyles = {
    high: { bg: '#302127', color: '#e16276' },
    medium: { bg: '#282634', color: '#b2a1ff' },
    low: { bg: '#464556', color: '#b8b7cb' },
};

const lightPriorityStyles = {
    high: { bg: '#fce4ec', color: '#c62828' },
    medium: { bg: '#ede7f6', color: '#4527a0' },
    low: { bg: '#e8f5e9', color: '#2e7d32' },
};

export const getDesignTokens = (mode: PaletteMode) => ({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1024,
            xl: 1536,
        },
    },
    palette: {
        mode,
        ...(mode === 'dark' ? darkPalette : lightPalette),
        priorityStyles: mode === 'dark' ? darkPriorityStyles : lightPriorityStyles,
        categoryStyles: {
            review: {
                color: '#62b8f5'
            },
            meeting: {
                color: '#5dd6b5'
            },
            design: {
                color: '#f0a05a'
            },
            development: {
                color: '#b2a1ff'
            },
            release: {
                color: '#e16276'
            }
        }
    },
    typography: {
        h1: { fontFamily: 'Manrope', fontWeight: 800, fontSize: '2.5rem', letterSpacing: "-0.05em", color: 'text.primary' },
        fontFamily: '"Inter", sans-serif',
        button: { textTransform: 'none' as const, fontWeight: 600 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                body: {
                    transition: 'background-color 0.25s ease color 0.25s ease',
                },
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    transition: 'background-color 0.25s ease',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'dark'
                        ? '0px 4px 20px rgba(0, 0, 0, 0.4)'
                        : '0px 4px 20px rgba(0, 0, 0, 0.05)',
                },
            },
        },
    },
});

export const theme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));
