import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
    if (mode === 'docs') {
        return {
            root: 'docs',
            resolve: {
                alias: {
                    'day-timeline': resolve(__dirname, 'src'),
                },
                preserveSymlinks: false,
            },
            optimizeDeps: {
                include: ['react/jsx-dev-runtime', 'react-router-dom'],
            },
            build: {
                outDir: 'build',
                rollupOptions: {
                    input: resolve(__dirname, 'docs/index.html'),
                    external: [],
                },
            },
            plugins: [react()],
        };
    }

    return {
        build: {
            emptyOutDir: false,
            copyPublicDir: false,
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                name: 'day-timeline',
                fileName: (format) => `day-timeline.${format}.js`,
                formats: ['es', 'umd'],
            },
            rollupOptions: {
                external: ['react', 'react/jsx-runtime'],
                output: {
                    globals: {
                        react: 'react',
                    },
                },
            },
        },
        plugins: [react()],
    };
});
