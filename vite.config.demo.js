import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function copyDirSync(src, dest) {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const srcPath = join(src, name);
    const destPath = join(dest, name);
    if (statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Build solo del demo para GitHub Pages
// Repo: github.com/julioalmirooficial/telpick → URL: https://julioalmirooficial.github.io/telpick/
export default defineConfig({
  base: '/telpick/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  plugins: [
    {
      name: 'copy-demo-assets',
      closeBundle() {
        const out = join(__dirname, 'docs', 'src', 'assets');
        copyDirSync(join(__dirname, 'src', 'assets'), out);
      },
    },
  ],
});
