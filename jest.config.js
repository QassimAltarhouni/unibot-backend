/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts', '!src/types/**'],
  moduleNameMapper: {
    // Test doubles for configuration and logging (no .env or pino worker needed)
    '^config$': '<rootDir>/test/support/config.ts',
    '^@/Utils/Logger$': '<rootDir>/test/support/logger.ts',
    // Path aliases from tsconfig.json
    '^@/Service/(.*)$': '<rootDir>/src/core/service/$1',
    '^@/PublicControllers/(.*)$': '<rootDir>/src/presentations/public/$1',
    '^@/Middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@/Model/(.*)$': '<rootDir>/src/core/model/$1',
    '^@/Routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@/Schema/(.*)$': '<rootDir>/src/core/schema/$1',
    '^@/Utils/(.*)$': '<rootDir>/src/common/utils/$1',
  },
};
