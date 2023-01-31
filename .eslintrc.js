module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    require.resolve('@umijs/lint/dist/config/eslint')
  ],
  
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    indent: 0,
    "default-case": 0,
    "eol-last": 0,
    "no-console": 0,
    "no-plusplus": 0,
    "no-script-url": 0,
    "prefer-rest-params": 0,
    "compat/compat": 0,
    "class-methods-use-this": 0,
    "react/no-access-state-in-setstate": 0,
    "react/destructuring-assignment": 0,
    "react/no-multi-comp": 0,
    "react/no-array-index-key": 0,
    "jsx-a11y/href-no-hash": 0,
    "jsx-a11y/control-has-associated-label": 0,
    "import/no-extraneous-dependencies": 0,
    "react/jsx-no-constructed-context-values": 0,
    "react/no-unstable-nested-components": 0,
    "no-undef": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-explicit-any": 0,
  },
};
