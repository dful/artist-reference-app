import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useColorStore } from '../../stores';
import { useState } from 'react';
import { parseToHex, getAllFormats } from '../../utils/colorUtils';

export const ColorPicker = () => {
  const { currentColor, setCurrentColor } = useColorStore();
  const [inputValue, setInputValue] = useState(currentColor);

  const handleColorChange = (color) => {
    setCurrentColor(color);
    setInputValue(color);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Try to parse the color
    const parsed = parseToHex(value);
    if (parsed) {
      setCurrentColor(parsed);
    }
  };

  const formats = getAllFormats(currentColor);

  return (
    <div className="space-y-4">
      {/* Color picker */}
      <div className="relative">
        <HexColorPicker
          color={currentColor}
          onChange={handleColorChange}
          className="w-full"
        />
      </div>

      {/* Hex input */}
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner"
          style={{ backgroundColor: currentColor }}
        />
        <div className="flex-1">
          <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden">
            <span className="px-3 text-gray-500 font-mono">#</span>
            <HexColorInput
              color={currentColor}
              onChange={handleColorChange}
              className="flex-1 px-2 py-2 bg-transparent outline-none font-mono uppercase"
            />
          </div>
        </div>
      </div>

      {/* Color formats */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Color Formats
        </p>
        <div className="space-y-1">
          {Object.entries(formats).map(([format, value]) => (
            <div
              key={format}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <span className="text-xs font-medium text-gray-400 uppercase">
                {format}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(value)}
                className="text-sm font-mono text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {value}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
