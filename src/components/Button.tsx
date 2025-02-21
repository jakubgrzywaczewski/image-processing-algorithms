import type { ReactNode } from 'react';

import './Button.css';

type ButtonProps = {
  onClick: () => void;
  children?: ReactNode;
};

export const Button = ({ onClick, children }: ButtonProps) => (
  <button onClick={onClick} type="button">
    {children}
  </button>
);
