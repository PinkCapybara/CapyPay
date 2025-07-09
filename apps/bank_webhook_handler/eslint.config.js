import { nodeConfig } from "@repo/eslint-config/node";

export default [
  ...nodeConfig,
  {
    // Package-specific overrides
    files: ["src/**/*.ts"],
    rules: {
      "node/no-sync": "warn"
    }
  }
];