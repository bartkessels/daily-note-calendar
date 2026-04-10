import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

const config: Linter.Config[] = [
  {
    ignores: ['main.js', 'node_modules/', '*.mjs', '*.mts'],
  },
  // Spread the recommended configs (sets up plugin, parser, and base rules)
  ...tseslint.configs.recommended,
  // Layer our custom rules on top
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      // Base ESLint style
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'indent': ['error', 4],
      'no-var': 'error',
      'no-console': 'error',
      'prefer-const': 'error',
      // TypeScript-specific
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    },
  },
  {
    // Relaxed rules for spec files and test helpers
    files: ['src/**/*.spec.ts', 'src/**/*.spec.tsx', 'src/test-helpers/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];

export default config;
