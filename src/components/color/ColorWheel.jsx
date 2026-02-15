import { useRef, useCallback, useState, useEffect } from 'react';
import { colord } from 'colord';
import { useColorStore } from '../../stores';

export const ColorWheel = ({ size = 280, value, onChange }) => {
  const canvasRef = useRef(null);
  const { currentColor: storeColor, setCurrentColor: setStoreColor, colorMode } = useColorStore();
  const [isDragging, setIsDragging] = useState(false);

  // Use controlled props if provided, otherwise fall back to store
  const currentColor = value !== undefined ? value : storeColor;
  const setCurrentColor = onChange !== undefined ? onChange : setStoreColor;

  // Draw color wheel
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Create gradient from center (white/gray) to edge (saturated)
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );

      const hueColor = colord({ h: angle, s: 100, l: 50 }).toHex();

      if (colorMode === 'hsl') {
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, hueColor);
      } else {
        // HSV mode
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, hueColor);
      }

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Draw center white circle for cleaner look
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }, [size, colorMode]);

  // Handle mouse/touch events
  const getColorAtPosition = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    const distance = Math.sqrt(x * x + y * y);
    const radius = size / 2 - 10;

    if (distance > radius) return; // Outside wheel

    // Calculate angle (hue)
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    // Calculate saturation based on distance from center
    const saturation = Math.min(100, (distance / radius) * 100);

    // Calculate lightness/value
    const lightness = 50 + (1 - distance / radius) * 30;

    const color = colord({
      h: Math.round(angle),
      s: Math.round(saturation),
      l: Math.round(Math.min(100, lightness)),
    });

    setCurrentColor(color.toHex());
  }, [size, setCurrentColor]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    getColorAtPosition(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      getColorAtPosition(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    getColorAtPosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      getColorAtPosition(touch.clientX, touch.clientY);
    }
  };

  // Draw on mount and when colorMode changes
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  // Calculate indicator position
  const getIndicatorPosition = () => {
    const hsl = colord(currentColor).toHsl();
    const angle = (hsl.h * Math.PI) / 180;
    const radius = size / 2 - 10;
    const distance = (hsl.s / 100) * radius * 0.85;

    return {
      x: size / 2 + Math.cos(angle) * distance,
      y: size / 2 + Math.sin(angle) * distance,
    };
  };

  const indicator = getIndicatorPosition();

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-crosshair rounded-full shadow-lg"
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      />

      {/* Color indicator */}
      <div
        className="absolute w-6 h-6 rounded-full border-4 border-white shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: indicator.x,
          top: indicator.y,
          backgroundColor: currentColor,
        }}
      />
    </div>
  );
};
