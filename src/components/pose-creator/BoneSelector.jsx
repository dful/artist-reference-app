import { useState } from 'react';
import { ChevronRight, ChevronDown, User, Circle } from 'lucide-react';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';

// Bone hierarchy for Mixamo skeleton (Blender export format - no colons)
const BONE_HIERARCHY = [
  {
    name: 'mixamorigHips',
    label: 'Hips',
    children: [
      {
        name: 'mixamorigSpine',
        label: 'Spine',
        children: [
          {
            name: 'mixamorigSpine1',
            label: 'Spine 1',
            children: [
              {
                name: 'mixamorigSpine2',
                label: 'Spine 2',
                children: [
                  {
                    name: 'mixamorigNeck',
                    label: 'Neck',
                    children: [
                      { name: 'mixamorigHead', label: 'Head' },
                    ],
                  },
                  {
                    name: 'mixamorigLeftShoulder',
                    label: 'L Shoulder',
                    children: [
                      { name: 'mixamorigLeftArm', label: 'L Arm', children: [
                        { name: 'mixamorigLeftForeArm', label: 'L Forearm', children: [
                          { name: 'mixamorigLeftHand', label: 'L Hand' },
                        ]},
                      ]},
                    ],
                  },
                  {
                    name: 'mixamorigRightShoulder',
                    label: 'R Shoulder',
                    children: [
                      { name: 'mixamorigRightArm', label: 'R Arm', children: [
                        { name: 'mixamorigRightForeArm', label: 'R Forearm', children: [
                          { name: 'mixamorigRightHand', label: 'R Hand' },
                        ]},
                      ]},
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'mixamorigLeftUpLeg',
        label: 'L Thigh',
        children: [
          { name: 'mixamorigLeftLeg', label: 'L Shin', children: [
            { name: 'mixamorigLeftFoot', label: 'L Foot', children: [
              { name: 'mixamorigLeftToeBase', label: 'L Toe' },
            ]},
          ]},
        ],
      },
      {
        name: 'mixamorigRightUpLeg',
        label: 'R Thigh',
        children: [
          { name: 'mixamorigRightLeg', label: 'R Shin', children: [
            { name: 'mixamorigRightFoot', label: 'R Foot', children: [
              { name: 'mixamorigRightToeBase', label: 'R Toe' },
            ]},
          ]},
        ],
      },
    ],
  },
];

// Bone tree item component
const BoneItem = ({ bone, level = 0, selectedBone, onSelect, expanded, onToggle }) => {
  const hasChildren = bone.children && bone.children.length > 0;
  const isExpanded = expanded[bone.name];
  const isSelected = selectedBone === bone.name;

  return (
    <div>
      <button
        onClick={() => onSelect(bone.name)}
        onDoubleClick={() => hasChildren && onToggle(bone.name)}
        className={`w-full flex items-center gap-1 px-2 py-2.5 min-h-11 rounded-lg text-left text-sm transition-colors
          ${isSelected
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(bone.name);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        ) : (
          <Circle className="w-3 h-3 opacity-30" />
        )}
        <span className="truncate">{bone.label}</span>
      </button>

      {hasChildren && isExpanded && (
        <div>
          {bone.children.map((child) => (
            <BoneItem
              key={child.name}
              bone={child}
              level={level + 1}
              selectedBone={selectedBone}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const BoneSelector = () => {
  const selectedBone = usePoseCreatorStore((state) => state.selectedBone);
  const setSelectedBone = usePoseCreatorStore((state) => state.setSelectedBone);
  const [expanded, setExpanded] = useState({
    'mixamorigHips': true,
    'mixamorigSpine': true,
    'mixamorigSpine1': true,
    'mixamorigSpine2': true,
  });

  const handleToggle = (boneName) => {
    setExpanded((prev) => ({
      ...prev,
      [boneName]: !prev[boneName],
    }));
  };

  const expandAll = () => {
    const allBones = {};
    const collect = (bones) => {
      bones.forEach((b) => {
        if (b.children) {
          allBones[b.name] = true;
          collect(b.children);
        }
      });
    };
    collect(BONE_HIERARCHY);
    setExpanded(allBones);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4" />
          Skeleton
        </h3>
        <div className="flex gap-1">
          <button
            onClick={expandAll}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Expand
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={collapseAll}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Collapse
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto rounded-lg bg-gray-50 dark:bg-gray-900/50 p-1">
        {BONE_HIERARCHY.map((bone) => (
          <BoneItem
            key={bone.name}
            bone={bone}
            selectedBone={selectedBone}
            onSelect={setSelectedBone}
            expanded={expanded}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {selectedBone && (
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          Selected: <code className="text-primary-600 dark:text-primary-400">{selectedBone}</code>
        </div>
      )}
    </div>
  );
};
