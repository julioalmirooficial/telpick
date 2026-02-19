import { defineConfig } from 'vite';

// Build UMD solo para uso en HTML/CDN (un solo entry para evitar límite de Vite)
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: './index.js',
      name: 'Telpick',
      fileName: () => 'telpick.umd.js',
      formats: ['umd'],
    },
    rollupOptions: {
      output: {
        globals: {},
      },
    },
    copyPublicDir: false,
  },
});
