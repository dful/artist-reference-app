import { useColorStore } from '../../stores';
import { HARMONY_TYPES, HARMONY_DESCRIPTIONS } from '../../utils/constants';
import { getReadableTextColor } from '../../utils/colorUtils';

export const ColorHarmonies = () => {
  const { harmonies, selectedHarmony, setSelectedHarmony, setCurrentColor } = useColorStore();

  const harmonyTypes = Object.keys(HARMONY_TYPES);

  return (
    <div className="space-y-4">
      {/* Harmony type selector */}
      <div className="flex flex-wrap gap-2">
        {harmonyTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedHarmony(type)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${selectedHarmony === type
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {HARMONY_TYPES[type]}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {HARMONY_DESCRIPTIONS[selectedHarmony]}
      </p>

      {/* Color swatches */}
      <div className="flex flex-wrap gap-2">
        {harmonies[selectedHarmony]?.map((color, index) => (
          <button
            key={`${color}-${index}`}
            onClick={() => setCurrentColor(color)}
            className="group relative flex flex-col items-center"
          >
            <div
              className="w-16 h-16 rounded-lg shadow-md group-hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
            <span
              className="mt-1 text-xs font-mono"
              style={{ color }}
            >
              {color.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
