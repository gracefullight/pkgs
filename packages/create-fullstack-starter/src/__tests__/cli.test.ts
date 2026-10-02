import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import packageJson from "@package" with { type: "json" };
import { describe, expect, it } from "vitest";

describe("CLI entrypoint", () => {
  it("prints the package version when invoked through a package bin symlink", () => {
    const root = mkdtempSync(join(tmpdir(), "starter-cli-"));
    const bin = join(root, "create-fullstack-starter.ts");
    try {
      symlinkSync(resolve(import.meta.dirname, "../index.ts"), bin);
      const output = execFileSync(process.execPath, ["--import", "tsx", bin, "--version"], {
        cwd: resolve(import.meta.dirname, "../.."),
        encoding: "utf-8",
      });
      expect(output.trim()).toBe(packageJson.version);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
