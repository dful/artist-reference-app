import { RotateCcw } from 'lucide-react';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';
import { BONE_CONSTRAINTS } from '../../utils/constants';

// Bone display names for UI
const BONE_DISPLAY_NAMES = {
  'mixamorigHips': 'Hips',
  'mixamorigSpine': 'Spine',
  'mixamorigSpine1': 'Spine 1',
  'mixamorigSpine2': 'Spine 2',
  'mixamorigNeck': 'Neck',
  'mixamorigHead': 'Head',
  'mixamorigLeftShoulder': 'Left Shoulder',
  'mixamorigRightShoulder': 'Right Shoulder',
  'mixamorigLeftArm': 'Left Arm',
  'mixamorigRightArm': 'Right Arm',
  'mixamorigLeftForeArm': 'Left Forearm',
  'mixamorigRightForeArm': 'Right Forearm',
  'mixamorigLeftHand': 'Left Hand',
  'mixamorigRightHand': 'Right Hand',
  'mixamorigLeftUpLeg': 'Left Thigh',
  'mixamorigRightUpLeg': 'Right Thigh',
  'mixamorigLeftLeg': 'Left Shin',
  'mixamorigRightLeg': 'Right Shin',
  'mixamorigLeftFoot': 'Left Foot',
  'mixamorigRightFoot': 'Right Foot',
  'mixamorigLeftToeBase': 'Left Toe',
  'mixamorigRightToeBase': 'Right Toe',
};

// Bone type classification for axis labels and quick values
const getBoneType = (boneName) => {
  if (boneName.includes('Arm') && !boneName.includes('Fore')) return 'arm';
  if (boneName.includes('ForeArm')) return 'forearm';
  if (boneName.includes('Shoulder')) return 'shoulder';
  if (boneName.includes('Hand')) return 'hand';
  if (boneName.includes('UpLeg')) return 'thigh';
  if (boneName.includes('Leg') && !boneName.includes('UpLeg')) return 'knee';
  if (boneName.includes('Foot')) return 'foot';
  if (boneName.includes('Spine')) return 'spine';
  if (boneName.includes('Neck') || boneName.includes('Head')) return 'head';
  return 'default';
};

// Axis labels based on bone type
// Labels match actual bone behavior in the model
const getAxisLabels = (boneType, isLeft) => {
  switch (boneType) {
    case 'arm':
      return {
        x: 'Down/Up',
        y: 'Twist',
        z: 'Fwd/Back',
      };
    case 'forearm':
      return {
        x: 'Lateral',
        y: 'Rotation',
        z: 'Elbow Flex',  // Negative = bend elbow
      };
    case 'shoulder':
      return {
        x: 'Rotate',
        y: 'Down/Up',
        z: 'Fwd/Back',
      };
    case 'knee':
      return {
        x: 'Bend',       // Negative = flex knee
        y: 'Twist',
        z: 'Side',
      };
    case 'thigh':
      return {
        x: 'Down/Up',
        y: 'Rotate',
        z: 'Side',
      };
    case 'spine':
    case 'head':
      return {
        x: 'Bend F/B',
        y: 'Rotate',
        z: 'Bend Side',
      };
    default:
      return {
        x: 'X',
        y: 'Y',
        z: 'Z',
      };
  }
};

// Quick values based on bone type (matching actual constraint ranges)
const getQuickValues = (boneType, isLeft) => {
  switch (boneType) {
    case 'arm':
      return {
        x: [-90, -45, 0, 45, 90],  // Up to down
        z: [-45, 0, 45],           // Forward/back
      };
    case 'forearm':
      // Mirrored: left uses positive Z for flex, right uses negative Z
      return {
        z: isLeft ? [0, 45, 90, 135] : [-135, -90, -45, 0],
        x: [-30, 0, 30],           // Lateral
        y: [-90, 0, 90],           // Rotation
      };
    case 'knee':
      return {
        x: [-135, -90, -45, 0],    // Knee bend: 0=straight, -135=fully bent
      };
    case 'thigh':
      return {
        x: [-90, -45, 0, 45],      // Leg lift
        y: [-30, 0, 30],           // Rotation
      };
    case 'spine':
    case 'head':
      return {
        x: [-20, 0, 20],
        y: [-20, 0, 20],
      };
    default:
      return {
        x: [-45, 0, 45],
      };
  }
};

