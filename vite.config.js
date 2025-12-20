import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => ({
  // Base path configuration
  // - Development: uses '/' for local dev server
  // - Production: uses repo name for GitHub Pages deployment
  // - Can be overridden with VITE_BASE_PATH env variable for flexibility
  base: mode === 'production' 
    ? process.env.VITE_BASE_PATH || '/hello-world-webcomponents/'
    : '/',
  
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Clean the output directory before building
    emptyOutDir: true,
    // Generate source maps for easier debugging (disabled in production for security)
    sourcemap: mode !== 'production',
    // Use terser for better code minification and optimization
    minify: 'terser',
    rollupOptions: {
      output: {
        // Split vendor code into separate chunks for better browser caching
        // When you update your code, users don't re-download unchanged dependencies
        manualChunks: {
          vendor: ['happy-dom'], // Add more dependencies here as needed
        },
      },
    },
  },
  
  server: {
    // Development server port
    port: 3000,
    // Automatically open browser on server start
    open: true,
    // Try next available port if 3000 is already in use
    strictPort: false,
  },
  
  test: {
    // Enable global test APIs (describe, it, expect, etc.) without imports
    globals: true,
    // Use happy-dom for fast DOM simulation in tests
    environment: 'happy-dom',
    // Code coverage configuration
    coverage: {
      provider: 'v8', // Fast coverage using V8's built-in coverage
      reporter: ['text', 'html'], // Generate both terminal and HTML reports
    },
  },
}));