import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
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
});
