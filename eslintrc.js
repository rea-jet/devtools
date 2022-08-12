module.exports = {
  parser: '@babel/eslint-parser',
  plugins: ['jest', '@babel'],
  env: {
    'jest/globals': true
  },
  extends: ['plugin:prettier/recommended', 'plugin:jest/recommended', 'rea'],
};