const RotationSlider = ({ axis, value, onChange, constraints, label, disabled }) => {
  const min = constraints?.[0] ?? -180;
  const max = constraints?.[1] ?? 180;
  const isLocked = min === 0 && max === 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {axis.toUpperCase()}: {label}
        </label>
        <span className={`text-xs font-mono ${isLocked ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
          {isLocked ? 'Locked' : `${value}°`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled || isLocked}
        className={`w-full h-2 rounded-full appearance-none cursor-pointer
          ${isLocked
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'bg-gray-200 dark:bg-gray-700 accent-primary-500'
          }`}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}°</span>
        <span>{max}°</span>
      </div>
    </div>
  );
};

const QuickButton = ({ axis, value, onClick, currentValue }) => (
  <button
    onClick={() => onClick(axis, value)}
    className={`px-3 py-1.5 min-h-9 text-xs rounded transition-colors
      ${currentValue === value
        ? 'bg-primary-500 text-white'
        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
      }`}
  >
    {axis.toUpperCase()}:{value}°
  </button>
);

export const BoneControls = () => {
  const selectedBone = usePoseCreatorStore((state) => state.selectedBone);
  const boneRotations = usePoseCreatorStore((state) => state.boneRotations);
  const updateBoneRotation = usePoseCreatorStore((state) => state.updateBoneRotation);
  const resetBone = usePoseCreatorStore((state) => state.resetBone);

  if (!selectedBone) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Select a bone from the list to adjust its rotation
        </p>
      </div>
    );
  }

  const currentRotation = boneRotations[selectedBone] || { x: 0, y: 0, z: 0 };
  const constraints = BONE_CONSTRAINTS[selectedBone] || {};
  const displayName = BONE_DISPLAY_NAMES[selectedBone] || selectedBone;
  const boneType = getBoneType(selectedBone);
  const isLeft = selectedBone.includes('Left');
  const axisLabels = getAxisLabels(boneType, isLeft);
  const quickValues = getQuickValues(boneType, isLeft);

  const handleQuickClick = (axis, value) => {
    updateBoneRotation(selectedBone, axis, value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {displayName}
        </h3>
        <button
          onClick={() => resetBone(selectedBone)}
          className="flex items-center gap-1 px-3 py-1.5 min-h-9 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Reset to T-Pose"
        >
          <RotateCcw className="w-3 h-3" />
          T-Pose
        </button>
      </div>

      <div className="space-y-4">
        <RotationSlider
          axis="x"
          value={currentRotation.x}
          onChange={(val) => updateBoneRotation(selectedBone, 'x', val)}
          constraints={constraints.x}
          label={axisLabels.x}
        />
        <RotationSlider
          axis="y"
          value={currentRotation.y}
          onChange={(val) => updateBoneRotation(selectedBone, 'y', val)}
          constraints={constraints.y}
          label={axisLabels.y}
        />
        <RotationSlider
          axis="z"
          value={currentRotation.z}
          onChange={(val) => updateBoneRotation(selectedBone, 'z', val)}
          constraints={constraints.z}
          label={axisLabels.z}
        />
      </div>

      {/* Quick values - organized by axis */}
      <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-400">Quick:</span>
        {Object.entries(quickValues).map(([axis, values]) => (
          <div key={axis} className="flex flex-wrap gap-1">
            {values.map((val) => (
              <QuickButton
                key={`${axis}-${val}`}
                axis={axis}
                value={val}
                onClick={handleQuickClick}
                currentValue={currentRotation[axis]}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
