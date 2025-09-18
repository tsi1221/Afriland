import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // explicitly use port 3000
    strictPort: true,  // fail if 3000 is already in use
    hmr: {
      overlay: true,   // show errors overlay in browser
    },
  },
  optimizeDeps: {
    exclude: ['drizzle', 'drizzle-react'], // prevent Vite from pre-bundling these
  },
  build: {
    rollupOptions: {
      external: ['drizzle', 'drizzle-react'], // mark as external to avoid bundling errors
    },
  },
  esbuild: {
    include: /src\/.*\.[jt]sx?$/, // optional, ensures esbuild handles your source files
  },
});
