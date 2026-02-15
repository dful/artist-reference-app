import { Sun, Eye, Lightbulb } from 'lucide-react';
import { useLightReferenceStore } from '../../stores/lightReferenceStore';
import { ColorWheel } from '../color/ColorWheel';

const SliderControl = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-gray-900 dark:text-white font-medium">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
    />
  </div>
);

const LightButton = ({ lightId, icon: Icon, label, isSelected, isEnabled, onClick, onToggle }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-full ${
      isSelected
        ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500'
        : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
    } ${!isEnabled ? 'opacity-50' : ''}`}
  >
    <div
      className={`p-1.5 rounded ${
        isSelected
          ? 'bg-primary-200 dark:bg-primary-800'
          : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <Icon className={`w-4 h-4 ${isEnabled ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
    </div>
    <span className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white">
      {label}
    </span>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`w-8 h-5 rounded-full transition-colors ${
        isEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
          isEnabled ? 'translate-x-3.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  </button>
);

export const LightControls = () => {
  const {
    lights,
    selectedLight,
    showHelpers,
    setSelectedLight,
    updateLight,
    updateLightPosition,
    toggleLight,
    toggleHelpers,
  } = useLightReferenceStore();

  const currentLight = lights[selectedLight];
  const lightOptions = [
    { id: 'key', label: 'Key Light', icon: Sun },
    { id: 'fill', label: 'Fill Light', icon: Lightbulb },
    { id: 'rim', label: 'Rim Light', icon: Eye },
  ];

  return (
    <div className="space-y-6">
      {/* Light Selection */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Light Sources
        </h3>
        <div className="space-y-2">
          {lightOptions.map((light) => (
            <LightButton
              key={light.id}
              lightId={light.id}
              icon={light.icon}
              label={light.label}
              isSelected={selectedLight === light.id}
              isEnabled={lights[light.id].enabled}
              onClick={() => setSelectedLight(light.id)}
              onToggle={() => toggleLight(light.id)}
            />
          ))}
        </div>
      </div>

      {/* Selected Light Controls */}
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          {lightOptions.find((l) => l.id === selectedLight)?.label} Settings
        </h3>

        {/* Position Controls */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Position
          </h4>
          <SliderControl
            label="Azimuth"
            value={currentLight.position.azimuth}
            min={-180}
            max={180}
            unit="°"
            onChange={(value) => updateLightPosition(selectedLight, { azimuth: value })}
          />
          <SliderControl
            label="Elevation"
            value={currentLight.position.elevation}
            min={0}
            max={90}
            unit="°"
            onChange={(value) => updateLightPosition(selectedLight, { elevation: value })}
          />
          <SliderControl
            label="Distance"
            value={currentLight.position.distance}
            min={2}
            max={15}
            step={0.5}
            unit="m"
            onChange={(value) => updateLightPosition(selectedLight, { distance: value })}
          />
        </div>

        {/* Intensity Control */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Properties
          </h4>
          <SliderControl
            label="Intensity"
            value={currentLight.intensity}
            min={0}
            max={3}
            step={0.1}
            onChange={(value) => updateLight(selectedLight, { intensity: value })}
          />
        </div>

        {/* Color Control */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Color
          </h4>
          <div className="flex justify-center">
            <ColorWheel
              value={currentLight.color}
              onChange={(color) => updateLight(selectedLight, { color })}
              size={200}
            />
          </div>
        </div>
      </div>

      {/* Helper Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Show Light Helpers
        </span>
        <button
          onClick={toggleHelpers}
          className={`w-10 h-6 rounded-full transition-colors ${
            showHelpers ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
              showHelpers ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
