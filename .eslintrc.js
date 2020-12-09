module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: ["airbnb-base"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    quotes: ["error", "double"],
    "eol-last": ["error", "always"],
    semi: ["error", "always"],
    "no-plusplus": "off",
    "operator-linebreak": [
      "error",
      "after",
      { overrides: { "?": "before", ":": "before" } },
    ],
    "comma-dangle": ["error", "always-multiline"],
    "no-console": ["error", { allow: ["warn", "error"] }],
    "prefer-destructuring": "off",
    "arrow-parens": ["error", "always"],
    "arrow-body-style": "off",
    "object-curly-newline": "off",
    "no-use-before-define": "off",
    "no-shadow": "off",
    "space-before-function-paren": [
      "error",
      { anonymous: "always", named: "never", asyncArrow: "always" },
    ],
    "no-restricted-syntax": "off",
    camelcase: "off",
    "no-continue": "off",
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "consistent-return": "off",
    "function-paren-newline": ["error", "consistent"],
    "quote-props": 2,
    "import/extensions": 0,
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": ["error", { allow: ["_defaultsDeep"] }],
  },
};
