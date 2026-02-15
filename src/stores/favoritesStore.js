import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/constants';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      // Favorite images from reference search
      favorites: [],

      // Actions
      addFavorite: (image) => set((state) => {
        // Check if already favorited
        if (state.favorites.some(f => f.id === image.id)) {
          return state;
        }
        return {
          favorites: [{ ...image, addedAt: Date.now() }, ...state.favorites],
        };
      }),

      removeFavorite: (imageId) => set((state) => ({
        favorites: state.favorites.filter(f => f.id !== imageId),
      })),

      toggleFavorite: (image) => {
        const { favorites } = get();
        const isFavorite = favorites.some(f => f.id === image.id);

        if (isFavorite) {
          set({ favorites: favorites.filter(f => f.id !== image.id) });
        } else {
          set({
            favorites: [{ ...image, addedAt: Date.now() }, ...favorites],
          });
        }
      },

      isFavorite: (imageId) => {
        const { favorites } = get();
        return favorites.some(f => f.id === imageId);
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
    }
  )
);
