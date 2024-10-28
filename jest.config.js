/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+.tsx?$': ['ts-jest',{
      tsconfig: 'tsconfig.json'
    }],
  },
  roots: ['<rootDir>/src']
};