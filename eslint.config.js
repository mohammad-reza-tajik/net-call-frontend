import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-vars": "warn", // Warns about unused variables
      "prefer-const": "error", // Enforces const over let/var when possible
      "semi": ["error", "always"], // Requires semicolons
      "quotes": ["warn", "double"] // Prefers double quotes, warns on single
    }
  }

];

export default eslintConfig;
