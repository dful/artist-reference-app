import { lazy, Suspense } from 'react';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';
import { LightControls, LightPresetSelector, ModelSelector, ModelControls } from '../components/light-reference';
import { useLightReferenceStore } from '../stores/lightReferenceStore';

// Lazy load the 3D scene for better initial load performance
const Scene3D = lazy(() =>
  import('../components/light-reference/Scene3D').then((module) => ({
    default: module.Scene3D,
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
  const { updateModel, toggleAutoRotate, resetToDefaults } = useLightReferenceStore();
  const model = useLightReferenceStore((state) => state.model);

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
        onClick={toggleAutoRotate}
        className={`p-3 rounded-lg transition-colors min-w-11 min-h-11 ${
          model.autoRotate
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="Auto Rotate"
      >
        <Move3D className="w-4 h-4" />
      </button>
      <button
        onClick={resetToDefaults}
        className="px-4 py-2.5 min-h-11 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors ml-auto"
      >
        Reset All
      </button>
    </div>
  );
};

export const LightReferencePage = () => {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4 md:gap-6">
      {/* 3D Viewport */}
      <div className="flex-1 flex flex-col min-h-[300px] md:min-h-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Light Reference
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Study how light affects form. Drag to orbit, scroll to zoom.
            </p>
          </div>
          <QuickActions />
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden bg-gray-900">
          <Suspense fallback={<LoadingSpinner />}>
            <Scene3D className="w-full h-full" />
          </Suspense>
        </div>

        {/* Controls hint */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex gap-4">
          <span>🖱️ Drag to rotate</span>
          <span>⚙️ Scroll to zoom</span>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-full md:w-72 lg:w-80 flex-shrink-0 space-y-4 md:space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xs border border-gray-200 dark:border-gray-700">
          <ModelSelector />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xs border border-gray-200 dark:border-gray-700">
          <ModelControls />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xs border border-gray-200 dark:border-gray-700">
          <LightPresetSelector />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xs border border-gray-200 dark:border-gray-700">
          <LightControls />
        </div>
      </div>
    </div>
  );
};
