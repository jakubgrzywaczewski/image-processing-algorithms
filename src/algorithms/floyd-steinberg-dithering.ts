import type { Color } from '../types';
import { PALETTE } from './constants';

export const findClosestPaletteColor = (color: Color): Color => {
  if (PALETTE.length === 0) {
    throw new Error('Palette is empty. Cannot determine the closest color.');
  }

  const firstColor = PALETTE[0];
  if (!firstColor) {
    throw new Error('Invalid palette color.');
  }

  let closestColor = firstColor;
  let minDistance = Number.MAX_VALUE;

  for (const paletteColor of PALETTE) {
    const distance = Math.sqrt(
      (color.r - paletteColor.r) ** 2 +
        (color.g - paletteColor.g) ** 2 +
        (color.b - paletteColor.b) ** 2,
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
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];

    if (r !== undefined && g !== undefined && b !== undefined) {
      data[index] = Math.min(255, Math.max(0, r + errR * factor));
      data[index + 1] = Math.min(255, Math.max(0, g + errG * factor));
      data[index + 2] = Math.min(255, Math.max(0, b + errB * factor));
    }
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
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

      if (r === undefined || g === undefined || b === undefined) {
        continue;
      }

      const oldColor: Color = {
        r,
        g,
        b,
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
