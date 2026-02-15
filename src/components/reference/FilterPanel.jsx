import { Select } from '../common';
import { ORIENTATION_OPTIONS, COLOR_FILTER_OPTIONS, SIZE_OPTIONS } from '../../utils/constants';

export const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-40">
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Orientation
        </label>
        <Select
          value={filters.orientation}
          onChange={(value) => onFilterChange('orientation', value)}
          options={ORIENTATION_OPTIONS}
        />
      </div>

      <div className="w-40">
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Color
        </label>
        <Select
          value={filters.color}
          onChange={(value) => onFilterChange('color', value)}
          options={COLOR_FILTER_OPTIONS}
        />
      </div>

      <div className="w-40">
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Size
        </label>
        <Select
          value={filters.size}
          onChange={(value) => onFilterChange('size', value)}
          options={SIZE_OPTIONS}
        />
      </div>
    </div>
  );
};
