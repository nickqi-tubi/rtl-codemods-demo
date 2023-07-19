module.exports = {
  clearMocks: true,
  rootDir: __dirname,
  testMatch: ['**/src/**/*.spec.ts'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
  },
};
