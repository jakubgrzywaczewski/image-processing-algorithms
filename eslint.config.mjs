import path from 'path';
import { fileURLToPath } from 'url';

import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import eslintReact from 'eslint-plugin-react';
import eslintHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  prettierConfig,
  {
    ignores: ['dist', 'node_modules', 'coverage', '*.config.mjs', '*.config.ts', '*.cjs'],
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 0,
    },
  },
  {
    files: ['**.*ts', '**.*tsx'],
    plugins: {
      react: eslintReact,
      'react-hooks': eslintHooks,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
);
