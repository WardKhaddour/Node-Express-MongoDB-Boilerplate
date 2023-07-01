module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-undef': 'error',
    'no-unused-vars': 'warn',
    'no-const-assign': 'error',
    'prefer-const': 'warn',
    'arrow-body-style': 'off',
    'eslint-disable-next-line consistent-return': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'func-names': 'off',
  },
};
