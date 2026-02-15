import { getTints, getShades, getTones, getReadableTextColor } from '../../utils/colorUtils';
import { useColorStore } from '../../stores';

export const ColorVariants = () => {
  const { currentColor, setCurrentColor } = useColorStore();

  const tints = getTints(currentColor);
  const shades = getShades(currentColor);
  const tones = getTones(currentColor);

  const renderSwatches = (colors, title) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
      <div className="flex flex-wrap gap-1">
        {colors.map((color, index) => (
          <button
            key={`${color}-${index}`}
            onClick={() => setCurrentColor(color)}
            className="group relative"
            title={color}
          >
            <div
              className="w-10 h-10 rounded-lg shadow-xs group-hover:scale-110 transition-transform border border-gray-200/50 dark:border-gray-600/50"
              style={{ backgroundColor: color }}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Original color */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Color</h4>
        <div
          className="w-full h-12 rounded-lg shadow-md flex items-center justify-center"
          style={{ backgroundColor: currentColor }}
        >
          <span
            className="font-mono text-sm"
            style={{ color: getReadableTextColor(currentColor) }}
          >
            {currentColor.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Variants */}
      {renderSwatches(tints, 'Tints (mixed with white)')}
      {renderSwatches(shades, 'Shades (mixed with black)')}
      {renderSwatches(tones, 'Tones (mixed with gray)')}
    </div>
  );
};
