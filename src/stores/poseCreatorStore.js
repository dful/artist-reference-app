import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, BUILT_IN_POSABLE_MODELS, T_POSE_SHOULDERS } from '../utils/constants';

// T-Pose bone rotations (default user-editable pose starting from T-Pose)
// Note: Mixamo bone names from Blender export don't have colons
// All bones start at 0,0,0 which represents T-Pose when combined with corrections
const createDefaultBoneRotations = () => ({
  // Hips (root) - 0 means facing forward
  'mixamorigHips': { x: 0, y: 0, z: 0 },
  // Spine
  'mixamorigSpine': { x: 0, y: 0, z: 0 },
  'mixamorigSpine1': { x: 0, y: 0, z: 0 },
  'mixamorigSpine2': { x: 0, y: 0, z: 0 },
  // Neck and Head
  'mixamorigNeck': { x: 0, y: 0, z: 0 },
  'mixamorigHead': { x: 0, y: 0, z: 0 },
  // Shoulders - T-Pose values for horizontal arms
  'mixamorigLeftShoulder': { ...T_POSE_SHOULDERS['mixamorigLeftShoulder'] },
  'mixamorigRightShoulder': { ...T_POSE_SHOULDERS['mixamorigRightShoulder'] },
  // Arms - 0,0,0 means horizontal from T-Pose
  'mixamorigLeftArm': { x: 0, y: 0, z: 0 },
  'mixamorigRightArm': { x: 0, y: 0, z: 0 },
  'mixamorigLeftForeArm': { x: 0, y: 0, z: 0 },
  'mixamorigRightForeArm': { x: 0, y: 0, z: 0 },
  'mixamorigLeftHand': { x: 0, y: 0, z: 0 },
  'mixamorigRightHand': { x: 0, y: 0, z: 0 },
  // Legs
  'mixamorigLeftUpLeg': { x: 0, y: 0, z: 0 },
  'mixamorigRightUpLeg': { x: 0, y: 0, z: 0 },
  'mixamorigLeftLeg': { x: 0, y: 0, z: 0 },
  'mixamorigRightLeg': { x: 0, y: 0, z: 0 },
  'mixamorigLeftFoot': { x: 0, y: 0, z: 0 },
  'mixamorigRightFoot': { x: 0, y: 0, z: 0 },
  'mixamorigLeftToeBase': { x: 0, y: 0, z: 0 },
  'mixamorigRightToeBase': { x: 0, y: 0, z: 0 },
});

const initialState = {
  // Model selection
  selectedModelId: 'rigged-human',
  customPosableModels: [],

  // Bone rotations (in degrees)
  boneRotations: createDefaultBoneRotations(),

  // Currently selected bone for editing
  selectedBone: null,

  // Skeleton visualization
  showSkeleton: true,

  // Saved poses
  savedPoses: [],

  // Model transform
  model: {
    rotation: 0,
    scale: 1,
    position: { x: 0, y: 0, z: 0 },
  },
};

export const usePoseCreatorStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Bone selection
      setSelectedBone: (boneName) => set({ selectedBone: boneName }),

      // Update bone rotation
      updateBoneRotation: (boneName, axis, value) => set((state) => ({
        boneRotations: {
          ...state.boneRotations,
          [boneName]: {
            ...state.boneRotations[boneName],
            [axis]: value,
          },
        },
      })),

      // Set all rotations for a bone
      setBoneRotation: (boneName, rotation) => set((state) => ({
        boneRotations: {
          ...state.boneRotations,
          [boneName]: rotation,
        },
      })),

      // Reset single bone to T-Pose (not 0,0,0 which would break the model)
      resetBone: (boneName) => {
        const defaults = createDefaultBoneRotations();
        set((state) => ({
          boneRotations: {
            ...state.boneRotations,
            [boneName]: { ...defaults[boneName] },
          },
        }));
      },

      // Reset all bones to 0
      resetAllBones: () => set({
        boneRotations: createDefaultBoneRotations(),
      }),

      // Apply pose preset (replaces all bone rotations)
      applyPosePreset: (preset) => set({
        boneRotations: { ...preset.boneRotations },
      }),

      // Apply full pose (from saved poses)
      applyPose: (pose) => set({
        boneRotations: { ...pose.boneRotations },
      }),

      // Save current pose
      savePose: (name, thumbnail = null) => {
        const state = get();
        const newPose = {
          id: `pose-${Date.now()}`,
          name,
          boneRotations: { ...state.boneRotations },
          thumbnail,
          createdAt: Date.now(),
        };
        set((state) => ({
          savedPoses: [...state.savedPoses, newPose],
        }));
        return newPose.id;
      },

      // Delete saved pose
      deletePose: (poseId) => set((state) => ({
        savedPoses: state.savedPoses.filter((p) => p.id !== poseId),
      })),

      // Toggle skeleton visibility
      toggleSkeleton: () => set((state) => ({
        showSkeleton: !state.showSkeleton,
      })),

      // Model selection
      setSelectedModel: (modelId) => set({ selectedModelId: modelId }),

      // Add custom posable model
      addCustomPosableModel: (model) => set((state) => ({
        customPosableModels: [...state.customPosableModels, {
          ...model,
          id: model.id || `custom-pose-${Date.now()}`,
          addedAt: Date.now(),
          category: 'custom',
        }],
      })),

      // Remove custom posable model
      removeCustomPosableModel: (modelId) => set((state) => ({
        customPosableModels: state.customPosableModels.filter((m) => m.id !== modelId),
        selectedModelId: state.selectedModelId === modelId ? 'rigged-human' : state.selectedModelId,
      })),

      // Get model by ID
      getPosableModelById: (modelId) => {
        const state = get();
        return BUILT_IN_POSABLE_MODELS[modelId] ||
          state.customPosableModels.find((m) => m.id === modelId) ||
          BUILT_IN_POSABLE_MODELS['rigged-human'];
      },

      // Model transform
      updateModel: (updates) => set((state) => ({
        model: { ...state.model, ...updates },
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

      // Mirror pose (left <-> right)
      mirrorPose: () => {
        const state = get();
        const pairs = [
          ['mixamorigLeftArm', 'mixamorigRightArm'],
          ['mixamorigLeftForeArm', 'mixamorigRightForeArm'],
          ['mixamorigLeftHand', 'mixamorigRightHand'],
          ['mixamorigLeftUpLeg', 'mixamorigRightUpLeg'],
          ['mixamorigLeftLeg', 'mixamorigRightLeg'],
          ['mixamorigLeftFoot', 'mixamorigRightFoot'],
          ['mixamorigLeftToeBase', 'mixamorigRightToeBase'],
          ['mixamorigLeftShoulder', 'mixamorigRightShoulder'],
        ];

        const newRotations = { ...state.boneRotations };

        pairs.forEach(([left, right]) => {
          const leftRot = state.boneRotations[left];
          const rightRot = state.boneRotations[right];
          // Mirror: swap and negate Y and Z for typical humanoid rig
          newRotations[left] = {
            x: rightRot.x,
            y: -rightRot.y,
            z: -rightRot.z,
          };
          newRotations[right] = {
            x: leftRot.x,
            y: -leftRot.y,
            z: -leftRot.z,
          };
        });

        set({ boneRotations: newRotations });
      },

      // Reset to defaults
      resetToDefaults: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.POSE_CREATOR,
    }
  )
);
