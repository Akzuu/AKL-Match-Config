module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'linebreak-style': 0,
    'no-useless-escape': 0,
    'no-underscore-dangle': 0,
    'func-names': 0,
    'no-param-reassign': 0,
    'no-useless-return': 0,
  },
};
