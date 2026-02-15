// Helper to create light configuration
const createLight = (azimuth, elevation, distance, color, intensity, enabled = true) => ({
  type: 'spot',
  position: { azimuth, elevation, distance },
  color,
  intensity,
  enabled,
});

export const LIGHT_PRESETS = {
  studio: {
    name: 'studio',
    label: 'Studio',
    description: 'Classic 3-point lighting setup for balanced illumination',
    lights: {
      key: createLight(45, 45, 5, '#ffffff', 1.5),
      fill: createLight(-45, 30, 6, '#ffffff', 0.5),
      rim: createLight(180, 60, 4, '#ffffff', 0.8),
    },
    ambient: { color: '#404040', intensity: 0.2 },
  },
  rembrandt: {
    name: 'rembrandt',
    label: 'Rembrandt',
    description: 'Dramatic triangle lighting on the cheek',
    lights: {
      key: createLight(60, 45, 4, '#fff5e6', 1.8),
      fill: createLight(-30, 20, 7, '#e6e6ff', 0.3),
      rim: createLight(160, 50, 3, '#ffffff', 0.6),
    },
    ambient: { color: '#1a1a1a', intensity: 0.1 },
  },
  butterfly: {
    name: 'butterfly',
    label: 'Butterfly',
    description: 'Beauty/glamour lighting from above',
    lights: {
      key: createLight(0, 75, 4, '#ffffff', 1.6),
      fill: createLight(0, 15, 6, '#ffffff', 0.4),
      rim: createLight(180, 45, 4, '#ffffff', 0.7),
    },
    ambient: { color: '#303030', intensity: 0.15 },
  },
  split: {
    name: 'split',
    label: 'Split',
    description: 'Half face illumination for dramatic effect',
    lights: {
      key: createLight(90, 30, 4, '#ffffff', 1.7),
      fill: createLight(-90, 30, 8, '#ffffff', 0.1),
      rim: createLight(180, 40, 5, '#ffffff', 0.5),
    },
    ambient: { color: '#0a0a0a', intensity: 0.05 },
  },
  rim: {
    name: 'rim',
    label: 'Rim Light',
    description: 'Edge/silhouette emphasis from behind',
    lights: {
      key: createLight(0, 20, 8, '#ffffff', 0.3),
      fill: createLight(-60, 30, 7, '#6699ff', 0.2),
      rim: createLight(180, 45, 3, '#ffffff', 2.0),
    },
    ambient: { color: '#050505', intensity: 0.05 },
  },
  outdoor: {
    name: 'outdoor',
    label: 'Outdoor',
    description: 'Natural sunlight simulation',
    lights: {
      key: createLight(30, 60, 10, '#fffaf0', 1.8),
      fill: createLight(-60, 10, 12, '#87ceeb', 0.4),
      rim: createLight(200, 30, 8, '#ffffff', 0.3),
    },
    ambient: { color: '#4a6fa5', intensity: 0.3 },
  },
};

export const getLightPreset = (presetName) => LIGHT_PRESETS[presetName] || LIGHT_PRESETS.studio;

export const getLightPresetOptions = () => Object.values(LIGHT_PRESETS).map((preset) => ({
  value: preset.name,
  label: preset.label,
  description: preset.description,
}));
