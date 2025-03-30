module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['./tests/setup.js'],
  detectOpenHandles: true,
  forceExit: true,
  testMatch: [
    "**/tests/**/*.test.js"
  ],
  clearMocks: true
};