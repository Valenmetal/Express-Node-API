import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended, {
    "env": {
      "browser": true,
      "es2021": true,
      "node": true
    },
    "extends": ["eslint:recommended", "plugin:prettier/recommended"],
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "rules": {
      "prettier/prettier": ["error"],
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];