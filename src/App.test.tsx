import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import App from './App';

describe('App', () => {
  test('shows the upload control before an image is selected', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Image Processing Algorithms' }),
    ).toBeInTheDocument();
    expect(screen.getByTitle('Upload an image to start processing')).toBeInTheDocument();
    expect(screen.queryByTitle(/Floyd-Steinberg Dithering/)).not.toBeInTheDocument();
  });

  test('allows selecting the same file again', () => {
    const { container } = render(<App />);
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    const file = new File(['not decoded in this unit test'], 'photo.png', { type: 'image/png' });

    expect(input).not.toBeNull();
    if (!input) return;

    fireEvent.change(input, { target: { files: [file] } });
    expect(input.value).toBe('');
  });
});
