import { useState } from 'react';
import { Heart, Download, ExternalLink, User } from 'lucide-react';
import { useFavoritesStore } from '../../stores';
import { trackDownload } from '../../services/unsplashService';

export const ImageCard = ({ image, onClick }) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const favorite = isFavorite(image.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(image);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    // Track download for Unsplash
    if (image.links?.downloadLocation) {
      await trackDownload(image.links.downloadLocation);
    }
    // Open download URL
    window.open(image.urls.full, '_blank');
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: image.color || '#e5e7eb' }}
        />
      )}

      {/* Image */}
      <img
        src={image.urls.small}
        alt={image.description || image.altDescription || 'Reference image'}
        className={`w-full h-full object-cover transition-all duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${isHovered ? 'scale-105' : 'scale-100'}`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              favorite
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-2 text-white">
            <img
              src={image.user?.profileImage?.small}
              alt={image.user?.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium truncate">
              {image.user?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
