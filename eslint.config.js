import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    globalIgnores(['dist', 'dist-electron/', 'dist-react/', 'build/', 'node_modules/']),
    {
        files: ['**/*.{ts,tsx}'],
        plugins: { prettier: prettierPlugin },
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            eslintConfigPrettier,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            'prettier/prettier': 'warn',
            '@typescript-eslint/triple-slash-reference': 'off',
        },
    },
])
