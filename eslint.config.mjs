import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "**/app/api/**/route.ts",
      "**/app/api/**/route.js",
      "**/app/api/**/route.tsx",
      "**/app/api/**/route.jsx"
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/app/api/**/route",
                "**/app/api/**/route.ts",
                "**/app/api/**/route.js",
                "@/app/api/**/route",
                "@/app/api/**/route.ts",
                "@/app/api/**/route.js",
                "**/api/**/route",
                "**/api/**/route.ts",
                "**/api/**/route.js"
              ],
              message: "Do not import from server route files directly in client modules. Sharing types directly from route handlers causes case-sensitive build issues. Define shared types in a separate file (e.g. under src/types/ or src/lib/) and import them instead."
            }
          ]
        }
      ]
    }
  }
];

export default eslintConfig;
