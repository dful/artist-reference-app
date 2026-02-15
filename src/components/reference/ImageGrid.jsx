import { useInView } from 'react-intersection-observer';
import { ImageCard } from './ImageCard';
import { Loader2 } from 'lucide-react';

export const ImageGrid = ({ images, loading, onLoadMore, hasMore, onImageClick }) => {
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  });

  // Trigger load more when sentinel is visible
  if (inView && hasMore && !loading) {
    onLoadMore();
  }

  if (images.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => onImageClick(image)}
          />
        ))}
      </div>

      {/* Load more sentinel */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
        </div>
      )}

      {/* Loading state for initial load */}
      {loading && images.length === 0 && (
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
};
