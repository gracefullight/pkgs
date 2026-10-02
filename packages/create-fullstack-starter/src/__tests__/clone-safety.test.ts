import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { execFileSync } = vi.hoisted(() => ({ execFileSync: vi.fn() }));
vi.mock("node:child_process", () => ({ execFileSync, execSync: vi.fn(), spawnSync: vi.fn() }));

import { cloneTemplate, validateTargetDirectory } from "@/index.js";

describe("safe template cloning", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), "starter-safety-"));
    execFileSync.mockReset();
    execFileSync.mockImplementation((_file, args: string[]) => {
      const dest = args.at(-1) as string;
      mkdirSync(path.join(dest, ".git"), { recursive: true });
      writeFileSync(path.join(dest, "README.md"), "template readme");
      writeFileSync(path.join(dest, ".env"), "template secret");
      return Buffer.alloc(0);
    });
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("passes destinations with spaces and shell metacharacters as a single argument", () => {
    const dest = path.join(root, "project with spaces;echo injected");
    cloneTemplate("owner/template", dest, false);

    expect(execFileSync).toHaveBeenCalledWith(
      "git",
      ["clone", "--depth", "1", "--", "https://github.com/owner/template.git", dest],
      { stdio: "pipe" },
    );
    expect(readFileSync(path.join(dest, "README.md"), "utf-8")).toBe("template readme");
  });

  it("preserves existing files when the template contains the same path", () => {
    writeFileSync(path.join(root, ".env"), "user secret");
    writeFileSync(path.join(root, "README.md"), "user readme");
    cloneTemplate("owner/template", root, true);

    expect(readFileSync(path.join(root, ".env"), "utf-8")).toBe("user secret");
    expect(readFileSync(path.join(root, "README.md"), "utf-8")).toBe("user readme");
  });

  it("returns a validation error for a file target", () => {
    const target = path.join(root, "existing-file");
    writeFileSync(target, "keep");
    expect(validateTargetDirectory("existing-file", target)).toContain("not a directory");
  });
});
