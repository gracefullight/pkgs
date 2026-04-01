import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { validateTargetDirectory } from "@/index.js";

describe("validateTargetDirectory", () => {
  let testRoot: string;

  beforeEach(() => {
    testRoot = path.join(tmpdir(), `cfs-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(testRoot, { recursive: true });
  });

  afterEach(() => {
    rmSync(testRoot, { recursive: true, force: true });
  });

  it("should return null for a non-existent directory", () => {
    const nonExistent = path.join(testRoot, "does-not-exist");
    expect(validateTargetDirectory("does-not-exist", nonExistent)).toBeNull();
  });

  it("should return null for an empty directory", () => {
    const emptyDir = path.join(testRoot, "empty");
    mkdirSync(emptyDir);
    expect(validateTargetDirectory("empty", emptyDir)).toBeNull();
  });

  it("should return null for current dir with only dotfiles (no .git)", () => {
    writeFileSync(path.join(testRoot, ".env"), "SECRET=123");
    expect(validateTargetDirectory(".", testRoot)).toBeNull();
  });

  it("should return error when .git directory exists", () => {
    mkdirSync(path.join(testRoot, ".git"));
    const result = validateTargetDirectory(".", testRoot);
    expect(result).toContain(".git");
  });

  it("should return error when .git exists even with named directory", () => {
    const targetDir = path.join(testRoot, "my-project");
    mkdirSync(targetDir);
    mkdirSync(path.join(targetDir, ".git"));
    const result = validateTargetDirectory("my-project", targetDir);
    expect(result).toContain(".git");
  });

  it("should return error when .git exists alongside other files", () => {
    mkdirSync(path.join(testRoot, ".git"));
    writeFileSync(path.join(testRoot, "README.md"), "# Hello");
    const result = validateTargetDirectory(".", testRoot);
    expect(result).toContain(".git");
  });

  it("should return error for non-current dir with non-dotfiles", () => {
    const targetDir = path.join(testRoot, "my-project");
    mkdirSync(targetDir);
    writeFileSync(path.join(targetDir, "index.ts"), "");
    const result = validateTargetDirectory("my-project", targetDir);
    expect(result).toContain("not empty");
  });

  it("should return null for current dir with only non-dot files", () => {
    writeFileSync(path.join(testRoot, "README.md"), "# Hello");
    // current dir (".") allows non-dotfiles (original behavior)
    expect(validateTargetDirectory(".", testRoot)).toBeNull();
  });

  it("should return null for named dir with only dotfiles (no .git)", () => {
    const targetDir = path.join(testRoot, "my-project");
    mkdirSync(targetDir);
    writeFileSync(path.join(targetDir, ".gitignore"), "node_modules");
    expect(validateTargetDirectory("my-project", targetDir)).toBeNull();
  });
});
