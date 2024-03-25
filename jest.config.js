const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(rc-.+?|@babel/runtime).+(js|jsx)$'],
  setupFilesAfterEnv: ['./jest-setup.js'],
  globalSetup: './jest-global-setup.js',
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!src/_mocks_/**',
    '!src/config/**',
    '!src/constants/**',
    '!src/masterData/**',
    '!src/translations/**',
    '!src/types/**',
    '!src/globalStyle.ts',
    '!src/reportWebVitals.ts',
    '!src/react-app-env.d.ts',
    '!src/setupTest.ts',
    '!src/test-utils.tsx',
    '!src/App.tsx',
    '!src/index.ts',
  ],
  moduleNameMapper: {
    '\\.svg\\?react$': '<rootDir>/src/__mocks__/file-mock.js',
  },
  // coverageThreshold: {
  //   global: {
  //     branches: 1,
  //     functions: 1,
  //     lines: 1,
  //     statements: 1,
  //   },
  // },
}

// eslint-disable-next-line import/no-unused-modules
export default config
