import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    deps: {
      inline: ['vitest-canvas-mock'],
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
  base: '/floyd-steinberg-algorithm-js/'
});
