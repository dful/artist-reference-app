import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks';
import { useLocalStorage } from '../../hooks';
import { STORAGE_KEYS } from '../../utils/constants';

export const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useLocalStorage(STORAGE_KEYS.RECENT_SEARCHES, []);
  const [showRecent, setShowRecent] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      addToRecentSearches(query.trim());
    }
  };

  const addToRecentSearches = (searchQuery) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 10);
    });
  };

  const handleRecentClick = (searchQuery) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setShowRecent(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowRecent(true)}
          onBlur={() => setTimeout(() => setShowRecent(false), 200)}
          placeholder="Search for reference images..."
          className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          disabled={loading}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Recent searches
            </span>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentClick(search)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
