import { describe, expect, test, vi } from 'vitest';

import type { Color } from '../types';
import { PALETTE } from './constants';
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
    const imageData = new ImageData(
      new Uint8ClampedArray([
        255, 255, 255, 255, 120, 130, 140, 255, 40, 50, 60, 255, 0, 0, 0, 255,
      ]),
      2,
      2,
    );
    const ctx = {
      canvas: { width: 2, height: 2 },
      getImageData: () => imageData,
      putImageData: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    applyFloydSteinbergDithering(ctx);
    const pixels = imageData.data;

    expect(pixels).toEqual(expect.any(Uint8ClampedArray));
    for (let index = 0; index < pixels.length; index += 4) {
      expect(
        PALETTE.some(
          ({ r, g, b }) =>
            pixels[index] === r && pixels[index + 1] === g && pixels[index + 2] === b,
        ),
      ).toBe(true);
      expect(pixels[index + 3]).toBe(255);
    }
    expect(ctx.putImageData).toHaveBeenCalledWith(imageData, 0, 0);
  });
});
