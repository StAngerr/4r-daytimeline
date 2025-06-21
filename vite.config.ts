import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
    if (mode === 'docs') {
        return {
            root: 'docs',
            resolve: {
                alias: {
                    '4r-daytimeline': resolve(__dirname, 'src'),
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
                name: '4r-daytimeline',
                fileName: (format) => `4r-daytimeline.${format}.js`,
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
