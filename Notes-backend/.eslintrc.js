module.exports = {
  env: {
    commonjs: true,
    es2021: true,

    node: true,
  },
  extends: ['eslint:recommended', 'airbnb'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'never',
    ],
    eqeqeq: 'error', // === instead of ==
    'no-trailing-spaces': 'error', // extra space at the end of line = considered as error
    'object-curly-spacing': [ // { key: 'value' };
      'error', 'always',
    ],
    'arrow-spacing': [ // =>
      'error', { before: true, after: true },
    ],
    'no-console': 0,

  },
}
