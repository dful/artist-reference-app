import { createApi } from 'unsplash-js';
import { UNSPLASH_CONFIG, STORAGE_KEYS } from '../utils/constants';

// Get user-provided API key from localStorage
const getUserApiKey = () => {
  return localStorage.getItem(STORAGE_KEYS.UNSPLASH_API_KEY);
};

// Initialize Unsplash API
const getUnsplash = () => {
  // Priority: localStorage user key > env variable
  const accessKey = getUserApiKey() || import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  if (!accessKey || accessKey === 'your_unsplash_access_key_here') {
    console.warn('Unsplash API key not configured. Please set VITE_UNSPLASH_ACCESS_KEY in .env file or provide via UI.');
    return null;
  }

  return createApi({
    accessKey,
  });
};

let unsplashInstance = null;

const getApi = () => {
  if (!unsplashInstance) {
    unsplashInstance = getUnsplash();
  }
  return unsplashInstance;
};

// Search photos
export const searchPhotos = async (query, options = {}) => {
  const api = getApi();

  if (!api) {
    return {
      type: 'error',
      errors: ['Unsplash API key not configured'],
    };
  }

  try {
    const result = await api.search.getPhotos({
      query,
      page: options.page || 1,
      perPage: options.perPage || UNSPLASH_CONFIG.perPage,
      orientation: options.orientation || undefined,
      color: options.color || undefined,
    });

    if (result.type === 'success') {
      return {
        type: 'success',
        results: result.response.results,
        total: result.response.total,
        totalPages: result.response.total_pages,
      };
    }

    return result;
  } catch (error) {
    return {
      type: 'error',
      errors: [error.message],
    };
  }
};

// Get a single photo
export const getPhoto = async (photoId) => {
  const api = getApi();

  if (!api) {
    return {
      type: 'error',
      errors: ['Unsplash API key not configured'],
    };
  }

  try {
    const result = await api.photos.get({ photoId });

    if (result.type === 'success') {
      return {
        type: 'success',
        photo: result.response,
      };
    }

    return result;
  } catch (error) {
    return {
      type: 'error',
      errors: [error.message],
    };
  }
};

// Track download (required by Unsplash guidelines)
export const trackDownload = async (downloadUrl) => {
  const api = getApi();

  if (!api) {
    return;
  }

  try {
    await api.photos.trackDownload({
      downloadLocation: downloadUrl,
    });
  } catch (error) {
    console.error('Failed to track download:', error);
  }
};

// Get random photos
export const getRandomPhotos = async (count = 10) => {
  const api = getApi();

  if (!api) {
    return {
      type: 'error',
      errors: ['Unsplash API key not configured'],
    };
  }

  try {
    const result = await api.photos.getRandom({
      count,
      featured: true,
    });

    if (result.type === 'success') {
      return {
        type: 'success',
        photos: Array.isArray(result.response) ? result.response : [result.response],
      };
    }

    return result;
  } catch (error) {
    return {
      type: 'error',
      errors: [error.message],
    };
  }
};

// Transform photo to our app format
export const transformPhoto = (photo) => ({
  id: photo.id,
  description: photo.description || photo.alt_description,
  altDescription: photo.alt_description,
  color: photo.color, // Dominant color
  width: photo.width,
  height: photo.height,
  urls: {
    raw: photo.urls.raw,
    full: photo.urls.full,
    regular: photo.urls.regular,
    small: photo.urls.small,
    thumb: photo.urls.thumb,
  },
  links: {
    download: photo.links.download,
    downloadLocation: photo.links.download_location,
    html: photo.links.html,
  },
  user: {
    id: photo.user.id,
    username: photo.user.username,
    name: photo.user.name,
    portfolioUrl: photo.user.portfolio_url,
    profileImage: photo.user.profile_image,
  },
  likes: photo.likes,
  createdAt: photo.created_at,
});

// Check if API is configured
export const isApiConfigured = () => {
  const userKey = getUserApiKey();
  const envKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  return !!(userKey || (envKey && envKey !== 'your_unsplash_access_key_here'));
};

// Check if user has provided their own API key (vs env variable)
export const hasUserApiKey = () => {
  return !!getUserApiKey();
};

// Set or clear user API key
export const setUserApiKey = (key) => {
  if (key) {
    localStorage.setItem(STORAGE_KEYS.UNSPLASH_API_KEY, key);
  } else {
    localStorage.removeItem(STORAGE_KEYS.UNSPLASH_API_KEY);
  }
  // Reset instance to use new key
  unsplashInstance = null;
};
