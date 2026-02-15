import { lazy, Suspense, useState, useRef } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';
import { PoseControls, PosePresets, SavedPoses, ExportModal, SavePoseModal } from '../components/pose-creator';
import { usePoseCreatorStore } from '../stores/poseCreatorStore';

// Lazy load the 3D scene for better initial load performance
const PoseScene = lazy(() =>
  import('../components/pose-creator/PoseScene').then((module) => ({
    default: module.PoseScene,
  }))
);

const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-2xl">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-400">Loading 3D scene...</span>
    </div>
  </div>
);

const QuickActions = () => {
  const resetPose = usePoseCreatorStore((state) => state.resetPose);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={resetPose}
        className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        title="Reset Pose"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};

export const PoseCreatorPage = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const sceneRef = useRef(null);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6">
      {/* 3D Viewport */}
      <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pose Creator
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Articulate the model by adjusting bone rotations. Drag to orbit, scroll to zoom.
            </p>
          </div>
          <QuickActions />
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden bg-gray-900">
          <Suspense fallback={<LoadingSpinner />}>
            <PoseScene ref={sceneRef} className="w-full h-full" />
          </Suspense>
        </div>

        {/* Controls hint */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex gap-4">
          <span>Drag to rotate view</span>
          <span>Scroll to zoom</span>
          <span>Use sliders to pose</span>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-full lg:w-96 flex-shrink-0 space-y-6 overflow-y-auto pb-4">
        {/* Main Pose Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <PoseControls
            onOpenSaveModal={() => setShowSaveModal(true)}
            onOpenExportModal={() => setShowExportModal(true)}
          />
        </div>

        {/* Presets */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <PosePresets />
        </div>

        {/* Saved Poses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <SavedPoses />
        </div>
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
      <SavePoseModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
      />
    </div>
  );
};
