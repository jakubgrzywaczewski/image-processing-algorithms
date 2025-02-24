import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Algorithm } from '../types/algorithms';
import Toolbar from './Toolbar';

describe('Toolbar Component', () => {
  test('renders upload button when no image is loaded', () => {
    const mockOnAlgorithmSelect = vi.fn();
    const mockOnFileSelect = vi.fn();

    render(
      <Toolbar
        onAlgorithmSelect={mockOnAlgorithmSelect}
        hasImage={false}
        onFileSelect={mockOnFileSelect}
      />,
    );

    const uploadButton = screen.getByTitle('Upload an image to start processing');
    expect(uploadButton).toBeInTheDocument();

    // Check that algorithm buttons are not rendered
    expect(screen.queryByText('FS')).not.toBeInTheDocument();
    expect(screen.queryByText('GS')).not.toBeInTheDocument();
    expect(screen.queryByText('RV')).not.toBeInTheDocument();
    expect(screen.queryByText('OR')).not.toBeInTheDocument();
    expect(screen.queryByText('↓')).not.toBeInTheDocument();
  });

  test('renders algorithm buttons when image is loaded', () => {
    const mockOnAlgorithmSelect = vi.fn();
    const mockOnFileSelect = vi.fn();

    render(
      <Toolbar
        onAlgorithmSelect={mockOnAlgorithmSelect}
        hasImage={true}
        onFileSelect={mockOnFileSelect}
      />,
    );

    // Check that all algorithm buttons are rendered
    expect(
      screen.getByTitle(
        'Floyd-Steinberg Dithering: Reduces the color palette while maintaining image detail through error diffusion',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('Grayscale: Converts the image to black and white using luminance values'),
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('Reverse Colors: Inverts all colors in the image to their opposite values'),
    ).toBeInTheDocument();
    expect(screen.getByTitle('Restore: Return to original image')).toBeInTheDocument();
    expect(
      screen.getByTitle('Download: Save the processed image to your device'),
    ).toBeInTheDocument();
    expect(screen.getByTitle('Change Image: Upload a new image to process')).toBeInTheDocument();
  });

  test('calls onAlgorithmSelect when algorithm buttons are clicked', () => {
    const mockOnAlgorithmSelect = vi.fn();
    const mockOnFileSelect = vi.fn();

    render(
      <Toolbar
        onAlgorithmSelect={mockOnAlgorithmSelect}
        hasImage={true}
        onFileSelect={mockOnFileSelect}
      />,
    );

    // Click each algorithm button and verify the correct algorithm is passed
    fireEvent.click(screen.getByText('FS'));
    expect(mockOnAlgorithmSelect).toHaveBeenLastCalledWith(Algorithm.FLOYD_STEINBERG);

    fireEvent.click(screen.getByText('GS'));
    expect(mockOnAlgorithmSelect).toHaveBeenLastCalledWith(Algorithm.GRAYSCALE);

    fireEvent.click(screen.getByText('RV'));
    expect(mockOnAlgorithmSelect).toHaveBeenLastCalledWith(Algorithm.REVERSE);

    fireEvent.click(screen.getByText('OR'));
    expect(mockOnAlgorithmSelect).toHaveBeenLastCalledWith(Algorithm.RESTORE);

    fireEvent.click(screen.getByText('↓'));
    expect(mockOnAlgorithmSelect).toHaveBeenLastCalledWith(Algorithm.DOWNLOAD);
  });

  test('calls onFileSelect when file input changes', () => {
    const mockOnAlgorithmSelect = vi.fn();
    const mockOnFileSelect = vi.fn();

    const { container } = render(
      <Toolbar
        onAlgorithmSelect={mockOnAlgorithmSelect}
        hasImage={true}
        onFileSelect={mockOnFileSelect}
      />,
    );

    // Find file input and trigger change
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput as Element, { target: { files: [file] } });

    expect(mockOnFileSelect).toHaveBeenCalled();
  });
});
