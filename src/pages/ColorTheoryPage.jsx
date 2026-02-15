import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common';
import {
  ColorWheel,
  ColorPicker,
  ColorHarmonies,
  ColorVariants,
  ContrastChecker,
  PaletteGenerator,
  ColorPsychology,
  ColorConverter,
  PaletteManager,
} from '../components/color';
import { useColorStore } from '../stores';
import { Dices } from 'lucide-react';

const tabs = [
  { id: 'picker', label: 'Color Picker' },
  { id: 'harmonies', label: 'Harmonies' },
  { id: 'variants', label: 'Variants' },
  { id: 'contrast', label: 'Contrast' },
  { id: 'palette', label: 'Palette' },
  { id: 'saved', label: 'Saved' },
  { id: 'psychology', label: 'Psychology' },
  { id: 'converter', label: 'Converter' },
];

export const ColorTheoryPage = () => {
  const [activeTab, setActiveTab] = useState('picker');
  const { currentColor, randomizeColor } = useColorStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Color Theory
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore colors, harmonies, and create palettes
          </p>
        </div>
        <button
          onClick={randomizeColor}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Dices className="w-4 h-4" />
          Random
        </button>
      </div>

      {/* Current color display */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <div
          className="w-16 h-16 rounded-xl shadow-lg"
          style={{ backgroundColor: currentColor }}
        />
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Current Color</div>
          <div className="text-xl font-mono font-bold text-gray-900 dark:text-white">
            {currentColor.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Color wheel - always visible */}
        {activeTab === 'picker' && (
          <>
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Color Wheel</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ColorWheel size={260} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Color Picker</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorPicker />
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'harmonies' && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Color Harmonies</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorHarmonies />
            </CardContent>
          </Card>
        )}

        {activeTab === 'variants' && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Tints, Shades & Tones</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorVariants />
            </CardContent>
          </Card>
        )}

        {activeTab === 'contrast' && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Contrast Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <ContrastChecker />
            </CardContent>
          </Card>
        )}

        {activeTab === 'palette' && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Palette Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <PaletteGenerator />
            </CardContent>
          </Card>
        )}

        {activeTab === 'saved' && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Saved Palettes</CardTitle>
            </CardHeader>
            <CardContent>
              <PaletteManager />
            </CardContent>
          </Card>
        )}

        {activeTab === 'psychology' && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Color Psychology</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorPsychology />
            </CardContent>
          </Card>
        )}

        {activeTab === 'converter' && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Color Converter</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorConverter />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
