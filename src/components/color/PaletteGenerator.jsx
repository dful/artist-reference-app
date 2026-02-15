import { useState, useRef } from 'react';
import { usePaletteStore } from '../../stores';
import { Button, Input, Modal } from '../common';
import { Plus, Trash2, Save, Download, RefreshCw } from 'lucide-react';
import { randomColor, getReadableTextColor } from '../../utils/colorUtils';
import { PALETTE_PRESETS } from '../../utils/constants';
import { exportPalette, EXPORT_FORMATS } from '../../services/exportService';

export const PaletteGenerator = () => {
  const {
    currentPalette,
    updateCurrentPaletteName,
    updateCurrentPaletteColors,
    addColorToCurrentPalette,
    removeColorFromCurrentPalette,
    updateColorInCurrentPalette,
    saveCurrentPalette,
    newPalette,
  } = usePaletteStore();

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('css');
  const paletteRef = useRef(null);

  const handleRandomize = () => {
    const newColors = currentPalette.colors.map(() => randomColor());
    updateCurrentPaletteColors(newColors);
  };

  const handleExport = async () => {
    await exportPalette(
      exportFormat,
      currentPalette.colors,
      currentPalette.name,
      paletteRef.current
    );
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Palette name */}
      <div className="flex items-center gap-4">
        <Input
          value={currentPalette.name}
          onChange={(e) => updateCurrentPaletteName(e.target.value)}
          placeholder="Palette name"
          className="flex-1"
        />
        <Button variant="ghost" onClick={newPalette} title="New palette">
          <RefreshCw className="w-4 h-4" />
        </Button>
        <Button variant="secondary" onClick={saveCurrentPalette}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="primary" onClick={() => setShowExportModal(true)}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Color swatches */}
      <div ref={paletteRef} className="flex flex-wrap gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        {currentPalette.colors.map((color, index) => (
          <div key={index} className="group relative">
            <div
              className="w-20 h-20 rounded-lg shadow-md cursor-pointer overflow-hidden"
              style={{ backgroundColor: color }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => updateColorInCurrentPalette(index, e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span
              className="block mt-1 text-xs font-mono text-center"
              style={{ color }}
            >
              {color.toUpperCase()}
            </span>
            <button
              onClick={() => removeColorFromCurrentPalette(index)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Add color button */}
        <button
          onClick={() => addColorToCurrentPalette(randomColor())}
          className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Actions */}
      <Button variant="secondary" onClick={handleRandomize}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Randomize Colors
      </Button>

      {/* Presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Preset Palettes
        </h4>
        <div className="flex flex-wrap gap-2">
          {PALETTE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                updateCurrentPaletteName(preset.name);
                updateCurrentPaletteColors([...preset.colors]);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex">
                {preset.colors.slice(0, 5).map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full -ml-1 first:ml-0 border border-white dark:border-gray-800"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Palette"
        size="sm"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              {EXPORT_FORMATS.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
