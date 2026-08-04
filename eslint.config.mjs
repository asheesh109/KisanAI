import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/app/api/**/route",
                "@/app/api/**/route.*",
                "**/app/api/**/route",
                "**/app/api/**/route.*",
              ],
              message:
                "Do not import from server route files. Move shared types into src/types or src/lib/types.",
            },
          ],
        },
      ],
    },
  },
];