import globals from "globals";
import turboPlugin from "eslint-plugin-turbo"; 

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.turbo/**",
      "packages/**",   // Ignore all packages
      "apps/**",       // Ignore all apps
    ]
  },
  {
    files: ["*.js", ".*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
      },
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      turbo: turboPlugin, 
    },
    rules: {
      "turbo/no-undeclared-env-vars": "off",
      "no-console": "off",
      "import/no-anonymous-default-export": "off",
      "unicorn/prefer-top-level-await": "off",
      "no-process-env": "off",
    },
  }
];