import { useState } from 'react';
import { parseToHex, getAllFormats } from '../../utils/colorUtils';
import { Button } from '../common';
import { RefreshCw, Copy, Check } from 'lucide-react';

export const ColorConverter = () => {
  const [inputValue, setInputValue] = useState('#3B82F6');
  const [parsedColor, setParsedColor] = useState('#3B82F6');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);

  const handleConvert = () => {
    const parsed = parseToHex(inputValue);
    if (parsed) {
      setParsedColor(parsed);
      setError('');
    } else {
      setError('Invalid color format');
    }
  };

  const formats = getAllFormats(parsedColor);

  const handleCopy = (format, value) => {
    navigator.clipboard.writeText(value);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatLabels = {
    hex: 'HEX',
    rgb: 'RGB',
    rgba: 'RGBA',
    hsl: 'HSL',
    hsla: 'HSLA',
    cmyk: 'CMYK',
  };

  const formatDescriptions = {
    hex: 'Web standard hex color',
    rgb: 'Red, Green, Blue (0-255)',
    rgba: 'RGB with Alpha channel',
    hsl: 'Hue, Saturation, Lightness',
    hsla: 'HSL with Alpha channel',
    cmyk: 'Cyan, Magenta, Yellow, Key (Print)',
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Enter any color format
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
            placeholder="e.g., #3B82F6, rgb(59, 130, 246), blue"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
          />
          <Button variant="primary" onClick={handleConvert}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Convert
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Supports: HEX, RGB, RGBA, HSL, HSLA, and color names
        </p>
      </div>

      {/* Preview */}
      <div
        className="w-full h-20 rounded-xl shadow-md flex items-center justify-center"
        style={{ backgroundColor: parsedColor }}
      >
        <span
          className="font-mono font-bold"
          style={{ color: parsedColor.startsWith('#f') || parsedColor.startsWith('#F') ? '#000' : '#fff' }}
        >
          {parsedColor.toUpperCase()}
        </span>
      </div>

      {/* Formats */}
      <div className="space-y-3">
        {Object.entries(formats).map(([format, value]) => (
          <div
            key={format}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatLabels[format]}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDescriptions[format]}
              </div>
            </div>
            <button
              onClick={() => handleCopy(format, value)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {value}
              {copied === format ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
