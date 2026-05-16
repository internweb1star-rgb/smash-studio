import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Ensure CSS is extracted and linked before JS in the HTML output
    cssCodeSplit: false,
  }
});
