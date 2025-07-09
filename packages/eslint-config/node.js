import { config as baseConfig } from "./base.js";
import pluginNode from "eslint-plugin-n";
import globals from "globals";

/**
 * ESLint config for Node.js projects (using esbuild)
 * @type {import("eslint").Linter.Config}
 */
export const nodeConfig = [
  ...baseConfig,
  {
    // Node-specific environment and globals
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    }
  },
  {
    // Node.js specific rules and plugin
    plugins: {
      node: pluginNode
    },
    rules: {
      "node/handle-callback-err": ["warn", "^(err|error)$"],
      "node/no-deprecated-api": "warn",
      "node/no-exports-assign": "error",
      "node/no-new-require": "warn",
      "node/no-path-concat": "warn",
      
      "node/no-unsupported-features/es-syntax": [
        "warn",
        { ignores: ["modules"] }  // Allows ESM syntax
      ],
      
      "node/process-exit-as-throw": "warn",
      "node/prefer-global/buffer": ["warn", "always"],
      "node/prefer-global/process": ["warn", "always"],
      
      // TypeScript-specific Node rules
      "node/no-missing-import": "off",  // Handled by TypeScript
      "node/no-unpublished-import": "off" // Handled by TypeScript
    }
  },
  {
    // esbuild-specific adjustments
    rules: {

      "import/no-dynamic-require": "off",
      "no-console": "off"
    }
  }
];