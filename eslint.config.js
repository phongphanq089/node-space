//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  ...tanstackConfig,
  {
    files: ['**/*.{js,ts,tsx,vue}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/require-await': 'off',
    },
  },
  {
    rules: {
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      '.output/**/*',
      '.vinxi/**/*',
      'dist/**/*',
      '.agents/**/*',
    ],
  },
  eslintConfigPrettier,
]
