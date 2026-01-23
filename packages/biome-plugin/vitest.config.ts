import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    pool: "forks",
    maxWorkers: 1,
    testTimeout: 30000,
  },
});
