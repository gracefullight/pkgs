import { execSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const rulesDir = resolve(import.meta.dirname, "../rules");
let tempDir: string;

beforeAll(() => {
  tempDir = mkdtempSync(join(tmpdir(), "biome-plugin-test-"));

  cpSync(rulesDir, join(tempDir, "rules"), { recursive: true });

  writeFileSync(
    join(tempDir, "biome.json"),
    JSON.stringify({
      $schema: "https://biomejs.dev/schemas/2.3.11/schema.json",
      plugins: ["./rules/no-relative-imports.grit"],
      linter: {
        rules: {
          correctness: {
            noUnusedImports: "off",
            noUnusedVariables: "off",
          },
        },
      },
    }),
  );

  writeFileSync(
    join(tempDir, "relative-imports.ts"),
    `import { foo } from "./utils";
import { bar } from "../components";
import type { Baz } from "./types";
const lazy = await import("./lazy");
export { qux } from "./exports";
export type { Quux } from "../models";
export * from "./all";
export * as ns from "../namespace";
`,
  );

  writeFileSync(
    join(tempDir, "valid-imports.ts"),
    `import { foo } from "@/utils";
import { bar } from "@/components";
import type { Baz } from "@/types";
const lazy = await import("@/lazy");
export { qux } from "@/exports";
export type { Quux } from "@/models";
export * from "@/all";
export * as ns from "@/namespace";
`,
  );
});

afterAll(() => {
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

function runBiomeLint(file: string): string {
  try {
    const result = execSync(`npx @biomejs/biome lint ${file}`, {
      cwd: tempDir,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return result;
  } catch (error) {
    const err = error as { stdout: string; stderr: string };
    return `${err.stdout || ""}${err.stderr || ""}`;
  }
}

describe("no-relative-imports", () => {
  describe("should report relative imports", () => {
    it("detects static import with ./", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./utils");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects static import with ../", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("../components");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects type import", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./types");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects dynamic import with warning severity", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./lazy");
      expect(output).toContain("Avoid relative dynamic import path");
    });

    it("detects export from", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./exports");
      expect(output).toContain("Avoid relative export path");
    });

    it("detects export type from", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("../models");
      expect(output).toContain("Avoid relative export path");
    });

    it("detects export * from", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./all");
      expect(output).toContain("Avoid relative export path");
    });

    it("detects export * as from", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("../namespace");
      expect(output).toContain("Avoid relative export path");
    });
  });

  describe("should not report path alias imports", () => {
    it("allows @/ alias imports", () => {
      const output = runBiomeLint("valid-imports.ts");
      expect(output).not.toContain("Avoid relative import path");
      expect(output).not.toContain("Avoid relative export path");
      expect(output).not.toContain("Avoid relative dynamic import path");
    });
  });
});
