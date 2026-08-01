import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync, existsSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const FLAGS_PATH_WRONG = /\.\/src\/assets\/flags\//g;
const FLAGS_PATH_RIGHT = './assets/flags/';

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

function generateFlagsImports() {
  const flagsDir = join(__dirname, 'src', 'assets', 'flags');
  const outPath = join(__dirname, 'src', 'flags-imports.js');
  const entries = readdirSync(flagsDir)
    .filter(filename => /\.(webp|png)$/i.test(filename))
    .map(filename => ({ key: filename.replace(/\.[^.]+$/, '').toLowerCase(), filename }))
    .sort((a, b) => a.key.localeCompare(b.key));
  const safeKey = (key) => `flag_${key.replace(/[^a-zA-Z0-9_$]/g, '_')}`;
  const imports = entries
    .map(({ key, filename }) => `import ${safeKey(key)} from './assets/flags/${filename}?url'`)
    .join('\n');
  const exportEntries = entries.map(({ key }) => `${JSON.stringify(key)}: ${safeKey(key)}`).join(', ');
  const content = `// Generated – do not edit. Run build to regenerate.\n${imports}\n\nexport default { ${exportEntries} }\n`;
  writeFileSync(outPath, content, 'utf8');
}

export default defineConfig({
  build: {
    lib: {
      entry: {
        telpick: './index.js',
        'telpick.vue': './entry-vue.js',
        'telpick.react': './entry-react.jsx',
        'telpick-zone': './index-zone.js',
        'telpick-zone.vue': './entry-zone-vue.js',
        'telpick-zone.react': './entry-zone-react.jsx',
      },
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => {
        if (id === 'vue' || id === 'react') return true
        if (id.includes('assets/flags/') && (id.endsWith('?url') || id.endsWith('.webp') || id.endsWith('.png'))) return true
        return false
      },
      output: {
        globals: {
          vue: 'Vue',
          react: 'React',
        },
      },
    },
    copyPublicDir: false,
  },
  plugins: [
    {
      name: 'generate-flags-imports',
      buildStart() {
        generateFlagsImports();
      },
    },
    {
      // Resolver banderas a dist/assets/flags para que el output tenga ./assets/flags/ (el consumidor solo tiene dist/)
      name: 'resolve-flags-to-dist',
      resolveId(id, importer) {
        if (!importer || !importer.includes('flags-imports')) return null;
        const m = id.match(/^\.\/assets\/flags\/([^?]+)(\?url)?$/);
        if (!m) return null;
        const resolved = join(__dirname, 'dist', 'assets', 'flags', m[1]);
        return { id: resolved + (m[2] || ''), external: true };
      },
    },
    {
      name: 'copy-lib-assets',
      buildStart() {
        mkdirSync(join(__dirname, 'dist'), { recursive: true });
        copyDirSync(join(__dirname, 'src', 'assets'), join(__dirname, 'dist', 'assets'));
      },
      closeBundle() {
        copyDirSync(join(__dirname, 'src', 'assets'), join(__dirname, 'dist', 'assets'));
        copyFileSync(join(__dirname, 'src', 'telpick.d.ts'), join(__dirname, 'dist', 'telpick.d.ts'));
      },
    },
    {
      // Corregir rutas de banderas en el bundle (Rollup puede dejar ./src/assets/flags/)
      name: 'fix-flags-paths-in-dist',
      closeBundle() {
        const distDir = join(__dirname, 'dist');
        if (!existsSync(distDir)) return;
        for (const name of readdirSync(distDir)) {
          if (!name.endsWith('.js')) continue;
          const filePath = join(distDir, name);
          let code = readFileSync(filePath, 'utf8');
          if (code.includes('./src/assets/flags/')) {
            code = code.replace(FLAGS_PATH_WRONG, FLAGS_PATH_RIGHT);
            writeFileSync(filePath, code, 'utf8');
          }
        }
      },
    },
  ],
});
