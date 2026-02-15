import { POSE_PRESETS } from '../../utils/constants';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';

export const PosePresets = () => {
  const loadPose = usePoseCreatorStore((state) => state.loadPose);
  const currentPresetId = usePoseCreatorStore((state) => {
    // Check if current pose matches any preset
    const pose = state.pose;
    for (const preset of POSE_PRESETS) {
      if (posesMatch(pose, preset.pose)) {
        return preset.id;
      }
    }
    return null;
  });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Presets
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {POSE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => loadPose(preset.pose)}
            className={`
              p-3 rounded-lg text-left transition-all
              ${currentPresetId === preset.id
                ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500'
                : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
            title={preset.description}
          >
            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {preset.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {preset.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Helper to check if two poses match
function posesMatch(pose1, pose2) {
  const keys1 = Object.keys(pose1);
  const keys2 = Object.keys(pose2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!pose2[key]) return false;
    if (
      Math.abs(pose1[key].x - pose2[key].x) > 1 ||
      Math.abs(pose1[key].y - pose2[key].y) > 1 ||
      Math.abs(pose1[key].z - pose2[key].z) > 1
    ) {
      return false;
    }
  }

  return true;
}
