import { Modal } from '../common';
import { Heart, Download, ExternalLink, X } from 'lucide-react';
import { useFavoritesStore } from '../../stores';
import { trackDownload } from '../../services/unsplashService';
import { useState } from 'react';

export const ImageModal = ({ image, isOpen, onClose }) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!image) return null;

  const favorite = isFavorite(image.id);

  const handleDownload = async () => {
    if (image.links?.downloadLocation) {
      await trackDownload(image.links.downloadLocation);
    }
    window.open(image.urls.full, '_blank');
  };

  const handleOpenUnsplash = () => {
    window.open(image.links?.html, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" showClose={false}>
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div
          className="relative bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden"
          style={{ maxHeight: '70vh' }}
        >
          {!imageLoaded && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{ backgroundColor: image.color || '#e5e7eb' }}
            />
          )}
          <img
            src={image.urls.regular}
            alt={image.description || image.altDescription || 'Reference image'}
            className={`w-full h-auto max-h-[70vh] object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Info bar */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Photographer */}
            <a
              href={`https://unsplash.com/@${image.user?.username}?utm_source=artist-reference&utm_medium=referral`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={image.user?.profileImage?.medium}
                alt={image.user?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {image.user?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{image.user?.username}
                </p>
              </div>
            </a>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(image)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  favorite
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
                {favorite ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleOpenUnsplash}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Attribution */}
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-center">
            Photo by{' '}
            <a
              href={`https://unsplash.com/@${image.user?.username}?utm_source=artist-reference&utm_medium=referral`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              {image.user?.name}
            </a>{' '}
            on{' '}
            <a
              href="https://unsplash.com/?utm_source=artist-reference&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
};
