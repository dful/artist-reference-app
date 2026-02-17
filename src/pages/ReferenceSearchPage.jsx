import { useState } from 'react';
import { Card, CardContent, Button } from '../components/common';
import { SearchBar, FilterPanel, ImageGrid, ImageModal, FavoritesList } from '../components/reference';
import { useUnsplash } from '../hooks';
import { setUserApiKey, hasUserApiKey } from '../services/unsplashService';
import { Heart, AlertCircle, ImageOff, Key, Eye, EyeOff, Check } from 'lucide-react';

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

  // API key input state
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState('');
  const [apiKeySaving, setApiKeySaving] = useState(false);

  const handleSaveApiKey = () => {
    const trimmedKey = apiKeyInput.trim();
    if (!trimmedKey) {
      setApiKeyError('Please enter an API key');
      return;
    }
    setApiKeySaving(true);
    setApiKeyError('');
    setUserApiKey(trimmedKey);
    // Force page reload to re-initialize the API with new key
    window.location.reload();
  };

  const handleClearApiKey = () => {
    setUserApiKey(null);
    setApiKeyInput('');
    window.location.reload();
  };

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

  // API not configured - show input form
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
              To use the reference search, enter your Unsplash API key below or configure it in your environment.
            </p>

            {/* API Key Input Form */}
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Enter your Unsplash Access Key"
                  className="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {apiKeyError && (
                <p className="text-sm text-red-600 dark:text-red-400">{apiKeyError}</p>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={handleSaveApiKey}
                  disabled={apiKeySaving}
                >
                  {apiKeySaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save & Continue
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Setup instructions */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 max-w-md mx-auto text-left mt-6">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>How to get an API key:</strong>
              </p>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">unsplash.com/developers</a></li>
                <li>Register or log in to your account</li>
                <li>Create a new application</li>
                <li>Copy the Access Key and paste it above</li>
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
        <div className="flex items-center gap-2">
          {hasUserApiKey() && (
            <Button
              variant="secondary"
              onClick={handleClearApiKey}
              title="Clear saved API key"
            >
              <Key className="w-4 h-4 mr-2" />
              Clear Key
            </Button>
          )}
          <Button
            variant={showFavorites ? 'primary' : 'secondary'}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Heart className={`w-4 h-4 mr-2 ${showFavorites ? 'fill-current' : ''}`} />
            Favorites
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="space-y-4">
        <SearchBar onSearch={handleSearch} loading={loading} />
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Results info */}
      {totalResults > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Found {totalResults.toLocaleString()} results for &ldquo;{currentQuery}&rdquo;
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
