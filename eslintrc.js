module.exports = {
  parser: '@babel/eslint-parser',
  plugins: ['jest', '@babel'],
  env: {
    'jest/globals': true
  },
  extends: ['plugin:jest/recommended', 'plugin:prettier/recommended', 'rea'],
};
