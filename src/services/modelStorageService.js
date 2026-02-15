/**
 * IndexedDB service for storing custom 3D model binary data.
 * Keeps large model files separate from localStorage for better performance.
 */

const DB_NAME = 'artist-reference-models';
const STORE_NAME = 'customModels';
const DB_VERSION = 1;

let dbInstance = null;

/**
 * Open and initialize the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store for model data if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Save model binary data to IndexedDB
 * @param {string} modelId - Unique identifier for the model
 * @param {ArrayBuffer} arrayBuffer - Binary data of the model file
 * @returns {Promise<void>}
 */
export const saveModelData = async (modelId, arrayBuffer) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.put({
      id: modelId,
      data: arrayBuffer,
      savedAt: Date.now(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Failed to save model data:', request.error);
      reject(new Error('Failed to save model data'));
    };
  });
};

/**
 * Retrieve model binary data from IndexedDB
 * @param {string} modelId - Unique identifier for the model
 * @returns {Promise<ArrayBuffer|null>}
 */
export const getModelData = async (modelId) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(modelId);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.data);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      console.error('Failed to get model data:', request.error);
      reject(new Error('Failed to get model data'));
    };
  });
};

/**
 * Delete model binary data from IndexedDB
 * @param {string} modelId - Unique identifier for the model
 * @returns {Promise<void>}
 */
export const deleteModelData = async (modelId) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(modelId);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Failed to delete model data:', request.error);
      reject(new Error('Failed to delete model data'));
    };
  });
};

/**
 * Get all model IDs stored in IndexedDB
 * @returns {Promise<string[]>}
 */
export const getAllModelIds = async () => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAllKeys();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('Failed to get model IDs:', request.error);
      reject(new Error('Failed to get model IDs'));
    };
  });
};

/**
 * Create a blob URL from model data for use with useGLTF
 * @param {ArrayBuffer} arrayBuffer - Model binary data
 * @param {string} mimeType - MIME type of the file
 * @returns {string} Blob URL
 */
export const createModelUrl = (arrayBuffer, mimeType = 'model/gltf-binary') => {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return URL.createObjectURL(blob);
};

/**
 * Revoke a blob URL to free memory
 * @param {string} url - Blob URL to revoke
 */
export const revokeModelUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
