/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { applyReverseAlgorithm } from './reverse-pixels-algorithm';

describe('applyReverseAlgorithm', () => {
  let ctx: CanvasRenderingContext2D;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    ctx = canvas.getContext('2d')!;

    ctx.putImageData = vi.fn(
      (
        _imagedata: ImageData,
        _dx: number,
        _dy: number,
        _dirtyX?: number,
        _dirtyY?: number,
        _dirtyWidth?: number,
        _dirtyHeight?: number,
      ) => {},
    );

    ctx.getImageData = vi.fn().mockReturnValue({
      width: 2,
      height: 2,
      data: new Uint8ClampedArray([
        100, 150, 200, 255, 100, 150, 200, 255, 100, 150, 200, 255, 100, 150, 200, 255,
      ]),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should invert image colors', () => {
    applyReverseAlgorithm(ctx);
    const resultData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < resultData.length; i += 4) {
      expect(resultData[i]).toBe(255 - 100); // Red
      expect(resultData[i + 1]).toBe(255 - 150); // Green
      expect(resultData[i + 2]).toBe(255 - 200); // Blue
      expect(resultData[i + 3]).toBe(255); // Alpha should remain unchanged
    }
  });
});
