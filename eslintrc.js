module.exports = {
  parser: 'babel-eslint',
  plugins: ['flowtype', 'jest', 'babel'],
  env: {
    'jest/globals': true
  },
  extends: [
    'plugin:flowtype/recommended',
    'rea',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'flowtype/no-types-missing-file-annotation': 0
  }
};
