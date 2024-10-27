/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  }
};