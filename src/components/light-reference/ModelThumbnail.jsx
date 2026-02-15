import { X, User, CircleUser } from 'lucide-react';

// Category icons for models without thumbnails
const categoryIcons = {
  body: <User className="w-8 h-8 text-gray-400" />,
  head: <CircleUser className="w-8 h-8 text-gray-400" />,
  custom: <User className="w-8 h-8 text-gray-400" />,
};

/**
 * Thumbnail component for displaying a 3D model option
 */
export const ModelThumbnail = ({ model, isSelected, onClick, onDelete }) => {
  const hasThumbnail = model.thumbnail && !model.thumbnail.startsWith('data:image') === false ||
    (model.thumbnail && model.thumbnail.startsWith('/'));

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square group ${
        isSelected
          ? 'border-primary-500 ring-2 ring-primary-500/30'
          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 bg-gray-100 dark:bg-gray-800'
      }`}
      title={model.name}
    >
      {/* Thumbnail image or placeholder */}
      {hasThumbnail ? (
        <img
          src={model.thumbnail}
          alt={model.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide broken image and show placeholder
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        className={`w-full h-full flex items-center justify-center ${
          hasThumbnail ? 'hidden' : 'flex'
        } bg-gray-200 dark:bg-gray-700`}
      >
        {categoryIcons[model.category] || categoryIcons.custom}
      </div>

      {/* Model name overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <span className="text-xs text-white font-medium truncate block">
          {model.name}
        </span>
      </div>

      {/* Delete button for custom models */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-1 right-1 p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete model"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-1 left-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
};
