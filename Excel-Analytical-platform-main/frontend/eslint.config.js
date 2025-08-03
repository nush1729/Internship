import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

// REASON: This is the standard, modern, and complete ESLint configuration for a Vite + React project.
// It imports and applies the recommended sets of rules for both JavaScript and React.
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReactConfig,
];