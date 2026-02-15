import { useState } from 'react';
import { Download, Save, Loader2, Check, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';
import { exportAsGLB, saveToLightReference } from '../../services/poseExportService';

export const ExportModal = ({ isOpen, onClose }) => {
  const [modelName, setModelName] = useState('');
  const [exportType, setExportType] = useState(null); // 'download' | 'save'
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const pose = usePoseCreatorStore((state) => state.pose);

  const handleExport = async (type) => {
    setExportType(type);
    setStatus('loading');
    setError(null);

    try {
      if (type === 'download') {
        const filename = modelName.trim() || 'posed-model';
        await exportAsGLB(pose, `${filename}.glb`);
        setStatus('success');
      } else if (type === 'save') {
        const name = modelName.trim() || `Custom Pose ${Date.now()}`;
        await saveToLightReference(pose, name);
        setStatus('success');
      }
    } catch (err) {
      console.error('Export failed:', err);
      setError(err.message || 'Export failed');
      setStatus('error');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setExportType(null);
    setError(null);
    setModelName('');
    onClose();
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            {exportType === 'download' ? 'Generating GLB file...' : 'Saving to app...'}
          </p>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
            Export Successful!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {exportType === 'download'
              ? 'Your posed model has been downloaded.'
              : 'You can now use this model in Light Reference.'}
          </p>
          <Button variant="primary" onClick={handleClose}>
            Done
          </Button>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
            Export Failed
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            {error}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStatus('idle')}>
              Try Again
            </Button>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Model Name (optional)
          </label>
          <Input
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="e.g., My Custom Pose"
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Export Options
          </h4>

          <button
            onClick={() => handleExport('download')}
            className="w-full flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Download className="w-5 h-5 text-primary-500 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Download as GLB
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Save the posed model to your computer as a .glb file
              </div>
            </div>
          </button>

          <button
            onClick={() => handleExport('save')}
            className="w-full flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Save className="w-5 h-5 text-primary-500 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Save to Light Reference
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Add this posed model to your custom models in Light Reference
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Export Posed Model"
      size="md"
    >
      {renderContent()}
    </Modal>
  );
};
