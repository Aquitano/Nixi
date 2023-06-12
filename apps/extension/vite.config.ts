import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
	plugins: [solidPlugin()],
	server: {
		port: 3000,
	},
	build: {
		rollupOptions: {
			input: {
				// Index should be placed in dist not in dist/src/popup
				popup: fileURLToPath(new URL('./index.html', import.meta.url)),
				contentScript: fileURLToPath(new URL('./src/content/index.ts', import.meta.url)),
			},
			output: {
				entryFileNames: '[name].js',
			},
		},
		target: 'esnext',
		minify: true,
	},
});
