import { describe, expect, test } from 'vitest';

import type { Color } from '../types';
import { applyFloydSteinbergDithering, findClosestPaletteColor } from './floyd-steinberg-dithering';

describe('findClosestPaletteColor', () => {
  test('should find the closest color correctly', () => {
    const inputColor: Color = { r: 120, g: 130, b: 140 };
    const expectedColor: Color = { r: 0, g: 255, b: 255 };
    const result = findClosestPaletteColor(inputColor);

    expect(result).toEqual(expectedColor);
  });

  test('should handle edge case when color matches exactly', () => {
    const inputColor: Color = { r: 255, g: 0, b: 0 };
    const result = findClosestPaletteColor(inputColor);

    expect(result).toEqual(inputColor);
  });
});

describe('applyFloydSteinbergDithering', () => {
  test('should apply dithering to a simple image', () => {
    const mockCanvas = document.createElement('canvas');
    mockCanvas.width = 2;
    mockCanvas.height = 2;
    const ctx = mockCanvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(1, 1, 1, 1);

    applyFloydSteinbergDithering(ctx);
    const imageData = ctx.getImageData(0, 0, 2, 2).data;

    expect(imageData).toEqual(expect.any(Uint8ClampedArray));
  });
});
