import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Canvas from './Canvas';

// Declare the global type for createImageBitmap
declare global {
  function createImageBitmap(
    image: ImageBitmapSource,
    options?: ImageBitmapOptions,
  ): Promise<ImageBitmap>;
}

// Mock createImageBitmap globally since it's not implemented in jsdom
global.createImageBitmap = vi.fn().mockResolvedValue({
  width: 100,
  height: 100,
});

describe('Canvas Component', () => {
  test('renders canvas element without imageData', () => {
    const mockSetCanvasContext = vi.fn();
    const { container } = render(
      <Canvas setCanvasContext={mockSetCanvasContext} imageData={null} />,
    );
    const canvasElement = container.querySelector('canvas');
    expect(canvasElement).toBeInTheDocument();
  });
});
