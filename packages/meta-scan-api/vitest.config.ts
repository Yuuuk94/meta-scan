import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Mirrors tsconfig.json's `@/*` -> `src/*` alias (the same mapping tsc-alias
// resolves at build time) so Vitest can run tests against `@/...` imports
// without a build step.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // No spec files exist on this branch yet (ADR-012 bootstrap only) — without
    // this, `vitest run` exits non-zero on an empty suite and looks like a
    // broken test command. Drop once real specs land.
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "src"),
    },
  },
});
