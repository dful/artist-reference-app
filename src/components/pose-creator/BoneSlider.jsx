import { RotateCcw } from 'lucide-react';

export const BoneSlider = ({
  label,
  axis,
  value,
  limits,
  onChange,
  onReset,
}) => {
  const [min, max] = limits;

  return (
    <div className="flex items-center gap-2">
      <span className="w-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
        {axis}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(axis, parseFloat(e.target.value))}
        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
      />
      <div className="flex items-center gap-1 min-w-[60px]">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(axis, parseFloat(e.target.value) || 0)}
          className="w-12 px-1 py-0.5 text-xs text-center bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <span className="text-xs text-gray-400">°</span>
      </div>
      <button
        onClick={() => onReset(axis)}
        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title={`Reset ${axis.toUpperCase()} axis`}
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
};
