import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.spec.ts'],
        coverage: {
            provider: 'v8',
        },
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: true,
            },
        },
    },
    esbuild: {
        target: 'esnext',
    },
});
