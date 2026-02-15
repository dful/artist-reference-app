# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Notes

**Web Search Year:** When searching the internet, ALWAYS use **2026** as the current year. The current date is February 2026.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

This is an Artist Reference Web App with three main features: Color Theory tools, Unsplash image search, and Light Reference (3D).

### Tech Stack
- **React 18** + **Vite** for build
- **Tailwind CSS** with dark mode (`class` strategy)
- **Zustand** for state management with localStorage persistence
- **colord** for color manipulation (with harmonies, a11y, mix plugins)
- **unsplash-js** for image search API
- **React Three Fiber** + **@react-three/drei** for 3D rendering (Light Reference feature)

### Key Patterns

**State Management (Zustand stores in `src/stores/`):**
- `colorStore` - Current color, harmonies, color mode (shared across color tools)
- `paletteStore` - Saved palettes with CRUD operations
- `favoritesStore` - Saved reference images
- `themeStore` - Light/dark mode toggle
- `lightReferenceStore` - 3D scene lighting, model selection, model position/scale

Stores use `zustand/middleware` persist for localStorage sync with keys defined in `STORAGE_KEYS`.

**Component Organization:**
- `components/common/` - Reusable UI (Button, Card, Modal, Input, Toggle)
- `components/layout/` - App shell (Header with nav, Layout with router Outlet, ThemeToggle)
- `components/color/` - Color theory tools (ColorWheel, ColorPicker, ColorHarmonies, etc.)
- `components/reference/` - Image search components (SearchBar, ImageGrid, ImageCard, etc.)

**Routing (React Router in App.jsx):**
- `/` - HomePage with feature cards
- `/color` - ColorTheoryPage with tabbed interface
- `/reference` - ReferenceSearchPage with search and filters
- `/light` - LightReferencePage with 3D viewport and lighting controls

### External API

**Unsplash API setup:**
1. Requires `VITE_UNSPLASH_ACCESS_KEY` in `.env`
2. Service layer in `src/services/unsplashService.js` handles API calls
3. Must track downloads via `trackDownload()` for Unsplash compliance
4. Images hotlinked from Unsplash CDN

**Model Storage (IndexedDB):**
- `src/services/modelStorageService.js` handles custom model binary storage
- Stores GLB/GLTF data in IndexedDB (avoids localStorage 5MB limit)
- Functions: `saveModelData()`, `getModelData()`, `deleteModelData()`, `createModelUrl()`

### Color Utilities

`src/utils/colorUtils.js` exports configured colord instance and helpers:
- `getHarmonies(hex)` - Returns all harmony types
- `getTints/getShades/getTones` - Color variants
- `getWCAGCompliance` - Contrast ratio with AA/AAA checks
- `getAllFormats` - HEX, RGB, HSL, CMYK conversion

### Constants (`src/utils/constants.js`)

Key exports:
- `STORAGE_KEYS` - localStorage keys for all persisted stores
- `BUILT_IN_MODELS` - 3D model definitions (id, name, path, thumbnail, category)
- `MODEL_CONSTRAINTS` - Max file size (50MB), allowed extensions (.glb, .gltf)
- `BUILT_IN_MODELS` - Predefined 3D model configurations

### Styling Conventions

- Tailwind dark mode uses `.dark` class on `<html>`
- Custom CSS in `index.css` under `@layer components` for reusable classes
- Color scheme defined in `tailwind.config.js` with primary/surface/background tokens

### Light Reference (3D Feature)

**State Management (`lightReferenceStore`):**
- `lights` - Key/fill/rim spotlights with spherical coordinates (azimuth, elevation, distance)
- `ambient` - Global ambient light color and intensity
- `model` - rotation, scale, autoRotate, position {x, y, z}
- `selectedModelId` - Currently selected model ID
- `customModels` - Array of user-imported custom models
- `sphericalToCartesian()` helper converts to Three.js coordinates

**3D Component Organization (`components/light-reference/`):**
- `Scene3D.jsx` - Main canvas, camera, orbit controls, renders lights and model
- `HumanModel.jsx` - Renders selected model (built-in GLTF, custom from IndexedDB, or primitive fallback)
- `ModelSelector.jsx` - Grid of built-in and custom model thumbnails with import button
- `ModelControls.jsx` - Sliders for model position (X, Y, Z) and size
- `LightControls.jsx` - UI sliders for light parameters
- `LightPresetSelector.jsx` - Predefined lighting setups
- `ModelImportModal.jsx` - Modal for importing custom GLB/GLTF files
- `ModelThumbnail.jsx` - Reusable thumbnail component for model selection

**Built-in 3D Models (`public/models/`):**
- `human-base.glb` - Default human figure
- `male-body.glb` - Male full body
- `female-body.glb` - Female full body
- `human-head.glb` - Detailed human head
- Thumbnails in `public/models/thumbnails/`

**Custom Model Import:**
- Users can import .glb/.gltf files (max 50MB)
- Binary data stored in IndexedDB via `src/services/modelStorageService.js`
- Metadata stored in Zustand store (persists to localStorage)
- Auto-centering and scale normalization applied on load

**Model Position & Size:**
- Position X: -2 to 2
- Position Y (Height): -2 to 5
- Position Z: -2 to 2
- Size: 0.1 to 2

**Environment Lighting:**
- The `<Environment>` component from drei adds HDRI-based image lighting
- For pure lighting study, remove Environment to eliminate default illumination
- With Environment removed, only ambient + spot lights affect the model
- Set ambient intensity to 0 for true darkness when all lights are off
