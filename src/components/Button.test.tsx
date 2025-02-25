import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Button } from './Button';

describe('Button Component', () => {
  test('renders button element', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Click Me</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Click Me');
  });

  test('calls onClick handler when clicked', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Click Me</Button>);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('renders children correctly', () => {
    const mockOnClick = vi.fn();
    render(
      <Button onClick={mockOnClick}>
        <span data-testid="child-element">Custom Child</span>
      </Button>,
    );

    const childElement = screen.getByTestId('child-element');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Custom Child');
  });

  test('renders button without children', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick} />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('');
  });

  test('has correct type attribute', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Click Me</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveAttribute('type', 'button');
  });
});
