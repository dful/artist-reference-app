import { Trash2, Clock, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';

export const SavedPoses = () => {
  const savedPoses = usePoseCreatorStore((state) => state.savedPoses);
  const loadPose = usePoseCreatorStore((state) => state.loadPose);
  const deletePose = usePoseCreatorStore((state) => state.deletePose);
  const [menuOpenId, setMenuOpenId] = useState(null);

  if (savedPoses.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No saved poses yet</p>
        <p className="text-xs mt-1">Save your current pose to reuse it later</p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Saved Poses ({savedPoses.length})
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {savedPoses.map((savedPose) => (
          <div
            key={savedPose.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <button
              onClick={() => loadPose(savedPose.pose)}
              className="flex-1 text-left"
            >
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {savedPose.name}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <Clock className="w-3 h-3" />
                {formatDate(savedPose.createdAt)}
              </div>
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpenId(menuOpenId === savedPose.id ? null : savedPose.id)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpenId === savedPose.id && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpenId(null)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[100px]">
                    <button
                      onClick={() => {
                        deletePose(savedPose.id);
                        setMenuOpenId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
