import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // Use '/' for local dev, '/hello-world-webcomponents/' for GitHub Pages
  base: command === 'build' ? '/hello-world-webcomponents/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
}));