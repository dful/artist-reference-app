import { RotateCcw } from 'lucide-react';
import { useLightReferenceStore } from '../../stores/lightReferenceStore';

const SliderControl = ({ label, value, min, max, step = 1, unit = '', onChange }) => {
  const displayValue = value ?? 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-900 dark:text-white font-medium">
          {displayValue.toFixed(1)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
      />
    </div>
  );
};

/**
 * Controls for adjusting model position and size
 */
export const ModelControls = () => {
  const model = useLightReferenceStore((state) => state.model);
  const updateModel = useLightReferenceStore((state) => state.updateModel);
  const updateModelPosition = useLightReferenceStore((state) => state.updateModelPosition);
  const resetModelPosition = useLightReferenceStore((state) => state.resetModelPosition);

  // Provide defaults for position and scale in case of old persisted state
  const position = model.position || { x: 0, y: 0, z: 0 };
  const scale = model.scale ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Model Adjustments
        </h3>
        <button
          onClick={resetModelPosition}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          title="Reset position"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Position Controls */}
      <div className="space-y-3">
        <SliderControl
          label="Position X"
          value={position.x}
          min={-2}
          max={2}
          step={0.1}
          onChange={(value) => updateModelPosition({ x: value })}
        />
        <SliderControl
          label="Position Y (Height)"
          value={position.y}
          min={-2}
          max={5}
          step={0.1}
          onChange={(value) => updateModelPosition({ y: value })}
        />
        <SliderControl
          label="Position Z"
          value={position.z}
          min={-2}
          max={2}
          step={0.1}
          onChange={(value) => updateModelPosition({ z: value })}
        />
      </div>

      {/* Size Control */}
      <SliderControl
        label="Size"
        value={scale}
        min={0.1}
        max={2}
        step={0.1}
        unit="x"
        onChange={(value) => updateModel({ scale: value })}
      />
    </div>
  );
};
