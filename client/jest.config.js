module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest", // Use Babel to transform JavaScript and JSX files
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(axios)/)", // Tell Jest to transform axios and other ESM dependencies
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
      '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js', // Mock static assets
    },
    testEnvironment: "jsdom", // Set test environment to jsdom for React components
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  };
  