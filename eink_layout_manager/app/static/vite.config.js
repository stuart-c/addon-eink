import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative paths for assets to support HA Ingress subpaths
  base: './',
  build: {
    outDir: '../static_dist', // Build into a directory clear of source
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8099',
        changeOrigin: true,
      },
      '/ping': {
        target: 'http://localhost:8099',
        changeOrigin: true,
      }
    }
  }
});
