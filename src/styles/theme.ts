import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const darkPalette = {
    primary: { main: '#631fbdff' },
    secondary: { main: '#611db9bb' },

    background: {
        default: '#1f2029',
        paper: '#2b2c3d',
    },

    text: {
        primary: '#e6ebffff',
        secondary: '#a9b1d6',
    }
};

const lightPalette = {
    primary: { main: '#7388faff' },
    secondary: { main: '#6177f8ff' },

    background: {
        default: '#f1f1f1ff',
        paper: '#ffffffff',
    },

    text: {
        primary: '#1f2937',
        secondary: '#bdbdbdff',
    }
};

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'dark' ? darkPalette : lightPalette),
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h6: { fontWeight: 600 },
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
