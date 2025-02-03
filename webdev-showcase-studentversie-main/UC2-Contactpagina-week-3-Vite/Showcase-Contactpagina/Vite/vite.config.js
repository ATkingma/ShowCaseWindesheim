import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [eslint()],
    build: {
        outDir: '../wwwroot',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: 'js/[name].js', // Main JS file
                chunkFileNames: 'js/[name]-[hash].js', // Code-split chunks
                //assetFileNames: 'assets/[name]-[hash][extname]' // CSS, images, etc.
            }
        }
    },
    server: {
        proxy: {
            '/api': 'http://localhost:44321' // Adjust to your backend API URL
        }
    }
});
