import type { StrykerOptions } from '@stryker-mutator/api/core';

const config: Partial<StrykerOptions> = {
  testRunner: 'jest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.ts',
    enableFindRelatedTests: true,
  },
  tsconfigFile: 'tsconfig.json',
  coverageAnalysis: 'perTest',
  mutate: [
    'src/business/**/*.ts',
    'src/domain/**/*.ts',
    'src/infrastructure/repositories/**/*.ts',
    'src/infrastructure/parsers/**/*.ts',
    'src/presentation/command-handlers/*.ts',
    'src/presentation/factories/*.ts',
    'src/presentation/services/*.ts',
    'src/presentation/view-models/*.ts',
    '!src/**/*.spec.ts',
  ],
  ignorePatterns: [
    'main.js',
    'docs',
    'reports',
  ],
  reporters: ['html', 'clear-text', 'progress'],
  thresholds: {
    high: 85,
    low: 60,
    break: null,
  },
  timeoutMS: 10000,
  timeoutFactor: 2,
  concurrency: 2,
  maxTestRunnerReuse: 10,
};

export default config;
