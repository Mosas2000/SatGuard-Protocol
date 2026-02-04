/**
 * Dark Mode Theme System
 * Provides dark mode support with theme context
 */

import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
    theme: Theme;
    effectiveTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as Theme) || 'auto';
    });

    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const updateEffectiveTheme = () => {
            if (theme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setEffectiveTheme(prefersDark ? 'dark' : 'light');
            } else {
                setEffectiveTheme(theme);
            }
        };

        updateEffectiveTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateEffectiveTheme);
        return () => mediaQuery.removeEventListener('change', updateEffectiveTheme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    }, [effectiveTheme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const toggleTheme = () => {
        setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value= {{ theme, effectiveTheme, setTheme, toggleTheme }
}>
    { children }
    </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

export function ThemeToggle() {
    const { effectiveTheme, toggleTheme } = useTheme();

    return (
        <button
            onClick= { toggleTheme }
    className = "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    aria - label="Toggle theme"
        >
        <span className="text-2xl" >
            { effectiveTheme === 'light' ? '🌙' : '☀️'
}
</span>
    </button>
    );
}

/**
 * Dark mode color utilities
 */
export const darkModeColors = {
    background: {
        light: 'bg-white',
        dark: 'dark:bg-gray-900'
    },
    text: {
        light: 'text-gray-900',
        dark: 'dark:text-gray-100'
    },
    border: {
        light: 'border-gray-200',
        dark: 'dark:border-gray-700'
    },
    card: {
        light: 'bg-white',
        dark: 'dark:bg-gray-800'
    }
};

/**
 * Get theme-aware color
 */
export function getThemeColor(lightColor: string, darkColor: string, theme: 'light' | 'dark'): string {
    return theme === 'light' ? lightColor : darkColor;
}
