import { lazy, Suspense } from 'react';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { BoneControls, BoneSelector, ModelSelector, PosePresetSelector, PoseExporter } from '../components/pose-creator';
import { usePoseCreatorStore } from '../stores/poseCreatorStore';

// Lazy load the 3D scene for better initial load performance
const PoseScene3D = lazy(() =>
  import('../components/pose-creator/PoseScene3D').then((module) => ({
    default: module.PoseScene3D,
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
  const { updateModel, resetAllBones } = usePoseCreatorStore();
  const model = usePoseCreatorStore((state) => state.model);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => updateModel({ rotation: model.rotation - 15 })}
        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-11 min-h-11"
        title="Rotate Left"
      >
        <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
      <button
        onClick={() => updateModel({ rotation: model.rotation + 15 })}
        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-11 min-h-11"
        title="Rotate Right"
      >
        <RotateCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
      <button
        onClick={() => updateModel({ scale: Math.min(model.scale + 0.1, 2) })}
        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-11 min-h-11"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
      <button
        onClick={() => updateModel({ scale: Math.max(model.scale - 0.1, 0.5) })}
        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-11 min-h-11"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
      <button
        onClick={resetAllBones}
        className="px-4 py-2.5 min-h-11 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors ml-auto flex items-center gap-1"
        title="Reset All Bones"
      >
        <RefreshCw className="w-4 h-4" />
        Reset Pose
      </button>
    </div>
  );
};

export const PoseCreatorPage = () => {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4 md:gap-6">
      {/* 3D Viewport */}
      <div className="flex-1 flex flex-col min-h-[300px] md:min-h-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pose Creator
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create custom poses by manipulating the skeleton. Drag to orbit, scroll to zoom.
            </p>
          </div>
          <QuickActions />
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden bg-gray-900">
          <Suspense fallback={<LoadingSpinner />}>
            <PoseScene3D className="w-full h-full" />
          </Suspense>
        </div>

        {/* Controls hint */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex gap-4">
          <span>Drag to rotate</span>
          <span>Scroll to zoom</span>
          <span>Select bones to manipulate</span>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-full md:w-72 lg:w-80 flex-shrink-0 space-y-4 md:space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xs border border-gray-200 dark:border-gray-700">
          <ModelSelector />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xs border border-gray-200 dark:border-gray-700">
          <PosePresetSelector />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xs border border-gray-200 dark:border-gray-700">
          <BoneSelector />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xs border border-gray-200 dark:border-gray-700">
          <BoneControls />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xs border border-gray-200 dark:border-gray-700">
          <PoseExporter />
        </div>
      </div>
    </div>
  );
};
