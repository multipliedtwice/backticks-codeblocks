module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es2021: true,
    'jest/globals': true,
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {},
};
