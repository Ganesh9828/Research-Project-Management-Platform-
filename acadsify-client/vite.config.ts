import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createHtmlPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react', 'mock-aws-s3', 'aws-sdk', 'nock'], // Exclude problematic packages
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['mock-aws-s3', 'aws-sdk', 'nock'], // Mark problematic packages as external
    },
  },
});
