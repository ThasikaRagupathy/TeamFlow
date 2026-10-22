'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] =
    useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      'teamflow-theme'
    ) as Theme | null;

    if (
      savedTheme === 'light' ||
      savedTheme === 'dark' ||
      savedTheme === 'system'
    ) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      const actualTheme =
        theme === 'system'
          ? systemDark
            ? 'dark'
            : 'light'
          : theme;

      root.classList.remove('light', 'dark');
      root.classList.add(actualTheme);

      root.setAttribute('data-theme', actualTheme);

      setResolvedTheme(actualTheme);
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
      );

      mediaQuery.addEventListener('change', applyTheme);

      return () => {
        mediaQuery.removeEventListener(
          'change',
          applyTheme
        );
      };
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('teamflow-theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  }

  return context;
};