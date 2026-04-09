import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/infrastructure/obsidian/.*adapter\\.ts$',
    '/src/daily-note-calendar\\.plugin\\.ts$',
    '/src/daily-note-calendar\\.plugin-setting-tab\\.ts$',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: false,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
          target: 'es2018',
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  roots: ['<rootDir>/src'],
};

export default config;
