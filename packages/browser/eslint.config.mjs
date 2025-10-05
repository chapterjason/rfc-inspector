// @ts-check

import eslint from '@eslint/js';
import {defineConfig} from 'eslint/config';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default defineConfig(
    {
        ignores: ['dist', 'coverage', 'node_modules', 'output', 'scripts/esbuild.js'],
    },
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    importPlugin.flatConfigs.typescript,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
);
