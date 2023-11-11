module.exports = {
  "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
  rules: {
    // Your existing ESLint rules
    // ...

    // Disable the 'no-debugger' rule
    'no-debugger': 'off',
  },
};
