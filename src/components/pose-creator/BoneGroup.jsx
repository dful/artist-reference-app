import { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { BoneSlider } from './BoneSlider';
import { BONE_DEFINITIONS } from '../../utils/constants';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';

export const BoneGroup = ({ groupId, label, bones }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const pose = usePoseCreatorStore((state) => state.pose);
  const updateBoneRotation = usePoseCreatorStore((state) => state.updateBoneRotation);
  const resetBone = usePoseCreatorStore((state) => state.resetBone);

  const handleResetGroup = () => {
    bones.forEach(boneName => resetBone(boneName));
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {label}
          </span>
          <span className="text-xs text-gray-400">
            ({bones.length} bones)
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleResetGroup();
          }}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Reset all bones in group"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {bones.map((boneName) => {
            const boneDef = BONE_DEFINITIONS[boneName];
            if (!boneDef) return null;

            const boneRotation = pose[boneName] || { x: 0, y: 0, z: 0 };

            return (
              <div key={boneName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {boneDef.label}
                  </span>
                  <button
                    onClick={() => resetBone(boneName)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Reset bone"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5 pl-2">
                  {['x', 'y', 'z'].map((axis) => (
                    <BoneSlider
                      key={axis}
                      axis={axis}
                      value={boneRotation[axis] || 0}
                      limits={boneDef.limits[axis]}
                      onChange={(a, val) => updateBoneRotation(boneName, a, val)}
                      onReset={() => updateBoneRotation(boneName, axis, 0)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
