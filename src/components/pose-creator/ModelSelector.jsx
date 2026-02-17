import { X, User, AlertCircle, ExternalLink } from 'lucide-react';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';
import { BUILT_IN_POSABLE_MODELS } from '../../utils/constants';
import { deleteModelData } from '../../services/modelStorageService';

const ModelThumbnail = ({ model, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
        ${isSelected
          ? 'border-primary-500 ring-2 ring-primary-500/20'
          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
    >
      {model.thumbnail ? (
        <img
          src={model.thumbnail}
          alt={model.name}
          className="w-full h-full object-cover bg-gray-100 dark:bg-gray-800"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <User className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
        <span className="text-xs text-white font-medium truncate">{model.name}</span>
      </div>
    </button>
  );
};

export const ModelSelector = () => {
  const selectedModelId = usePoseCreatorStore((state) => state.selectedModelId);
  const setSelectedModel = usePoseCreatorStore((state) => state.setSelectedModel);
  const customPosableModels = usePoseCreatorStore((state) => state.customPosableModels);
  const removeCustomPosableModel = usePoseCreatorStore((state) => state.removeCustomPosableModel);

  const handleDeleteModel = async (modelId, event) => {
    event.stopPropagation();
    if (!confirm('Delete this model?')) return;

    try {
      await deleteModelData(modelId);
      removeCustomPosableModel(modelId);
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  };

  const builtInModels = Object.values(BUILT_IN_POSABLE_MODELS);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Model
      </h3>

      {/* Info about rigged models */}
      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">Rigged models required</p>
            <p>Models need a skeleton to be posable. Import GLB files with bones.</p>
            <a
              href="https://www.mixamo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline mt-1"
            >
              Get models from Mixamo
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="mt-1 text-amber-600 dark:text-amber-400">
              Convert FBX → GLB using Blender
            </p>
          </div>
        </div>
      </div>

      {/* Built-in models */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Built-in</p>
        <div className="grid grid-cols-3 gap-3">
          {builtInModels.map((model) => (
            <ModelThumbnail
              key={model.id}
              model={model}
              isSelected={selectedModelId === model.id}
              onClick={() => setSelectedModel(model.id)}
            />
          ))}
        </div>
      </div>

      {/* Custom models */}
      {customPosableModels.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Custom</p>
          <div className="grid grid-cols-3 gap-3">
            {customPosableModels.map((model) => (
              <div key={model.id} className="relative group">
                <ModelThumbnail
                  model={model}
                  isSelected={selectedModelId === model.id}
                  onClick={() => setSelectedModel(model.id)}
                />
                <button
                  onClick={(e) => handleDeleteModel(model.id, e)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete model"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
