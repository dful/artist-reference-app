import { useState, useCallback } from 'react';
import { searchPhotos, transformPhoto, isApiConfigured } from '../services/unsplashService';

export const useUnsplash = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');

  const search = useCallback(async (query, options = {}) => {
    if (!query.trim()) {
      setPhotos([]);
      setTotalResults(0);
      setTotalPages(0);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentQuery(query);
    setCurrentPage(options.page || 1);

    const result = await searchPhotos(query, options);

    if (result.type === 'success') {
      const transformedPhotos = result.results.map(transformPhoto);

      if (options.page && options.page > 1) {
        // Append to existing photos for infinite scroll
        setPhotos(prev => [...prev, ...transformedPhotos]);
      } else {
        setPhotos(transformedPhotos);
      }

      setTotalResults(result.total);
      setTotalPages(result.totalPages);
    } else {
      setError(result.errors?.[0] || 'Failed to search photos');
      setPhotos([]);
      setTotalResults(0);
      setTotalPages(0);
    }

    setLoading(false);
  }, []);

  const loadMore = useCallback((options = {}) => {
    if (currentPage < totalPages && !loading) {
      search(currentQuery, { ...options, page: currentPage + 1 });
    }
  }, [currentQuery, currentPage, totalPages, loading, search]);

  const reset = useCallback(() => {
    setPhotos([]);
    setLoading(false);
    setError(null);
    setTotalResults(0);
    setTotalPages(0);
    setCurrentPage(1);
    setCurrentQuery('');
  }, []);

  return {
    photos,
    loading,
    error,
    totalResults,
    totalPages,
    currentPage,
    currentQuery,
    search,
    loadMore,
    reset,
    isConfigured: isApiConfigured(),
  };
};
