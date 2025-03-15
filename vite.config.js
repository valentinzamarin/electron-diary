import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';

export default defineConfig({
    plugins: [
        vue(), // Поддержка Vue
        electron({
            entry: 'src/main.js', // Точка входа для Electron
        }),
    ],
    build: {
        outDir: 'dist', // Папка для сборки
    },
});