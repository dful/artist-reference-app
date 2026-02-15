import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, BUILT_IN_MODELS } from '../utils/constants';

// Default light configuration
const createDefaultLight = (overrides = {}) => ({
  type: 'spot',
  position: { azimuth: 45, elevation: 45, distance: 5 },
  color: '#ffffff',
  intensity: 1,
  enabled: true,
  ...overrides,
});

const initialState = {
  lights: {
    key: createDefaultLight({ intensity: 1.5 }),
    fill: createDefaultLight({
      position: { azimuth: -45, elevation: 30, distance: 6 },
      intensity: 0.5
    }),
    rim: createDefaultLight({
      position: { azimuth: 180, elevation: 60, distance: 4 },
      intensity: 0.8
    }),
  },
  ambient: {
    color: '#404040',
    intensity: 0.2,
  },
  model: {
    rotation: 0,
    scale: 1,
    autoRotate: false,
    position: { x: 0, y: 0, z: 0 },
  },
  selectedLight: 'key',
  showHelpers: true,
  currentPreset: 'studio',
  // Model selection
  selectedModelId: 'human-base',
  customModels: [],
};

export const useLightReferenceStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Light actions
      setSelectedLight: (lightId) => set({ selectedLight: lightId }),

      updateLight: (lightId, updates) => set((state) => ({
        lights: {
          ...state.lights,
          [lightId]: { ...state.lights[lightId], ...updates },
        },
      })),

      updateLightPosition: (lightId, positionUpdates) => set((state) => ({
        lights: {
          ...state.lights,
          [lightId]: {
            ...state.lights[lightId],
            position: { ...state.lights[lightId].position, ...positionUpdates },
          },
        },
      })),

      toggleLight: (lightId) => set((state) => ({
        lights: {
          ...state.lights,
          [lightId]: { ...state.lights[lightId], enabled: !state.lights[lightId].enabled },
        },
      })),

      // Ambient actions
      updateAmbient: (updates) => set((state) => ({
        ambient: { ...state.ambient, ...updates },
      })),

      // Model actions
      updateModel: (updates) => set((state) => ({
        model: { ...state.model, ...updates },
      })),

      toggleAutoRotate: () => set((state) => ({
        model: { ...state.model, autoRotate: !state.model.autoRotate },
      })),

      updateModelPosition: (positionUpdates) => set((state) => ({
        model: {
          ...state.model,
          position: { ...state.model.position, ...positionUpdates },
        },
      })),

      resetModelPosition: () => set((state) => ({
        model: { ...state.model, position: { x: 0, y: 0, z: 0 } },
      })),

      // Helper toggle
      toggleHelpers: () => set((state) => ({
        showHelpers: !state.showHelpers,
      })),

      // Preset actions
      setCurrentPreset: (presetName) => set({ currentPreset: presetName }),

      applyPreset: (preset) => set({
        lights: preset.lights,
        ambient: preset.ambient,
        currentPreset: preset.name,
      }),

      // Model selection actions
      setSelectedModel: (modelId) => set({ selectedModelId: modelId }),

      addCustomModel: (model) => set((state) => ({
        customModels: [...state.customModels, {
          ...model,
          id: model.id || `custom-${Date.now()}`,
          addedAt: Date.now(),
          category: 'custom',
        }],
      })),

      removeCustomModel: (modelId) => set((state) => ({
        customModels: state.customModels.filter((m) => m.id !== modelId),
        selectedModelId: state.selectedModelId === modelId
          ? 'human-base'
          : state.selectedModelId,
      })),

      getModelById: (modelId) => {
        const state = get();
        return BUILT_IN_MODELS[modelId] ||
          state.customModels.find((m) => m.id === modelId) ||
          BUILT_IN_MODELS['human-base'];
      },

      // Reset to defaults
      resetToDefaults: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.LIGHT_REFERENCE,
    }
  )
);

// Helper to convert spherical to Cartesian coordinates
export const sphericalToCartesian = (azimuth, elevation, distance) => {
  const azimuthRad = (azimuth * Math.PI) / 180;
  const elevationRad = (elevation * Math.PI) / 180;

  return {
    x: distance * Math.cos(elevationRad) * Math.sin(azimuthRad),
    y: distance * Math.sin(elevationRad),
    z: distance * Math.cos(elevationRad) * Math.cos(azimuthRad),
  };
};
