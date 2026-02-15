import { LIGHT_PRESETS } from '../../utils/lightPresets';
import { useLightReferenceStore } from '../../stores/lightReferenceStore';

const presetIcons = {
  studio: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  rembrandt: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ),
  butterfly: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L8 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4l4 4 4-4h4a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-4-4z" />
    </svg>
  ),
  split: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v18M3 12h18" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  rim: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 2a10 10 0 0 1 0 20" strokeWidth="3" />
    </svg>
  ),
  outdoor: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
};

export const LightPresetSelector = () => {
  const currentPreset = useLightReferenceStore((state) => state.currentPreset);
  const applyPreset = useLightReferenceStore((state) => state.applyPreset);

  const handlePresetClick = (presetName) => {
    const preset = LIGHT_PRESETS[presetName];
    if (preset) {
      applyPreset(preset);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
        Lighting Presets
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(LIGHT_PRESETS).map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset.name)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
              currentPreset === preset.name
                ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                currentPreset === preset.name
                  ? 'bg-primary-200 dark:bg-primary-800'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {presetIcons[preset.name]}
            </div>
            <span className="text-sm font-medium">{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
