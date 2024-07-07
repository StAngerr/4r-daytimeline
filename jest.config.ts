process.env.TZ = 'UTC';

const config = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)',
    ],
    testPathIgnorePatterns: ['\\\\node_modules\\\\'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    verbose: true,
};

module.exports = config;
