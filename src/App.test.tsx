import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import App from './App';

describe('App tests', () => {
  test('App mounts properly', () => {
    const wrapper = render(<App />);
    expect(wrapper).toBeTruthy();

    const h1 = wrapper.container.querySelector('h1');
    expect(h1?.textContent).toBe('Image Processing Algorithms');
  });
});
