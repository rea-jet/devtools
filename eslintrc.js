module.exports = {
  parser: 'babel-eslint',
  plugins: ['jest', 'babel'],
  env: {
    'jest/globals': true
  },
  extends: ['rea', 'plugin:jest/recommended', 'plugin:prettier/recommended']
};
