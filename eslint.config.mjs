import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Deal pages talk to guarded routes, which require the party's capability
  // token. `dealFetch` attaches it; a bare `fetch` silently drops it and the
  // request 401s at runtime. Making that a lint error is what lets the token
  // threading be verified statically instead of by driving the app.
  {
    files: ["app/deal/**/*.tsx", "app/new/**/*.tsx"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Use dealFetch() from @/lib/deal-fetch — a bare fetch() drops the deal capability token and the guarded route will 401.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
