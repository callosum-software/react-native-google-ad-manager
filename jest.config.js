module.exports = {
  preset: 'react-native',
  setupFiles: ['./src/tests/setupTests.js'],
  setupFilesAfterEnv: ['jest-enzyme'],
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/__tests__/**/*.test.[jt]s?(x)',
  ],
  testEnvironment: 'enzyme',
  testEnvironmentOptions: {
    enzymeAdapter: 'react16',
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
}
