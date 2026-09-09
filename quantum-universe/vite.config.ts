import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@engine': path.resolve(import.meta.dirname, 'src/engine'),
      '@store': path.resolve(import.meta.dirname, 'src/store'),
      '@components': path.resolve(import.meta.dirname, 'src/components'),
      '@pages': path.resolve(import.meta.dirname, 'src/pages'),
      '@styles': path.resolve(import.meta.dirname, 'src/styles'),
      '@viz': path.resolve(import.meta.dirname, 'src/visualization'),
      '@types': path.resolve(import.meta.dirname, 'src/types'),
      '@quantum-types': path.resolve(import.meta.dirname, 'src/types'),
      '@utils': path.resolve(import.meta.dirname, 'src/utils'),
    },
  },
});
