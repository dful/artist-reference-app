import { colord, extend } from 'colord';
import harmonies from 'colord/plugins/harmonies';
import a11y from 'colord/plugins/a11y';
import mix from 'colord/plugins/mix';
import names from 'colord/plugins/names';

// Extend colord with plugins
extend([harmonies, a11y, mix, names]);

// Re-export colord for use elsewhere
export { colord };

// Color harmonies
export const getHarmonies = (hex) => {
  const color = colord(hex);
  const harmonyTypes = ['complementary', 'analogous', 'triadic', 'split-complementary', 'tetradic', 'square'];
  const result = {};

  for (const type of harmonyTypes) {
    // 'square' is not supported by colord harmonies plugin, calculate manually
    if (type === 'square') {
      const squareAngles = [0, 90, 180, 270];
      result['square'] = squareAngles.map(deg => color.rotate(deg).toHex());
      continue;
    }

    try {
      const harmonies = color.harmonies(type);
      result[type === 'split-complementary' ? 'splitComplementary' : type] =
        harmonies ? harmonies.map(c => c.toHex()) : [];
    } catch {
      result[type === 'split-complementary' ? 'splitComplementary' : type] = [];
    }
  }

  return result;
};

// Color variants
export const getTints = (hex, steps = 9) => {
  const color = colord(hex);
  const tints = [];
  for (let i = 1; i <= steps; i++) {
    const ratio = i / (steps + 1);
    tints.push(color.mix('#ffffff', ratio).toHex());
  }
  return tints;
};

export const getShades = (hex, steps = 9) => {
  const color = colord(hex);
  const shades = [];
  for (let i = 1; i <= steps; i++) {
    const ratio = i / (steps + 1);
    shades.push(color.mix('#000000', ratio).toHex());
  }
  return shades;
};

export const getTones = (hex, steps = 9) => {
  const color = colord(hex);
  const tones = [];
  for (let i = 1; i <= steps; i++) {
    const ratio = i / (steps + 1);
    tones.push(color.mix('#808080', ratio).toHex());
  }
  return tones;
};

// Contrast ratio
export const getContrastRatio = (foreground, background) => {
  return colord(foreground).contrast(background);
};

// WCAG compliance checks
export const getWCAGCompliance = (foreground, background) => {
  const ratio = getContrastRatio(foreground, background);
  return {
    ratio: ratio.toFixed(2),
    aa: {
      normal: ratio >= 4.5,
      large: ratio >= 3,
    },
    aaa: {
      normal: ratio >= 7,
      large: ratio >= 4.5,
    },
  };
};

// Color conversion utilities
export const hexToRgb = (hex) => {
  const color = colord(hex);
  const rgb = color.toRgb();
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

export const hexToHsl = (hex) => {
  const color = colord(hex);
  const hsl = color.toHsl();
  return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
};

export const hexToCmyk = (hex) => {
  const color = colord(hex);
  const rgb = color.toRgb();

  // Convert RGB to CMYK
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
};

// Get all color formats
export const getAllFormats = (hex) => {
  const color = colord(hex);
  const rgb = color.toRgb();
  const hsl = color.toHsl();

  return {
    hex: color.toHex().toUpperCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
    hsla: `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, 1)`,
    cmyk: hexToCmyk(hex),
  };
};

// Parse any color format to hex
export const parseToHex = (colorString) => {
  try {
    const color = colord(colorString);
    if (color.isValid()) {
      return color.toHex();
    }
    return null;
  } catch {
    return null;
  }
};

// Get readable text color (black or white) for a given background
export const getReadableTextColor = (backgroundColor) => {
  const color = colord(backgroundColor);
  return color.isLight() ? '#000000' : '#ffffff';
};

// Generate random color
export const randomColor = () => {
  return colord({
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }).toHex();
};

// Color name
export const getColorName = (hex) => {
  return colord(hex).toName({ closest: true }) || 'Unknown';
};
