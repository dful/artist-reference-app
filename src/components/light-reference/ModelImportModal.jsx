import { useState, useCallback } from 'react';
import { Upload, FileBox, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useLightReferenceStore } from '../../stores/lightReferenceStore';
import { saveModelData } from '../../services/modelStorageService';
import { MODEL_CONSTRAINTS } from '../../utils/constants';

/**
 * Modal for importing custom 3D models
 */
export const ModelImportModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const addCustomModel = useLightReferenceStore((state) => state.addCustomModel);
  const setSelectedModel = useLightReferenceStore((state) => state.setSelectedModel);

  const validateFile = (file) => {
    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!MODEL_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
      return `Invalid file type. Please upload a ${MODEL_CONSTRAINTS.ALLOWED_EXTENSIONS.join(' or ')} file.`;
    }

    // Check file size
    if (file.size > MODEL_CONSTRAINTS.MAX_FILE_SIZE) {
      return `File size exceeds ${(MODEL_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB limit.`;
    }

    return null;
  };

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    setName(selectedFile.name.replace(/\.(glb|gltf)$/i, ''));
    setError(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const generateThumbnail = async (arrayBuffer) => {
    // Create a simple canvas-based thumbnail
    // For now, return a placeholder - in a full implementation,
    // this would render the model to an offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = MODEL_CONSTRAINTS.THUMBNAIL_SIZE;
    canvas.height = MODEL_CONSTRAINTS.THUMBNAIL_SIZE;
    const ctx = canvas.getContext('2d');

    // Draw a placeholder gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4a5568');
    gradient.addColorStop(1, '#2d3748');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a simple human silhouette placeholder
    ctx.fillStyle = '#718096';
    ctx.beginPath();
    // Head
    ctx.arc(canvas.width / 2, 30, 20, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillRect(canvas.width / 2 - 25, 55, 50, 50);
    // Base
    ctx.fillRect(canvas.width / 2 - 30, 105, 60, 20);

    return canvas.toDataURL('image/png');
  };

  const handleImport = async () => {
    if (!file || !name.trim()) {
      setError('Please provide a name for the model.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Generate unique ID
      const modelId = `custom-${Date.now()}`;

      // Generate thumbnail
      const thumbnail = await generateThumbnail(arrayBuffer);

      // Save binary data to IndexedDB
      await saveModelData(modelId, arrayBuffer);

      // Add metadata to store
      addCustomModel({
        id: modelId,
        name: name.trim(),
        thumbnail,
        dataSize: arrayBuffer.byteLength,
      });

      // Select the newly imported model
      setSelectedModel(modelId);

      // Reset form and close modal
      resetForm();
      onClose();
    } catch (err) {
      console.error('Failed to import model:', err);
      setError('Failed to import model. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setName('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Custom Model" size="md">
      <div className="space-y-6">
        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
            ${isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
        >
          <input
            type="file"
            accept=".glb,.gltf"
            onChange={handleFileInput}
            className="hidden"
            id="model-file-input"
          />
          <label htmlFor="model-file-input" className="cursor-pointer">
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary-500' : 'text-gray-400'}`} />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Drag and drop a model file, or click to browse
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Supported formats: .glb, .gltf (max {MODEL_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)}MB)
            </p>
          </label>
        </div>

        {/* Selected file info */}
        {file && (
          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <FileBox className="w-8 h-8 text-primary-500" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {file.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              &times;
            </button>
          </div>
        )}

        {/* Model name input */}
        {file && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Model Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for this model"
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || !name.trim()}
            loading={isProcessing}
          >
            Import Model
          </Button>
        </div>
      </div>
    </Modal>
  );
};
