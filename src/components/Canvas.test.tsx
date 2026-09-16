import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Canvas, { calculateScaledDimensions } from './Canvas';

describe('Canvas Component', () => {
  test('renders canvas element without imageData', () => {
    const { container } = render(<Canvas imageData={null} />);
    const canvasElement = container.querySelector('canvas');
    expect(canvasElement).toBeInTheDocument();
  });

  test('fits wide images within both viewport constraints', () => {
    expect(calculateScaledDimensions({ width: 2000, height: 1500 }, 1000, 500)).toEqual({
      newWidth: 667,
      newHeight: 500,
      scale: 1 / 3,
      naturalWidth: 2000,
      naturalHeight: 1500,
    });
  });

  test('does not upscale small images', () => {
    expect(calculateScaledDimensions({ width: 200, height: 100 }, 1000, 500)).toEqual({
      newWidth: 200,
      newHeight: 100,
      scale: 1,
      naturalWidth: 200,
      naturalHeight: 100,
    });
  });

  test('draws image data and updates zoom and drag state', () => {
    const imageData = new ImageData(new Uint8ClampedArray(100 * 50 * 4), 100, 50);
    const { container } = render(<Canvas imageData={imageData} />);
    const canvas = container.querySelector('canvas');
    const slider = screen.getByRole('slider');

    expect(canvas).not.toBeNull();
    if (!canvas) return;

    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(50);

    fireEvent.change(slider, { target: { value: '150' } });
    expect(slider).toHaveValue('150');

    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    expect(canvas.style.cursor).toBe('grabbing');
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 25 });
    fireEvent.mouseUp(canvas);
    expect(canvas.style.cursor).toBe('grab');
    fireEvent.mouseLeave(canvas);
  });

  test('refits the canvas after the viewport changes', () => {
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    const imageData = new ImageData(new Uint8ClampedArray(200 * 100 * 4), 200, 100);
    const { container } = render(<Canvas imageData={imageData} />);
    const canvas = container.querySelector('canvas');

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 100 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 });
    fireEvent(window, new Event('resize'));

    expect(canvas?.width).toBe(90);
    expect(canvas?.height).toBe(45);

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalHeight });
  });
});
