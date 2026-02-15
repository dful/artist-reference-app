import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/constants';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const usePaletteStore = create(
  persist(
    (set, get) => ({
      // Saved palettes
      palettes: [],

      // Current working palette
      currentPalette: {
        id: generateId(),
        name: 'New Palette',
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      },

      // Actions
      setCurrentPalette: (palette) => set({ currentPalette: palette }),

      updateCurrentPaletteName: (name) => set((state) => ({
        currentPalette: { ...state.currentPalette, name },
      })),

      updateCurrentPaletteColors: (colors) => set((state) => ({
        currentPalette: { ...state.currentPalette, colors },
      })),

      addColorToCurrentPalette: (color) => set((state) => ({
        currentPalette: {
          ...state.currentPalette,
          colors: [...state.currentPalette.colors, color],
        },
      })),

      removeColorFromCurrentPalette: (index) => set((state) => ({
        currentPalette: {
          ...state.currentPalette,
          colors: state.currentPalette.colors.filter((_, i) => i !== index),
        },
      })),

      updateColorInCurrentPalette: (index, color) => set((state) => ({
        currentPalette: {
          ...state.currentPalette,
          colors: state.currentPalette.colors.map((c, i) => i === index ? color : c),
        },
      })),

      saveCurrentPalette: () => {
        const { currentPalette, palettes } = get();
        const existingIndex = palettes.findIndex(p => p.id === currentPalette.id);

        if (existingIndex >= 0) {
          // Update existing palette
          set({
            palettes: palettes.map((p, i) =>
              i === existingIndex ? currentPalette : p
            ),
          });
        } else {
          // Add new palette
          set({ palettes: [...palettes, { ...currentPalette, id: generateId() }] });
        }
      },

      deletePalette: (id) => set((state) => ({
        palettes: state.palettes.filter(p => p.id !== id),
      })),

      duplicatePalette: (id) => {
        const { palettes } = get();
        const palette = palettes.find(p => p.id === id);
        if (palette) {
          const newPalette = {
            ...palette,
            id: generateId(),
            name: `${palette.name} (Copy)`,
          };
          set({ palettes: [...palettes, newPalette] });
        }
      },

      loadPalette: (id) => {
        const { palettes } = get();
        const palette = palettes.find(p => p.id === id);
        if (palette) {
          set({ currentPalette: { ...palette } });
        }
      },

      newPalette: () => set({
        currentPalette: {
          id: generateId(),
          name: 'New Palette',
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        },
      }),
    }),
    {
      name: STORAGE_KEYS.PALETTES,
    }
  )
);
