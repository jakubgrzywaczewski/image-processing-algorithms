import React from 'react';

import './Button.css';

type ButtonProps = {
  onClick: () => void;
  children?: React.ReactNode;
};

export const Button = ({ onClick, children }: ButtonProps) => (
  <button onClick={onClick}>{children}</button>
);
