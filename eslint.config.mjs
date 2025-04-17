import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Import the ESLint config using dynamic import
import eslintConfigData from "eslint/conf/eslintrc.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add this override to disable all rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: Object.fromEntries(
      Object.keys(eslintConfigData.rules).map((rule) => [
        rule,
        "off",
      ])
    ),
  },
];

export default eslintConfig;
