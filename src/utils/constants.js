// App constants
export const APP_NAME = "Artist Reference";

// Unsplash API configuration
export const UNSPLASH_CONFIG = {
  perPage: 30,
  maxPages: 10,
  hotlinkPrefix: "https://images.unsplash.com",
};

// Color theory constants
export const COLOR_MODES = {
  HSL: "hsl",
  HSV: "hsv",
  RGB: "rgb",
};

export const HARMONY_TYPES = {
  complementary: "Complementary",
  analogous: "Analogous",
  triadic: "Triadic",
  splitComplementary: "Split Complementary",
  tetradic: "Tetradic",
  square: "Square",
};

export const HARMONY_DESCRIPTIONS = {
  complementary:
    "Colors opposite on the wheel create high contrast and vibrant look",
  analogous: "Colors next to each other create serene, comfortable designs",
  triadic:
    "Three colors equally spaced offer vibrant contrast while retaining balance",
  splitComplementary: "Base color plus two colors adjacent to its complement",
  tetradic:
    "Four colors forming a rectangle, works best with one dominant color",
  square: "Four colors equally spaced, works best with one dominant color",
};

// Image search filters
export const ORIENTATION_OPTIONS = [
  { value: "", label: "Any Orientation" },
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
  { value: "squarish", label: "Square" },
];

export const COLOR_FILTER_OPTIONS = [
  { value: "", label: "Any Color" },
  { value: "black_and_white", label: "Black & White" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "yellow", label: "Yellow" },
  { value: "orange", label: "Orange" },
  { value: "red", label: "Red" },
  { value: "purple", label: "Purple" },
  { value: "magenta", label: "Magenta" },
  { value: "green", label: "Green" },
  { value: "teal", label: "Teal" },
  { value: "blue", label: "Blue" },
];

export const SIZE_OPTIONS = [
  { value: "", label: "Any Size" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

// Palette presets
export const PALETTE_PRESETS = [
  {
    name: "Sunset",
    colors: ["#FF6B6B", "#FEC89A", "#FFD93D", "#6BCB77", "#4D96FF"],
  },
  {
    name: "Ocean",
    colors: ["#006466", "#065A60", "#0B525B", "#144552", "#1B3A4B"],
  },
  {
    name: "Forest",
    colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
  },
  {
    name: "Berry",
    colors: ["#7B2CBF", "#9D4EDD", "#C77DFF", "#E0AAFF", "#F2D5FF"],
  },
  {
    name: "Warm Earth",
    colors: ["#BC6C25", "#DDA15E", "#FEFAE0", "#606C38", "#283618"],
  },
];

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "artist-reference-theme",
  PALETTES: "artist-reference-palettes",
  FAVORITES: "artist-reference-favorites",
  RECENT_SEARCHES: "artist-reference-searches",
  LIGHT_REFERENCE: "artist-reference-light",
  CUSTOM_MODELS: "artist-reference-custom-models",
  POSE_CREATOR: "artist-reference-pose-creator",
};

// 3D Model constraints
export const MODEL_CONSTRAINTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_EXTENSIONS: [".glb", ".gltf", ".fbx"],
  THUMBNAIL_SIZE: 128,
};

// Built-in 3D models for Light Reference
export const BUILT_IN_MODELS = {
  "male-body": {
    id: "male-body",
    name: "Male Body",
    path: "/models/human-base.glb",
    thumbnail: null, // Will show placeholder icon
    category: "body",
  },
  "female-body": {
    id: "female-body",
    name: "Female Body",
    path: "/models/female-body.glb",
    thumbnail: "/models/thumbnails/female-body.png",
    category: "body",
  },
};

// Built-in posable models for Pose Creator
// Add rigged GLB models here - they must have a skeleton
export const BUILT_IN_POSABLE_MODELS = {
  "rigged-human": {
    id: "rigged-human",
    name: "Rigged Human",
    path: "/models/rigged-human.glb",
    thumbnail: null,
    category: "built-in",
  },
};

