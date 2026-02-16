import { useState } from 'react';
import { Check, Save, Trash2 } from 'lucide-react';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';
import { T_POSE_SHOULDERS } from '../../utils/constants';

// Helper to create complete pose with all bones defined
// Each pose is COMPLETE - not a partial overlay
const createPose = (armRotations = {}) => ({
  // Hips
  'mixamorigHips': { x: 0, y: 0, z: 0 },
  // Spine
  'mixamorigSpine': { x: 0, y: 0, z: 0 },
  'mixamorigSpine1': { x: 0, y: 0, z: 0 },
  'mixamorigSpine2': { x: 0, y: 0, z: 0 },
  // Neck and Head
  'mixamorigNeck': { x: 0, y: 0, z: 0 },
  'mixamorigHead': { x: 0, y: 0, z: 0 },
  // Shoulders - T-Pose base
  'mixamorigLeftShoulder': { ...T_POSE_SHOULDERS['mixamorigLeftShoulder'] },
  'mixamorigRightShoulder': { ...T_POSE_SHOULDERS['mixamorigRightShoulder'] },
  // Arms, ForeArms, Hands
  'mixamorigLeftArm': armRotations.leftArm || { x: 0, y: 0, z: 0 },
  'mixamorigRightArm': armRotations.rightArm || { x: 0, y: 0, z: 0 },
  'mixamorigLeftForeArm': armRotations.leftForeArm || { x: 0, y: 0, z: 0 },
  'mixamorigRightForeArm': armRotations.rightForeArm || { x: 0, y: 0, z: 0 },
  'mixamorigLeftHand': armRotations.leftHand || { x: 0, y: 0, z: 0 },
  'mixamorigRightHand': armRotations.rightHand || { x: 0, y: 0, z: 0 },
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

// Predefined poses (Mixamo bone names from Blender export - no colons)
// Each preset is a COMPLETE pose - all bones defined
// Axis conventions (based on actual model behavior):
//   Shoulder: X=Rotate, Y=Down/Up, Z=Fwd/Back
//   Arm: X=Down/Up, Y=Twist, Z=Fwd/Back
//   ForeArm: X=Lateral, Y=Rotation, Z=ElbowFlex (negative = bend)
//   Leg: X=Bend (negative = flex knee)
export const POSE_PRESETS = {
  tPose: {
    name: 'T-Pose',
    description: 'Arms extended horizontally',
    boneRotations: createPose(),
  },
  aPose: {
    name: 'A-Pose',
    description: 'Arms ~45° down from horizontal',
    boneRotations: createPose({
      leftArm: { x: 45, y: 0, z: 0 },   // X+ lowers arm
      rightArm: { x: 45, y: 0, z: 0 },
    }),
  },
  standing: {
    name: 'Standing',
    description: 'Arms down at sides, slight elbow bend',
    boneRotations: createPose({
      leftArm: { x: 90, y: 0, z: 0 },        // Arms down at sides
      rightArm: { x: 90, y: 0, z: 0 },
      leftForeArm: { x: 0, y: 0, z: 20 },    // Left: Z+ flexes elbow
      rightForeArm: { x: 0, y: 0, z: -20 },  // Right: Z- flexes elbow
    }),
  },
  forwardReach: {
    name: 'Forward Reach',
    description: 'Arms extended forward horizontally',
    boneRotations: createPose({
      // Arms forward from horizontal
      leftArm: { x: 0, y: 0, z: 90 },    // Z+ forward for left
      rightArm: { x: 0, y: 0, z: -90 },   // Z- forward for right
    }),
  },
};

const PresetButton = ({ preset, onClick, isSelected }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-lg border transition-colors
      ${isSelected
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }
    `}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-sm text-gray-900 dark:text-white">
          {preset.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {preset.description}
        </div>
      </div>
      {isSelected && (
        <Check className="w-4 h-4 text-primary-500" />
      )}
    </div>
  </button>
);

export const PosePresetSelector = () => {
  const applyPosePreset = usePoseCreatorStore((state) => state.applyPosePreset);
  const applyPose = usePoseCreatorStore((state) => state.applyPose);
  const savePose = usePoseCreatorStore((state) => state.savePose);
  const deletePose = usePoseCreatorStore((state) => state.deletePose);
  const savedPoses = usePoseCreatorStore((state) => state.savedPoses);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [poseName, setPoseName] = useState('');

  const handlePresetSelect = (presetKey) => {
    setSelectedPreset(presetKey);
    applyPosePreset(POSE_PRESETS[presetKey]);
  };

  const handleSavedPoseSelect = (pose) => {
    setSelectedPreset(pose.id);
    applyPose(pose);
  };

  const handleSavePose = () => {
    if (!poseName.trim()) return;
    savePose(poseName.trim());
    setPoseName('');
    setShowSaveDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Poses
        </h3>
        <button
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700"
        >
          <Save className="w-3 h-3" />
          Save Current
        </button>
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="flex gap-2">
          <input
            type="text"
            value={poseName}
            onChange={(e) => setPoseName(e.target.value)}
            placeholder="Pose name..."
            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSavePose()}
          />
          <button
            onClick={handleSavePose}
            disabled={!poseName.trim()}
            className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Save
          </button>
        </div>
      )}

      {/* Presets */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(POSE_PRESETS).map(([key, preset]) => (
            <PresetButton
              key={key}
              preset={preset}
              onClick={() => handlePresetSelect(key)}
              isSelected={selectedPreset === key}
            />
          ))}
        </div>
      </div>

      {/* Saved poses */}
      {savedPoses.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
          <div className="space-y-1">
            {savedPoses.map((pose) => (
              <div
                key={pose.id}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer
                  ${selectedPreset === pose.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
                onClick={() => handleSavedPoseSelect(pose)}
              >
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {pose.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePose(pose.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
