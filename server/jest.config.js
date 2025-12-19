/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {}, // Disable Babel or other transformers for ES modules
  moduleNameMapper: {
    '^(\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
