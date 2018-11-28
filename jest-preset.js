module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: [
    '**/__tests__/**/*.(js|ts)?(x)',
    '**/?(*.)+(spec|test).(js|ts)?(x)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  }
};
