import { usePaletteStore } from '../../stores';
import { Card, CardContent, Button } from '../common';
import { Trash2, Copy, Edit2, Folder } from 'lucide-react';
import { getReadableTextColor } from '../../utils/colorUtils';

export const PaletteManager = () => {
  const { palettes, loadPalette, deletePalette, duplicatePalette } = usePaletteStore();

  if (palettes.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No saved palettes
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create and save palettes in the Palette Generator to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {palettes.map((palette) => (
        <Card key={palette.id} hover className="overflow-hidden">
          <div className="flex">
            {palette.colors.slice(0, 5).map((color, i) => (
              <div
                key={i}
                className="flex-1 h-24 first:rounded-tl-lg last:rounded-tr-lg"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              {palette.name}
            </h3>
            <div className="flex flex-wrap gap-1 mb-3">
              {palette.colors.map((color, i) => (
                <span
                  key={i}
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: color,
                    color: getReadableTextColor(color),
                  }}
                >
                  {color}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => loadPalette(palette.id)}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => duplicatePalette(palette.id)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => deletePalette(palette.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
