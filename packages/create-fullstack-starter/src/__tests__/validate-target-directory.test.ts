import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cloneTemplate, validateTargetDirectory } from "@/index.js";

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
    expect(validateTargetDirectory(".", testRoot)).toBeNull();
  });

  it("should return null for named dir with only dotfiles (no .git)", () => {
    const targetDir = path.join(testRoot, "my-project");
    mkdirSync(targetDir);
    writeFileSync(path.join(targetDir, ".gitignore"), "node_modules");
    expect(validateTargetDirectory("my-project", targetDir)).toBeNull();
  });
});

describe("cloneTemplate", () => {
  let testRoot: string;

  beforeEach(() => {
    testRoot = path.join(
      tmpdir(),
      `cfs-clone-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    mkdirSync(testRoot, { recursive: true });
  });

  afterEach(() => {
    rmSync(testRoot, { recursive: true, force: true });
  });

  it("should clone into a new directory and remove .git", () => {
    const dest = path.join(testRoot, "new-project");
    cloneTemplate("first-fluke/fullstack-starter", dest, false);

    expect(existsSync(dest)).toBe(true);
    expect(existsSync(path.join(dest, ".git"))).toBe(false);

    const files = readdirSync(dest);
    expect(files.length).toBeGreaterThan(0);
  }, 30_000);

  it("should clone into current directory via temp dir and remove .git", () => {
    cloneTemplate("first-fluke/fullstack-starter", testRoot, true);

    expect(existsSync(path.join(testRoot, ".git"))).toBe(false);

    const files = readdirSync(testRoot);
    expect(files.length).toBeGreaterThan(0);
  }, 30_000);

  it("should preserve existing dotfiles when cloning to current dir", () => {
    writeFileSync(path.join(testRoot, ".env"), "SECRET=keep");
    cloneTemplate("first-fluke/fullstack-starter", testRoot, true);

    expect(existsSync(path.join(testRoot, ".env"))).toBe(true);
    const content = require("node:fs").readFileSync(path.join(testRoot, ".env"), "utf-8");
    expect(content).toBe("SECRET=keep");
  }, 30_000);

  it("should throw when repo does not exist", () => {
    const dest = path.join(testRoot, "bad-repo");
    expect(() => cloneTemplate("nonexistent/repo-that-does-not-exist-xyz", dest, false)).toThrow();
  }, 15_000);

  it("should not leave temp directory on failure for current dir clone", () => {
    const tmpBefore = readdirSync(tmpdir()).filter((f) => f.startsWith("fullstack-starter-"));

    try {
      cloneTemplate("nonexistent/repo-that-does-not-exist-xyz", testRoot, true);
    } catch {
      // expected
    }

    const tmpAfter = readdirSync(tmpdir()).filter((f) => f.startsWith("fullstack-starter-"));
    expect(tmpAfter.length).toBe(tmpBefore.length);
  }, 15_000);
});
