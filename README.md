# Artist Reference App

A web application for artists featuring color theory tools, reference image search, and 3D light reference capabilities.

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

## Tech Stack

- **React 19** - UI framework
- **Vite 6** - Build tool
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
│   └── light-reference/ # 3D scene components
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

## License

MIT
