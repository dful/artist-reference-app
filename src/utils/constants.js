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
  "human-head": {
    id: "human-head",
    name: "Human Head",
    path: "/models/human-head.glb",
    thumbnail: "/models/thumbnails/human-head.png",
    category: "head",
  },
  "man-rigged": {
    id: "man-rigged",
    name: "Man Rigged",
    path: "/models/man-rigged-base.glb",
    thumbnail: null,
    category: "rigged",
  },
  "woman-rigged": {
    id: "woman-rigged",
    name: "Woman Rigged",
    path: "/models/woman-rigged-base.glb",
    thumbnail: null,
    category: "rigged",
  },
};

// Bone definitions for Pose Creator
// Mixamo-style bone naming convention
export const BONE_DEFINITIONS = {
  // Root
  hips: {
    label: "Hips",
    mixamoName: "mixamorigHips",
    limits: { x: [-30, 30], y: [-45, 45], z: [-30, 30] },
  },
  // Spine chain
  spine: {
    label: "Lower Spine",
    mixamoName: "mixamorigSpine",
    limits: { x: [-30, 30], y: [-30, 30], z: [-20, 20] },
  },
  spine1: {
    label: "Middle Spine",
    mixamoName: "mixamorigSpine1",
    limits: { x: [-30, 30], y: [-30, 30], z: [-20, 20] },
  },
  spine2: {
    label: "Upper Spine",
    mixamoName: "mixamorigSpine2",
    limits: { x: [-30, 30], y: [-30, 30], z: [-20, 20] },
  },
  neck: {
    label: "Neck",
    mixamoName: "mixamorigNeck",
    limits: { x: [-40, 40], y: [-60, 60], z: [-30, 30] },
  },
  head: {
    label: "Head",
    mixamoName: "mixamorigHead",
    limits: { x: [-40, 40], y: [-70, 70], z: [-30, 30] },
  },
  // Left arm chain
  leftShoulder: {
    label: "Left Shoulder",
    mixamoName: "mixamorigLeftShoulder",
    limits: { x: [-20, 20], y: [-30, 30], z: [-20, 20] },
  },
  leftArm: {
    label: "Left Upper Arm",
    mixamoName: "mixamorigLeftArm",
    limits: { x: [-180, 90], y: [-90, 90], z: [-90, 60] },
  },
  leftForeArm: {
    label: "Left Forearm",
    mixamoName: "mixamorigLeftForeArm",
    limits: { x: [-150, 0], y: [-20, 20], z: [-20, 20] },
  },
  leftHand: {
    label: "Left Hand",
    mixamoName: "mixamorigLeftHand",
    limits: { x: [-60, 60], y: [-40, 40], z: [-60, 60] },
  },
  // Right arm chain
  rightShoulder: {
    label: "Right Shoulder",
    mixamoName: "mixamorigRightShoulder",
    limits: { x: [-20, 20], y: [-30, 30], z: [-20, 20] },
  },
  rightArm: {
    label: "Right Upper Arm",
    mixamoName: "mixamorigRightArm",
    limits: { x: [-180, 90], y: [-90, 90], z: [-60, 90] },
  },
  rightForeArm: {
    label: "Right Forearm",
    mixamoName: "mixamorigRightForeArm",
    limits: { x: [0, 150], y: [-20, 20], z: [-20, 20] },
  },
  rightHand: {
    label: "Right Hand",
    mixamoName: "mixamorigRightHand",
    limits: { x: [-60, 60], y: [-40, 40], z: [-60, 60] },
  },
  // Left leg chain
  leftUpLeg: {
    label: "Left Thigh",
    mixamoName: "mixamorigLeftUpLeg",
    limits: { x: [-120, 60], y: [-60, 60], z: [-60, 60] },
  },
  leftLeg: {
    label: "Left Shin",
    mixamoName: "mixamorigLeftLeg",
    limits: { x: [0, 150], y: [0, 0], z: [0, 0] },
  },
  leftFoot: {
    label: "Left Foot",
    mixamoName: "mixamorigLeftFoot",
    limits: { x: [-50, 50], y: [-30, 30], z: [-40, 40] },
  },
  // Right leg chain
  rightUpLeg: {
    label: "Right Thigh",
    mixamoName: "mixamorigRightUpLeg",
    limits: { x: [-120, 60], y: [-60, 60], z: [-60, 60] },
  },
  rightLeg: {
    label: "Right Shin",
    mixamoName: "mixamorigRightLeg",
    limits: { x: [0, 150], y: [0, 0], z: [0, 0] },
  },
  rightFoot: {
    label: "Right Foot",
    mixamoName: "mixamorigRightFoot",
    limits: { x: [-50, 50], y: [-30, 30], z: [-40, 40] },
  },
};

