import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const versionFromFile = (): string => {
  try {
    const raw = fs.readFileSync(path.resolve(__dirname, 'VERSION.md'), 'utf8');
    const match = raw.match(/Current Version:\s*`([^`]+)`/);
    return match?.[1]?.trim() || '0.0.0';
  } catch (error) {
    console.warn('Unable to read VERSION.md for app version', error);
    return '0.0.0';
  }
};

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: undefined,
      include: [/\.tsx?$/, /\.jsx?$/],
      fastRefresh: true,
    }),
    splitVendorChunkPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  envPrefix: ['VITE_', 'DEBUG_'],
  esbuild: {
    target: 'es2019',
    jsxDev: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand'],
    esbuildOptions: {
      target: 'es2019',
    },
  },
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          state: ['zustand'],
          analytics: [
            './src/core/analytics/volumeAnalytics',
            './src/core/analytics/frequencyAnalytics',
            './src/core/analytics/progressionAnalytics',
          ],
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(versionFromFile()),
  },
});
