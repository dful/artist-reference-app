import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, createDefaultPose } from '../utils/constants';

const initialState = {
  // Current pose state (Euler angles in degrees for UI)
  pose: createDefaultPose(),

  // Saved poses array
  savedPoses: [],

  // Export state
  isExporting: false,
  exportError: null,
};

export const usePoseCreatorStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Update a single bone's rotation on one axis
      updateBoneRotation: (boneName, axis, value) => {
        const boneDef = get().getBoneDefinition(boneName);
        if (!boneDef) return;

        // Clamp value to limits
        const [min, max] = boneDef.limits[axis];
        const clampedValue = Math.max(min, Math.min(max, value));

        set((state) => ({
          pose: {
            ...state.pose,
            [boneName]: {
              ...state.pose[boneName],
              [axis]: clampedValue,
            },
          },
        }));
      },

      // Update all axes of a bone at once
      updateBone: (boneName, rotation) => {
        if (!get().pose[boneName]) return;

        const boneDef = get().getBoneDefinition(boneName);
        if (!boneDef) return;

        // Clamp all values to limits
        const clampedRotation = {
          x: Math.max(boneDef.limits.x[0], Math.min(boneDef.limits.x[1], rotation.x || 0)),
          y: Math.max(boneDef.limits.y[0], Math.min(boneDef.limits.y[1], rotation.y || 0)),
          z: Math.max(boneDef.limits.z[0], Math.min(boneDef.limits.z[1], rotation.z || 0)),
        };

        set((state) => ({
          pose: {
            ...state.pose,
            [boneName]: clampedRotation,
          },
        }));
      },

      // Reset a single bone to default (0, 0, 0)
      resetBone: (boneName) => {
        if (!get().pose[boneName]) return;

        set((state) => ({
          pose: {
            ...state.pose,
            [boneName]: { x: 0, y: 0, z: 0 },
          },
        }));
      },

      // Reset entire pose to default
      resetPose: () => {
        set({ pose: createDefaultPose() });
      },

      // Load a pose (from saved or preset)
      loadPose: (pose) => {
        // Validate and merge with default to ensure all bones exist
        const defaultPose = createDefaultPose();
        const mergedPose = { ...defaultPose };

        Object.keys(pose).forEach(boneName => {
          if (defaultPose[boneName]) {
            mergedPose[boneName] = { ...pose[boneName] };
          }
        });

        set({ pose: mergedPose });
      },

      // Save current pose with a name
      savePose: (name) => {
        const newPose = {
          id: `pose-${Date.now()}`,
          name,
          pose: { ...get().pose },
          createdAt: Date.now(),
        };

        set((state) => ({
          savedPoses: [...state.savedPoses, newPose],
        }));

        return newPose.id;
      },

      // Update a saved pose's name
      renamePose: (poseId, newName) => {
        set((state) => ({
          savedPoses: state.savedPoses.map((p) =>
            p.id === poseId ? { ...p, name: newName } : p
          ),
        }));
      },

      // Delete a saved pose
      deletePose: (poseId) => {
        set((state) => ({
          savedPoses: state.savedPoses.filter((p) => p.id !== poseId),
        }));
      },

      // Set exporting state
      setExporting: (isExporting) => {
        set({ isExporting });
      },

      // Set export error
      setExportError: (error) => {
        set({ exportError: error });
      },

      // Get bone definition (helper)
      getBoneDefinition: (boneName) => {
        // This will be populated from constants when imported
        const { BONE_DEFINITIONS } = require('../utils/constants');
        return BONE_DEFINITIONS[boneName] || null;
      },

      // Get saved pose by ID
      getSavedPose: (poseId) => {
        return get().savedPoses.find((p) => p.id === poseId);
      },

      // Clear all saved poses
      clearSavedPoses: () => {
        set({ savedPoses: [] });
      },
    }),
    {
      name: STORAGE_KEYS.POSE_CREATOR,
      partialize: (state) => ({
        savedPoses: state.savedPoses,
      }),
    }
  )
);
