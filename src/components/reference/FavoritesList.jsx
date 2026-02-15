import { useFavoritesStore } from '../../stores';
import { Card, CardContent, Button } from '../common';
import { Heart, Trash2, ExternalLink } from 'lucide-react';

export const FavoritesList = ({ onSelectImage }) => {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No favorite images
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Save images from your searches to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Saved Images ({favorites.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600"
          onClick={clearFavorites}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {favorites.map((image) => (
          <div
            key={image.id}
            className="group relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            <img
              src={image.urls.thumb}
              alt={image.description || 'Favorite image'}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onSelectImage(image)}
                  className="p-2 rounded-full bg-white/90 text-gray-900 hover:bg-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFavorite(image.id)}
                  className="p-2 rounded-full bg-white/90 text-red-500 hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photographer badge */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white truncate">{image.user?.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
