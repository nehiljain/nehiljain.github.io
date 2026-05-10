import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    globals: false
  },
  resolve: {
    alias: { '@': path.resolve(__dirname) },
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json']
  }
});
