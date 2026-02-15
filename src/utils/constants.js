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
};

// 3D Model constraints
export const MODEL_CONSTRAINTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_EXTENSIONS: [".glb", ".gltf"],
  THUMBNAIL_SIZE: 128,
};

// Built-in 3D models for Light Reference
export const BUILT_IN_MODELS = {
  "human-base": {
    id: "human-base",
    name: "Human Base",
    path: "/models/human-base.glb",
    thumbnail: null, // Will show placeholder icon
    category: "body",
  },
  "male-body": {
    id: "male-body",
    name: "Male Body",
    path: "/models/male-body.glb",
    thumbnail: "/models/thumbnails/male-body.png",
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
