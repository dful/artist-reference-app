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

This is an Artist Reference Web App with four main features: Color Theory tools, Unsplash image search, Light Reference (3D), and Pose Creator.

### Tech Stack
- **React 19** + **Vite 6** for build
- **Tailwind CSS v4** with dark mode (`class` strategy via `@variant dark`)
- **Zustand 5** for state management with localStorage persistence
- **colord** for color manipulation (with harmonies, a11y, mix plugins)
- **unsplash-js** for image search API
- **React Three Fiber 9** + **@react-three/drei 10** for 3D rendering (Light Reference feature)
- **React Router 7** for routing

### Key Patterns

**State Management (Zustand stores in `src/stores/`):**
- `colorStore` - Current color, harmonies, color mode (shared across color tools)
- `paletteStore` - Saved palettes with CRUD operations
- `favoritesStore` - Saved reference images
- `themeStore` - Light/dark mode toggle
- `lightReferenceStore` - 3D scene lighting, model selection, model position/scale
- `poseCreatorStore` - Bone rotations, pose presets, skeleton visualization, model transform

Stores use `zustand/middleware` persist for localStorage sync with keys defined in `STORAGE_KEYS`.

**Component Organization:**
- `components/common/` - Reusable UI (Button, Card, Modal, Input, Toggle)
- `components/layout/` - App shell (Header with nav, Layout with router Outlet, ThemeToggle)
- `components/color/` - Color theory tools (ColorWheel, ColorPicker, ColorHarmonies, etc.)
- `components/reference/` - Image search components (SearchBar, ImageGrid, ImageCard, etc.)
- `components/light-reference/` - 3D scene components (Scene3D, HumanModel, LightControls, etc.)
- `components/pose-creator/` - Pose creation components (PoseScene3D, PosableModel, BoneControls, etc.)

**Routing (React Router in App.jsx):**
- `/` - HomePage with feature cards
- `/color` - ColorTheoryPage with tabbed interface
- `/reference` - ReferenceSearchPage with search and filters
- `/light` - LightReferencePage with 3D viewport and lighting controls
- `/pose` - PoseCreatorPage with 3D pose editor

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
- `BUILT_IN_MODELS` - 3D model definitions for Light Reference (id, name, path, thumbnail, category)
- `BUILT_IN_POSABLE_MODELS` - Rigged 3D model definitions for Pose Creator
- `BONE_CONSTRAINTS` - Rotation limits (degrees) for Mixamo skeleton bones
- `MODEL_CONSTRAINTS` - Max file size (50MB), allowed extensions (.glb, .gltf, .fbx)

### Styling Conventions (Tailwind CSS v4)

- Theme defined in `src/index.css` using `@theme {}` block
- Dark mode: `@variant dark (&:where(.dark, .dark *));`
- Custom colors: `--color-primary-*`, `--color-surface-*`, `--color-background-*`
- Custom component classes: `.btn`, `.btn-primary`, `.btn-secondary`, `.card`, `.input`
- **Class changes from v3:** `shadow-sm` → `shadow-xs`, `outline-none` → `outline-hidden`

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
- `human-base.glb` - Used by "Male Body" model
- `female-body.glb` - Female full body
- Thumbnails in `public/models/thumbnails/`

**BUILT_IN_MODELS configuration:**
- `male-body` - Uses human-base.glb, no thumbnail
- `female-body` - Uses female-body.glb with thumbnail

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

### ESLint Configuration

- Uses ESLint 9 with flat config (`eslint.config.js`)
- React Three Fiber properties are allowed (rule `react/no-unknown-property` is disabled for R3F compatibility)

### Pose Creator Feature

**Purpose:** Create custom poses by manipulating a 3D skeleton. Export poses as GLB for Light Reference or PNG as reference image.

**Requirements:**
- Models must have a skeleton (bones) to be posable
- Supported formats: GLB/GLTF with embedded skeleton
- Built-in model placeholder: `rigged-human.glb` (user must provide rigged model)
- To get rigged models: Download from Mixamo (FBX) → Convert to GLB using Blender

**State Management (`poseCreatorStore`):**
- `boneRotations` - Object mapping bone names to {x, y, z} rotations in degrees
- `selectedBone` - Currently selected bone for editing
- `showSkeleton` - Toggle skeleton wireframe visualization
- `savedPoses` - Array of user-saved poses with boneRotations
- `selectedModelId` - Currently selected model ('rigged-human' or custom)
- `customPosableModels` - User-imported rigged models

**Bone Naming Convention:**
- Mixamo via Blender export: `mixamorigBoneName` (NO colon)
- Examples: `mixamorigHips`, `mixamorigLeftArm`, `mixamorigHead`
- Bone names must match exactly for pose presets to work

**3D Component Organization (`components/pose-creator/`):**
- `PoseScene3D.jsx` - Main canvas, camera, orbit controls
- `PosableModel.jsx` - Loads GLB models, finds bones, applies rotations
- `SkeletonVisualizer.jsx` - Wireframe overlay showing skeleton bones
- `BoneControls.jsx` - X/Y/Z rotation sliders for selected bone
- `BoneSelector.jsx` - Hierarchical tree view of skeleton bones
- `ModelSelector.jsx` - Model selection with import button
- `PosePresetSelector.jsx` - T-Pose, A-Pose, and other presets + save/load
- `PoseExporter.jsx` - Export to GLB (with pose) or PNG (screenshot)

**Pose Presets:**
Predefined in `PosePresetSelector.jsx`:
- T-Pose, A-Pose, Standing, Arms Up, Thinking, Relaxed
- Custom poses can be saved to localStorage

**Custom Model Import:**
- Users import GLB files with skeleton via ModelSelector
- Binary data stored in IndexedDB (reuses `modelStorageService.js`)
- Model must have bones (isBone nodes) to be posable

**Export:**
- **GLB:** Bakes pose into static geometry using `createBakedModel()` before exporting. This converts SkinnedMesh to Mesh so transforms work in Light Reference. Uses `skeleton.boneMatrices` for skinning calculation.
- **PNG:** Captures canvas screenshot as reference image

