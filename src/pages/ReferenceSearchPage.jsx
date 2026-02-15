import { useState } from 'react';
import { Card, CardContent, Button } from '../components/common';
import { SearchBar, FilterPanel, ImageGrid, ImageModal, FavoritesList } from '../components/reference';
import { useUnsplash } from '../hooks';
import { Heart, Search, AlertCircle, ImageOff, Key } from 'lucide-react';

export const ReferenceSearchPage = () => {
  const {
    photos,
    loading,
    error,
    totalResults,
    totalPages,
    currentPage,
    currentQuery,
    search,
    loadMore,
    isConfigured,
  } = useUnsplash();

  const [filters, setFilters] = useState({
    orientation: '',
    color: '',
    size: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSearch = (query) => {
    search(query, { ...filters, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (currentQuery) {
      search(currentQuery, { ...newFilters, page: 1 });
    }
  };

  const handleLoadMore = () => {
    loadMore(filters);
  };

  // API not configured
  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reference Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for reference images from Unsplash
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <Key className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              API Key Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              To use the reference search, you need to configure your Unsplash API key.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 max-w-md mx-auto text-left">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Setup instructions:</strong>
              </p>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">unsplash.com/developers</a></li>
                <li>Create a new application</li>
                <li>Copy the Access Key</li>
                <li>Create a <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">.env</code> file in the project root</li>
                <li>Add: <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">VITE_UNSPLASH_ACCESS_KEY=your_key</code></li>
                <li>Restart the dev server</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reference Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the perfect reference images for your artwork
          </p>
        </div>
        <Button
          variant={showFavorites ? 'primary' : 'secondary'}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <Heart className={`w-4 h-4 mr-2 ${showFavorites ? 'fill-current' : ''}`} />
          Favorites
        </Button>
      </div>

      {/* Search and filters */}
      <div className="space-y-4">
        <SearchBar onSearch={handleSearch} loading={loading} />
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Results info */}
      {totalResults > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Found {totalResults.toLocaleString()} results for "{currentQuery}"
        </div>
      )}

      {/* Content */}
      {showFavorites ? (
        <Card>
          <CardContent className="py-6">
            <FavoritesList onSelectImage={setSelectedImage} />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Error state */}
          {error && (
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="py-8 text-center">
                <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-4" />
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Empty state */}
          {!loading && photos.length === 0 && !error && (
            <Card>
              <CardContent className="py-12 text-center">
                <ImageOff className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No images yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Search for something to find reference images
                </p>
              </CardContent>
            </Card>
          )}

          {/* Image grid */}
          {photos.length > 0 && (
            <ImageGrid
              images={photos}
              loading={loading}
              onLoadMore={handleLoadMore}
              hasMore={currentPage < totalPages}
              onImageClick={setSelectedImage}
            />
          )}
        </>
      )}

      {/* Image modal */}
      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};
