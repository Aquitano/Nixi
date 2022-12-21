import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: fileURLToPath(new URL('./index.html', import.meta.url)),
        background: fileURLToPath(new URL('./src/background.ts', import.meta.url)),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
