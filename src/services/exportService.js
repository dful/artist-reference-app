import { saveAs } from 'file-saver';
import { toPng, toJpeg } from 'html-to-image';

// Export palette to CSS variables
export const exportToCSS = (colors, name = 'palette') => {
  const cssVariables = colors
    .map((color, index) => `  --color-${index + 1}: ${color};`)
    .join('\n');

  const css = `:root {
${cssVariables}
}

/* Usage examples */
.example {
  color: var(--color-1);
  background-color: var(--color-2);
}`;
  return css;
};

// Export palette to JSON
export const exportToJSON = (colors, name = 'palette') => {
  const json = {
    name,
    colors: colors.map((color, index) => ({
      name: `color-${index + 1}`,
      hex: color,
    })),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(json, null, 2);
};

// Export palette to SCSS
export const exportToSCSS = (colors, name = 'palette') => {
  const scssVariables = colors
    .map((color, index) => `$color-${index + 1}: ${color};`)
    .join('\n');

  return `// ${name} palette\n${scssVariables}`;
};

// Export palette to Tailwind config format
export const exportToTailwind = (colors, name = 'palette') => {
  const tailwindColors = colors
    .map((color, index) => `      '${index + 1}': '${color}',`)
    .join('\n');

  return `// Add to tailwind.config.js
theme: {
  extend: {
    colors: {
      '${name.toLowerCase().replace(/\s+/g, '-')}': {
${tailwindColors}
      }
    }
  }
}`;
};

// Export palette to PNG image
export const exportToPNG = async (element, filename = 'palette') => {
  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
    });
    saveAs(dataUrl, `${filename}.png`);
    return true;
  } catch (error) {
    console.error('Failed to export PNG:', error);
    return false;
  }
};

// Export palette to JPEG image
export const exportToJPEG = async (element, filename = 'palette') => {
  try {
    const dataUrl = await toJpeg(element, {
      quality: 0.95,
      pixelRatio: 2,
    });
    saveAs(dataUrl, `${filename}.jpg`);
    return true;
  } catch (error) {
    console.error('Failed to export JPEG:', error);
    return false;
  }
};

// Download file utility
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  saveAs(blob, filename);
};

// Export formats
export const EXPORT_FORMATS = [
  { value: 'css', label: 'CSS Variables', extension: '.css' },
  { value: 'scss', label: 'SCSS Variables', extension: '.scss' },
  { value: 'json', label: 'JSON', extension: '.json' },
  { value: 'tailwind', label: 'Tailwind Config', extension: '.js' },
  { value: 'png', label: 'PNG Image', extension: '.png' },
];

// Export handler
export const exportPalette = async (format, colors, name, element) => {
  switch (format) {
    case 'css':
      downloadFile(exportToCSS(colors, name), `${name}.css`, 'text/css');
      break;
    case 'scss':
      downloadFile(exportToSCSS(colors, name), `${name}.scss`, 'text/x-scss');
      break;
    case 'json':
      downloadFile(exportToJSON(colors, name), `${name}.json`, 'application/json');
      break;
    case 'tailwind':
      downloadFile(exportToTailwind(colors, name), `${name}-tailwind.js`, 'text/javascript');
      break;
    case 'png':
      if (element) {
        await exportToPNG(element, name);
      }
      break;
    default:
      console.error('Unknown export format:', format);
  }
};
