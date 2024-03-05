import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  envDir: 'env',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});