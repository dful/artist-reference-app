import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLightReferenceStore } from '../../stores/lightReferenceStore';
import { BUILT_IN_MODELS } from '../../utils/constants';
import { ModelThumbnail } from './ModelThumbnail';
import { ModelImportModal } from './ModelImportModal';
import { deleteModelData } from '../../services/modelStorageService';

/**
 * Component for selecting 3D models in the Light Reference feature
 */
export const ModelSelector = () => {
  const selectedModelId = useLightReferenceStore((state) => state.selectedModelId);
  const customModels = useLightReferenceStore((state) => state.customModels);
  const setSelectedModel = useLightReferenceStore((state) => state.setSelectedModel);
  const removeCustomModel = useLightReferenceStore((state) => state.removeCustomModel);

  const [showImportModal, setShowImportModal] = useState(false);

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
  };

  const handleDeleteCustomModel = async (modelId) => {
    try {
      // Delete from IndexedDB
      await deleteModelData(modelId);
      // Remove from store
      removeCustomModel(modelId);
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  };

  const builtInModels = Object.values(BUILT_IN_MODELS);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
        Model Selection
      </h3>

      {/* Built-in models grid */}
      <div className="grid grid-cols-3 gap-3">
        {builtInModels.map((model) => (
          <ModelThumbnail
            key={model.id}
            model={model}
            isSelected={selectedModelId === model.id}
            onClick={() => handleModelSelect(model.id)}
          />
        ))}
      </div>

      {/* Custom models section */}
      {customModels.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Custom Models
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {customModels.map((model) => (
              <ModelThumbnail
                key={model.id}
                model={model}
                isSelected={selectedModelId === model.id}
                onClick={() => handleModelSelect(model.id)}
                onDelete={() => handleDeleteCustomModel(model.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Import button */}
      <button
        onClick={() => setShowImportModal(true)}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-400 dark:hover:text-primary-400 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Import Custom Model</span>
      </button>

      {/* Import modal */}
      <ModelImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
};
