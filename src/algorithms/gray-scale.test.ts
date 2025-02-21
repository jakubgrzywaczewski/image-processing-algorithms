import { beforeEach, describe, expect, test } from 'vitest';

import { applyGrayscaleAlgorithm } from './gray-scale';

describe('applyGrayscaleAlgorithm', () => {
  let ctx: CanvasRenderingContext2D;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 4;
    canvas.height = 4;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255; // Red
      data[i + 1] = 0; // Green
      data[i + 2] = 0; // Blue
      data[i + 3] = 255; // Alpha
    }
    ctx.putImageData(imageData, 0, 0);
  });

  test('should convert an image to grayscale', () => {
    applyGrayscaleAlgorithm(ctx);

    const resultData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < resultData.length; i += 4) {
      const grayValue = resultData[i];
      expect(resultData[i]).toBe(grayValue);
      expect(resultData[i + 1]).toBe(grayValue);
      expect(resultData[i + 2]).toBe(grayValue);
    }
  });
});
