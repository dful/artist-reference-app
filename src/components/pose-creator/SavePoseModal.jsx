import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';

export const SavePoseModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const savePose = usePoseCreatorStore((state) => state.savePose);

  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      savePose(name.trim());
      setName('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Save Pose"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pose Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Running Pose, Sitting, etc."
            autoFocus
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={loading ? Loader2 : Save}
            onClick={handleSave}
            disabled={!name.trim() || loading}
            loading={loading}
          >
            Save Pose
          </Button>
        </div>
      </div>
    </Modal>
  );
};
