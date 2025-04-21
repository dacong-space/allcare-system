module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-debugger": "error"
  }
};
