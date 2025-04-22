module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: "module"
  },
  settings: {
    react: { version: "detect" }
  },
  ignorePatterns: ['.eslintrc.js', 'cypress.config.js', 'cypress/**/*.js'],
  rules: {
    "react/prop-types": "off",
    "no-console": "warn",
    "no-unused-vars": "off",
    "no-case-declarations": "off",
    "no-debugger": "error"
  }
}
