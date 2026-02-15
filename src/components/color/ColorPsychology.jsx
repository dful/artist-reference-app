import { useState } from 'react';
import { colorPsychology, colorCategories } from '../../data/colorPsychology';
import { Card, CardHeader, CardContent } from '../common';
import { getReadableTextColor } from '../../utils/colorUtils';
import { Globe, Heart, AlertTriangle, Lightbulb } from 'lucide-react';

export const ColorPsychology = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedColor, setSelectedColor] = useState(null);

  const filteredColors = selectedCategory === 'All'
    ? colorPsychology
    : colorPsychology.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {colorCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Color grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredColors.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color)}
            className={`
              relative group
              ${selectedColor?.name === color.name ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
            `}
          >
            <div
              className="aspect-square rounded-xl shadow-md group-hover:scale-105 transition-transform"
              style={{ backgroundColor: color.hex }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center font-medium text-sm"
                style={{ color: getReadableTextColor(color.hex) }}
              >
                {color.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected color details */}
      {selectedColor && (
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg shadow-md"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedColor.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedColor.category} • {selectedColor.hex}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Emotions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Emotions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedColor.emotions.map((emotion) => (
                      <span
                        key={emotion}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Positive associations */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-green-500" />
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Positive Associations
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedColor.positive.map((trait) => (
                      <span
                        key={trait}
                        className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Negative associations */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Negative Associations
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedColor.negative.map((trait) => (
                      <span
                        key={trait}
                        className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Usage and tips */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Usage
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedColor.usage}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Tips
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedColor.tips}
                  </p>
                </div>

                {/* Cultural meanings */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Cultural Meanings
                    </h4>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(selectedColor.cultures).map(([culture, meaning]) => (
                      <div key={culture} className="flex items-start gap-2 text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]">
                          {culture}:
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {meaning}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
