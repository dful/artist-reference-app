import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/constants';
import { useEffect } from 'react';

// Helper to apply theme to DOM
const applyThemeToDOM = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'light' or 'dark'

      setTheme: (theme) => {
        set({ theme });
        applyThemeToDOM(theme);
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        applyThemeToDOM(newTheme);
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
    }
  )
);

// Hook to initialize theme on app load
export const useThemeInit = () => {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    // Apply stored theme or system preference on initial load
    const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (storedTheme) {
      try {
        const parsed = JSON.parse(storedTheme);
        const savedTheme = parsed.state?.theme;
        if (savedTheme) {
          setTheme(savedTheme);
          return;
        }
      } catch {
        // Ignore parse errors
      }
    }

    // Fall back to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, [setTheme]);
};
