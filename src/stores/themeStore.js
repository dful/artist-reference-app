import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/constants';
import { useEffect } from 'react';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'light' or 'dark'

      setTheme: (theme) => {
        set({ theme });
        // Apply to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        // Apply to document
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
    }
  )
);

// Hook to initialize theme on app load
export const useThemeInit = () => {
  const { theme, setTheme } = useThemeStore();

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
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Fall back to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, [setTheme]);
};
