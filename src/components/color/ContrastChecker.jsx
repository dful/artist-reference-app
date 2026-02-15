import { useState } from 'react';
import { getWCAGCompliance, getReadableTextColor } from '../../utils/colorUtils';
import { Input } from '../common';

export const ContrastChecker = () => {
  const [foreground, setForeground] = useState('#1f2937');
  const [background, setBackground] = useState('#ffffff');

  const compliance = getWCAGCompliance(foreground, background);
  const ratio = parseFloat(compliance.ratio);

  const getStatusColor = (passed) => passed ? 'text-green-500' : 'text-red-500';
  const getStatusBg = (passed) => passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div className="space-y-6">
      {/* Color inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Foreground (Text)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-10 h-10 rounded-lg border-0 cursor-pointer"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Background
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-10 h-10 rounded-lg border-0 cursor-pointer"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="p-8 rounded-xl text-center"
        style={{ backgroundColor: background }}
      >
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: foreground }}
        >
          Sample Text
        </h3>
        <p style={{ color: foreground }} className="text-sm opacity-80">
          This is how your text will look on this background
        </p>
      </div>

      {/* Contrast ratio */}
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {compliance.ratio}:1
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Contrast Ratio
        </p>
      </div>

      {/* WCAG compliance */}
      <div className="grid grid-cols-2 gap-4">
        {/* AA Level */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            WCAG AA
          </h4>
          <div className="space-y-2">
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${getStatusBg(compliance.aa.normal)}`}>
              <span className="text-sm">Normal Text</span>
              <span className={`text-sm font-medium ${getStatusColor(compliance.aa.normal)}`}>
                {compliance.aa.normal ? 'Pass' : 'Fail'} (≥4.5:1)
              </span>
            </div>
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${getStatusBg(compliance.aa.large)}`}>
              <span className="text-sm">Large Text</span>
              <span className={`text-sm font-medium ${getStatusColor(compliance.aa.large)}`}>
                {compliance.aa.large ? 'Pass' : 'Fail'} (≥3:1)
              </span>
            </div>
          </div>
        </div>

        {/* AAA Level */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            WCAG AAA
          </h4>
          <div className="space-y-2">
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${getStatusBg(compliance.aaa.normal)}`}>
              <span className="text-sm">Normal Text</span>
              <span className={`text-sm font-medium ${getStatusColor(compliance.aaa.normal)}`}>
                {compliance.aaa.normal ? 'Pass' : 'Fail'} (≥7:1)
              </span>
            </div>
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${getStatusBg(compliance.aaa.large)}`}>
              <span className="text-sm">Large Text</span>
              <span className={`text-sm font-medium ${getStatusColor(compliance.aaa.large)}`}>
                {compliance.aaa.large ? 'Pass' : 'Fail'} (≥4.5:1)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
