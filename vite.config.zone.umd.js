import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: './src/telpick-zone.js',
      name: 'TelpickZone',
      fileName: () => 'telpick-zone.umd.js',
      formats: ['umd']
    },
    copyPublicDir: false
  }
})
