import { afterEach, describe, expect, test, vi } from 'vitest';

import { applyImageTransform, cloneImageData, downloadImageData } from './image-data';

const createImageData = (pixels: number[], width: number, height: number): ImageData => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas context unavailable in test.');

  const imageData = context.createImageData(width, height);
  imageData.data.set(pixels);
  return imageData;
};

describe('image data helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('clones pixel storage instead of sharing it', () => {
    const source = createImageData([10, 20, 30, 255], 1, 1);
    const clone = cloneImageData(source);

    clone.data[0] = 99;

    expect(source.data[0]).toBe(10);
    expect(clone.data[0]).toBe(99);
  });

  test('transforms the full-resolution copy and preserves the source', () => {
    const source = createImageData([10, 20, 30, 255, 40, 50, 60, 128], 2, 1);
    let storedImageData = cloneImageData(source);
    const context = {
      putImageData: vi.fn((nextImageData: ImageData) => {
        storedImageData = nextImageData;
      }),
      getImageData: vi.fn(() => storedImageData),
    };
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);

    const result = applyImageTransform(source, (context) => {
      const transformed = context.getImageData(0, 0, 2, 1);
      transformed.data[0] = 200;
      context.putImageData(transformed, 0, 0);
    });
    getContext.mockRestore();

    expect(result.width).toBe(2);
    expect(result.data[0]).toBe(200);
    expect(result.data[7]).toBe(128);
    expect(source.data[0]).toBe(10);
  });

  test('downloads a PNG without attaching a temporary link to the document', () => {
    const source = createImageData([10, 20, 30, 255], 1, 1);
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    downloadImageData(source);

    expect(click).toHaveBeenCalledOnce();
  });
});
