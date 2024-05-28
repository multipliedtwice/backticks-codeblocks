/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // collectCoverageFrom: ['src/*.spec.{js,ts}'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/__tests__/*.spec.{js,ts}'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  coveragePathIgnorePatterns: ['<rootDir>/src/fuzz/fuzz.ts'],
};