// Internal bone corrections for model orientation (NOT editable by user)
// These compensate for FBX->GLB conversion and model facing direction
export const BONE_CORRECTIONS = {
  'mixamorigHips': { x: 180, y: 0, z: 0 },          // Root orientation fix
  'mixamorigLeftUpLeg': { x: 180, y: 180, z: 0 },   // Leg orientation
  'mixamorigRightUpLeg': { x: 180, y: 180, z: 0 },  // Leg orientation
  'mixamorigLeftFoot': { x: 60, y: 0, z: 0 },       // Ankle angle
  'mixamorigRightFoot': { x: 60, y: 0, z: 0 },      // Ankle angle
  'mixamorigLeftToeBase': { x: 30, y: 0, z: 0 },    // Toe angle
  'mixamorigRightToeBase': { x: 30, y: 0, z: 0 },   // Toe angle
};

// T-Pose shoulder values (establish horizontal arm position)
export const T_POSE_SHOULDERS = {
  'mixamorigLeftShoulder': { x: 90, y: 0, z: -90 },
  'mixamorigRightShoulder': { x: 90, y: 0, z: 90 },
};

// Bone rotation constraints (in degrees) for Mixamo skeleton
// Note: Mixamo bone names from Blender export don't have colons
// Realistic human movement limits
// In T-Pose: Arm X-=up, X+=down | Z-=forward(right)/back(left), Z+=back(right)/forward(left)
// ForeArm: X=lateral, Y=rotation, Z-=flexes elbow
export const BONE_CONSTRAINTS = {
  // Shoulders - limited since they establish T-Pose base
  'mixamorigLeftShoulder': { x: [45, 135], y: [-45, 45], z: [-135, -45] },
  'mixamorigRightShoulder': { x: [45, 135], y: [-45, 45], z: [45, 135] },

  // Arms - X=up/down, Z=forward/back
  'mixamorigLeftArm': { x: [-90, 90], y: [-90, 90], z: [-90, 90] },
  'mixamorigRightArm': { x: [-90, 90], y: [-90, 90], z: [-90, 90] },

  // Forearms - elbow flex (mirrored: left uses positive Z, right uses negative Z)
  'mixamorigLeftForeArm': { x: [-30, 30], y: [-90, 90], z: [0, 145] },   // Z+ = flex
  'mixamorigRightForeArm': { x: [-30, 30], y: [-90, 90], z: [-145, 0] }, // Z- = flex

  // Hands - limited rotation
  'mixamorigLeftHand': { x: [-60, 60], y: [-60, 60], z: [-30, 30] },
  'mixamorigRightHand': { x: [-60, 60], y: [-60, 60], z: [-30, 30] },

  // Legs - human range
  'mixamorigLeftUpLeg': { x: [-120, 45], y: [-60, 60], z: [-45, 45] },
  'mixamorigRightUpLeg': { x: [-120, 45], y: [-60, 60], z: [-45, 45] },
  // Knees - X-=flex (negative = bend knee backward)
  'mixamorigLeftLeg': { x: [-150, 0], y: [-15, 15], z: [-15, 15] },
  'mixamorigRightLeg': { x: [-150, 0], y: [-15, 15], z: [-15, 15] },

  // Feet
  'mixamorigLeftFoot': { x: [-45, 45], y: [-30, 30], z: [-30, 30] },
  'mixamorigRightFoot': { x: [-45, 45], y: [-30, 30], z: [-30, 30] },

  // Toes
  'mixamorigLeftToeBase': { x: [-30, 30], y: [0, 0], z: [0, 0] },
  'mixamorigRightToeBase': { x: [-30, 30], y: [0, 0], z: [0, 0] },

  // Spine - limited flexion
  'mixamorigSpine': { x: [-30, 30], y: [-30, 30], z: [-20, 20] },
  'mixamorigSpine1': { x: [-20, 20], y: [-20, 20], z: [-15, 15] },
  'mixamorigSpine2': { x: [-20, 20], y: [-20, 20], z: [-15, 15] },

  // Neck and Head
  'mixamorigNeck': { x: [-30, 30], y: [-45, 45], z: [-20, 20] },
  'mixamorigHead': { x: [-40, 40], y: [-70, 70], z: [-25, 25] },

  // Hips - mainly Y rotation for turning body
  'mixamorigHips': { x: [-15, 15], y: [-45, 45], z: [-15, 15] },
};
