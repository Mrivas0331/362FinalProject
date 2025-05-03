export default {
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    testEnvironment: 'jest-fixed-jsdom',
    //setupFiles: ['<rootDir>/jest.setup.js'],
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest",
    },
  };