import { create } from 'zustand';
import { randomColor, getHarmonies, getAllFormats } from '../utils/colorUtils';

const initialColor = '#3B82F6';

export const useColorStore = create((set) => ({
  // Current color
  currentColor: initialColor,

  // Color mode for wheel
  colorMode: 'hsl', // hsl, hsv, rgb

  // Color formats cache
  colorFormats: getAllFormats(initialColor),

  // Harmonies cache
  harmonies: getHarmonies(initialColor),

  // Selected harmony type
  selectedHarmony: 'complementary',

  // Actions
  setCurrentColor: (color) => set({
    currentColor: color,
    colorFormats: getAllFormats(color),
    harmonies: getHarmonies(color),
  }),

  setColorMode: (mode) => set({ colorMode: mode }),

  setSelectedHarmony: (harmony) => set({ selectedHarmony: harmony }),

  randomizeColor: () => {
    const color = randomColor();
    set({
      currentColor: color,
      colorFormats: getAllFormats(color),
      harmonies: getHarmonies(color),
    });
  },
}));
