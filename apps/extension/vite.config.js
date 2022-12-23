import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: fileURLToPath(new URL('./index.html', import.meta.url)),
        contentScript: fileURLToPath(new URL('./src/contentScript.ts', import.meta.url)),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    minify: false,
  },
});