// Bone groupings for UI organization
export const BONE_GROUPS = [
  {
    id: "torso",
    label: "Torso",
    bones: ["hips", "spine", "spine1", "spine2"],
  },
  {
    id: "head",
    label: "Head & Neck",
    bones: ["neck", "head"],
  },
  {
    id: "left-arm",
    label: "Left Arm",
    bones: ["leftShoulder", "leftArm", "leftForeArm", "leftHand"],
  },
  {
    id: "right-arm",
    label: "Right Arm",
    bones: ["rightShoulder", "rightArm", "rightForeArm", "rightHand"],
  },
  {
    id: "left-leg",
    label: "Left Leg",
    bones: ["leftUpLeg", "leftLeg", "leftFoot"],
  },
  {
    id: "right-leg",
    label: "Right Leg",
    bones: ["rightUpLeg", "rightLeg", "rightFoot"],
  },
];

// Create default pose (all zeros)
export const createDefaultPose = () => {
  const pose = {};
  Object.keys(BONE_DEFINITIONS).forEach((boneName) => {
    pose[boneName] = { x: 0, y: 0, z: 0 };
  });
  return pose;
};

// Pose presets for quick selection
export const POSE_PRESETS = [
  {
    id: "t-pose",
    name: "T-Pose",
    description: "Arms extended horizontally",
    pose: {
      hips: { x: 0, y: 0, z: 0 },
      spine: { x: 0, y: 0, z: 0 },
      spine1: { x: 0, y: 0, z: 0 },
      spine2: { x: 0, y: 0, z: 0 },
      neck: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: 0, z: 0 },
      leftShoulder: { x: 0, y: 0, z: 0 },
      leftArm: { x: 0, y: 0, z: -90 },
      leftForeArm: { x: 0, y: 0, z: 0 },
      leftHand: { x: 0, y: 0, z: 0 },
      rightShoulder: { x: 0, y: 0, z: 0 },
      rightArm: { x: 0, y: 0, z: 90 },
      rightForeArm: { x: 0, y: 0, z: 0 },
      rightHand: { x: 0, y: 0, z: 0 },
      leftUpLeg: { x: 0, y: 0, z: 0 },
      leftLeg: { x: 0, y: 0, z: 0 },
      leftFoot: { x: 0, y: 0, z: 0 },
      rightUpLeg: { x: 0, y: 0, z: 0 },
      rightLeg: { x: 0, y: 0, z: 0 },
      rightFoot: { x: 0, y: 0, z: 0 },
    },
  },
  {
    id: "a-pose",
    name: "A-Pose",
    description: "Arms at natural angle",
    pose: {
      hips: { x: 0, y: 0, z: 0 },
      spine: { x: 0, y: 0, z: 0 },
      spine1: { x: 0, y: 0, z: 0 },
      spine2: { x: 0, y: 0, z: 0 },
      neck: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: 0, z: 0 },
      leftShoulder: { x: 0, y: 0, z: 0 },
      leftArm: { x: 0, y: 0, z: -45 },
      leftForeArm: { x: 0, y: 0, z: 0 },
      leftHand: { x: 0, y: 0, z: 0 },
      rightShoulder: { x: 0, y: 0, z: 0 },
      rightArm: { x: 0, y: 0, z: 45 },
      rightForeArm: { x: 0, y: 0, z: 0 },
      rightHand: { x: 0, y: 0, z: 0 },
      leftUpLeg: { x: 0, y: 0, z: 0 },
      leftLeg: { x: 0, y: 0, z: 0 },
      leftFoot: { x: 0, y: 0, z: 0 },
      rightUpLeg: { x: 0, y: 0, z: 0 },
      rightLeg: { x: 0, y: 0, z: 0 },
      rightFoot: { x: 0, y: 0, z: 0 },
    },
  },
  {
    id: "standing",
    name: "Standing",
    description: "Arms relaxed at sides",
    pose: {
      hips: { x: 0, y: 0, z: 0 },
      spine: { x: 0, y: 0, z: 0 },
      spine1: { x: 0, y: 0, z: 0 },
      spine2: { x: 0, y: 0, z: 0 },
      neck: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: 0, z: 0 },
      leftShoulder: { x: 0, y: 0, z: 0 },
      leftArm: { x: 0, y: 0, z: 5 },
      leftForeArm: { x: 0, y: 0, z: 0 },
      leftHand: { x: 0, y: 0, z: 0 },
      rightShoulder: { x: 0, y: 0, z: 0 },
      rightArm: { x: 0, y: 0, z: -5 },
      rightForeArm: { x: 0, y: 0, z: 0 },
      rightHand: { x: 0, y: 0, z: 0 },
      leftUpLeg: { x: 0, y: 0, z: 0 },
      leftLeg: { x: 0, y: 0, z: 0 },
      leftFoot: { x: 0, y: 0, z: 0 },
      rightUpLeg: { x: 0, y: 0, z: 0 },
      rightLeg: { x: 0, y: 0, z: 0 },
      rightFoot: { x: 0, y: 0, z: 0 },
    },
  },
  {
    id: "arms-up",
    name: "Arms Up",
    description: "Both arms raised up",
    pose: {
      hips: { x: 0, y: 0, z: 0 },
      spine: { x: 0, y: 0, z: 0 },
      spine1: { x: 0, y: 0, z: 0 },
      spine2: { x: 0, y: 0, z: 0 },
      neck: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: 0, z: 0 },
      leftShoulder: { x: 0, y: 0, z: 0 },
      leftArm: { x: -150, y: 0, z: 0 },
      leftForeArm: { x: -30, y: 0, z: 0 },
      leftHand: { x: 0, y: 0, z: 0 },
      rightShoulder: { x: 0, y: 0, z: 0 },
      rightArm: { x: -150, y: 0, z: 0 },
      rightForeArm: { x: -30, y: 0, z: 0 },
      rightHand: { x: 0, y: 0, z: 0 },
      leftUpLeg: { x: 0, y: 0, z: 0 },
      leftLeg: { x: 0, y: 0, z: 0 },
      leftFoot: { x: 0, y: 0, z: 0 },
      rightUpLeg: { x: 0, y: 0, z: 0 },
      rightLeg: { x: 0, y: 0, z: 0 },
      rightFoot: { x: 0, y: 0, z: 0 },
    },
  },
  {
    id: "sitting",
    name: "Sitting",
    description: "Seated position with bent knees",
    pose: {
      hips: { x: 0, y: 0, z: -10 },
      spine: { x: 0, y: 0, z: 0 },
      spine1: { x: 0, y: 0, z: 0 },
      spine2: { x: 0, y: 0, z: 0 },
      neck: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: 0, z: 0 },
      leftShoulder: { x: 0, y: 0, z: 0 },
      leftArm: { x: 0, y: 0, z: 10 },
      leftForeArm: { x: -100, y: 0, z: 0 },
      leftHand: { x: 0, y: 0, z: 0 },
      rightShoulder: { x: 0, y: 0, z: 0 },
      rightArm: { x: 0, y: 0, z: -10 },
      rightForeArm: { x: -100, y: 0, z: 0 },
      rightHand: { x: 0, y: 0, z: 0 },
      leftUpLeg: { x: -90, y: 0, z: 0 },
      leftLeg: { x: 90, y: 0, z: 0 },
      leftFoot: { x: 0, y: 0, z: 0 },
      rightUpLeg: { x: -90, y: 0, z: 0 },
      rightLeg: { x: 90, y: 0, z: 0 },
      rightFoot: { x: 0, y: 0, z: 0 },
    },
  },
  {
    id: "walking",
    name: "Walking",
    description: "Mid-stride walking pose",
    pose: {
      hips: { x: 5, y: 5, z: 0 },
      spine: { x: -5, y: -5, z: 0 },
      spine1: { x: 0, y: 0, z: 0 },
      spine2: { x: 0, y: 0, z: 0 },
      neck: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: 0, z: 0 },
      leftShoulder: { x: 0, y: 0, z: 0 },
      leftArm: { x: 30, y: 0, z: 10 },
      leftForeArm: { x: -20, y: 0, z: 0 },
      leftHand: { x: 0, y: 0, z: 0 },
      rightShoulder: { x: 0, y: 0, z: 0 },
      rightArm: { x: -30, y: 0, z: -10 },
      rightForeArm: { x: -20, y: 0, z: 0 },
      rightHand: { x: 0, y: 0, z: 0 },
      leftUpLeg: { x: -30, y: 0, z: 0 },
      leftLeg: { x: 0, y: 0, z: 0 },
      leftFoot: { x: 20, y: 0, z: 0 },
      rightUpLeg: { x: 30, y: 0, z: 0 },
      rightLeg: { x: 40, y: 0, z: 0 },
      rightFoot: { x: -10, y: 0, z: 0 },
    },
  },
];
