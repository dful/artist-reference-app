import { RotateCcw, Save, Download } from 'lucide-react';
import { BoneGroup } from './BoneGroup';
import { Button } from '../common/Button';
import { BONE_GROUPS, createDefaultPose } from '../../utils/constants';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';

export const PoseControls = ({ onOpenSaveModal, onOpenExportModal }) => {
  const resetPose = usePoseCreatorStore((state) => state.resetPose);

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={RotateCcw}
          onClick={resetPose}
          className="flex-1"
        >
          Reset Pose
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={Save}
          onClick={onOpenSaveModal}
          className="flex-1"
        >
          Save Pose
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={Download}
          onClick={onOpenExportModal}
          className="flex-1"
        >
          Export
        </Button>
      </div>

      {/* Bone Groups */}
      <div className="space-y-3">
        {BONE_GROUPS.map((group) => (
          <BoneGroup
            key={group.id}
            groupId={group.id}
            label={group.label}
            bones={group.bones}
          />
        ))}
      </div>
    </div>
  );
};
