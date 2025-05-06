import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: './',
    plugins: [
        vue(),
        electron({
            entry: 'src/main.js',
        }),
        tailwindcss(),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },

});