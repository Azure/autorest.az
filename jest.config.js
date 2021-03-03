module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    moduleNameMapper: {},
    collectCoverage: true,
    coverageReporters: ['html'],
    coveragePathIgnorePatterns: ['/node_modules/', 'dist'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    testMatch: ["**/test/**/*.ts", "!**/test/**/*.d.ts", "!**/test/**/test-helper.ts", "!**/.history/**"],
    verbose: true,
};