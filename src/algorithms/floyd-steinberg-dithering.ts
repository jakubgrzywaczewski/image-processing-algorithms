import { PALETTE } from './helpers';
import type { Color } from '../types';

export const findClosestPaletteColor = (color: Color): Color => {
  if (PALETTE.length === 0) {
    throw new Error('Palette is empty. Cannot determine the closest color.');
  }

  let closestColor: Color = PALETTE[0]!;
  let minDistance = Number.MAX_VALUE;

  for (const paletteColor of PALETTE) {
    const distance = Math.sqrt(
      Math.pow(color.r - paletteColor.r, 2) +
        Math.pow(color.g - paletteColor.g, 2) +
        Math.pow(color.b - paletteColor.b, 2),
    );

    if (distance < minDistance) {
      closestColor = paletteColor;
      minDistance = distance;
    }
  }

  return closestColor;
};

function distributeError(
  data: Uint8ClampedArray,
  x: number,
  y: number,
  width: number,
  height: number,
  errR: number,
  errG: number,
  errB: number,
  factor: number,
) {
  if (x >= 0 && x < width && y >= 0 && y < height) {
    const index = (y * width + x) * 4;
    data[index] = Math.min(255, Math.max(0, data[index]! + errR * factor));
    data[index + 1] = Math.min(255, Math.max(0, data[index + 1]! + errG * factor));
    data[index + 2] = Math.min(255, Math.max(0, data[index + 2]! + errB * factor));
  }
}

export const applyFloydSteinbergDithering = (ctx: CanvasRenderingContext2D): void => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const oldColor: Color = {
        r: data[index]!,
        g: data[index + 1]!,
        b: data[index + 2]!,
      };
      const newColor = findClosestPaletteColor(oldColor);
      data[index] = newColor.r;
      data[index + 1] = newColor.g;
      data[index + 2] = newColor.b;

      const errR = oldColor.r - newColor.r;
      const errG = oldColor.g - newColor.g;
      const errB = oldColor.b - newColor.b;

      distributeError(data, x + 1, y, width, height, errR, errG, errB, 7 / 16);
      distributeError(data, x - 1, y + 1, width, height, errR, errG, errB, 3 / 16);
      distributeError(data, x, y + 1, width, height, errR, errG, errB, 5 / 16);
      distributeError(data, x + 1, y + 1, width, height, errR, errG, errB, 1 / 16);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};
