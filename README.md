# Artist Reference App

A Progressive Web App for artists featuring color theory tools, reference image search, and 3D light reference capabilities. Fully installable on iPad and optimized for touch interaction.

## Features

### Color Theory Tools
- **Color Wheel** - Interactive color wheel with HSL selection
- **Color Picker** - HEX color picker with real-time preview
- **Color Harmonies** - Complementary, analogous, triadic, split-complementary, tetradic, and square harmonies
- **Color Variants** - Tints, shades, and tones of any color
- **Contrast Checker** - WCAG AA/AAA compliance checker for text contrast
- **Color Converter** - Convert between HEX, RGB, HSL, and CMYK formats
- **Palette Generator** - Create and save custom color palettes

### Reference Image Search
- Search millions of high-quality images via Unsplash
- Filter by orientation, color, and sorting options
- Save favorite images for quick access
- Download images or copy share links
- Recent search history

### Light Reference (3D)
- Interactive 3D viewport with orbit controls
- Multiple built-in human figure models
- Three-point lighting system (key, fill, rim)
- Adjustable light position, color, and intensity
- Ambient light control
- Predefined lighting presets
- Import custom GLB/GLTF models
- Model position and scale controls
- Auto-rotation feature

### Pose Creator
- Create custom poses by manipulating a 3D skeleton
- Import rigged GLB models (Mixamo-compatible)
- Bone rotation controls with realistic constraints
- Pose presets (T-Pose, A-Pose, Standing, etc.)
- Save and load custom poses
- Export posed models as GLB (baked geometry)
- Export pose screenshots as PNG

### PWA Support
- Installable on iOS/iPadOS and Android devices
- Works offline (cached static assets and models)
- Full-screen mode without browser UI
- Touch-optimized interface (44px minimum touch targets)
- iPad-optimized responsive layout for 3D pages

## Tech Stack

- **React 19** - UI framework
- **Vite 6** - Build tool
- **vite-plugin-pwa** - PWA support with service worker
- **Tailwind CSS v4** - Styling
- **React Router 7** - Routing
- **Zustand** - State management
- **React Three Fiber** - 3D rendering
- **Three.js** - 3D graphics
- **colord** - Color manipulation
- **unsplash-js** - Image search API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd draw
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file with your Unsplash API key
```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

4. Start the development server
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Getting an Unsplash API Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create an account and register a new application
3. Copy the Access Key to your `.env` file

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # App shell and navigation
│   ├── color/           # Color theory tools
│   ├── reference/       # Image search components
│   ├── light-reference/ # 3D light scene components
│   └── pose-creator/    # Pose creation components
├── pages/               # Route pages
├── stores/              # Zustand state stores
├── services/            # API and storage services
├── utils/               # Helper functions and constants
└── hooks/               # Custom React hooks
```

## Browser Support

- Chrome 111+
- Firefox 128+
- Safari 16.4+
- Edge 111+

## Installing as PWA

### iOS/iPadOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will appear on your home screen and open in full-screen mode

### Android
1. Open the app in Chrome
2. Tap the menu button (three dots)
3. Select "Add to Home screen" or "Install app"
4. The app will be installed and accessible from your app drawer

## Touch Optimization

The app is optimized for touch devices:
- Minimum 44px touch targets (Apple HIG compliant)
- Larger slider thumbs (24x24px) for easier manipulation
- Touch-friendly toggles and buttons
- Responsive layout adapts to tablet portrait/landscape
- Safe area support for notched devices

## License

MIT
