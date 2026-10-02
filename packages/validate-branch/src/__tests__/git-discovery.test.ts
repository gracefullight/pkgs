import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getCurrentBranchName } from "@/validate-branch-name";

describe("git directory discovery", () => {
  let root: string;
  const originalCwd = process.cwd();

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "branch-discovery-"));
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(root, { recursive: true, force: true });
  });

  it("reads the branch from a repository subdirectory", async () => {
    const gitdir = join(root, ".git");
    const nested = join(root, "packages", "example", "src");
    mkdirSync(gitdir);
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(gitdir, "HEAD"), "ref: refs/heads/feature/nested\n");
    process.chdir(nested);

    expect(await getCurrentBranchName()).toBe("feature/nested");
  });

  it("resolves a relative gitdir pointer against the worktree directory", async () => {
    const gitdir = join(root, "metadata");
    const worktree = join(root, "worktree");
    const nested = join(worktree, "src");
    mkdirSync(gitdir);
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(gitdir, "HEAD"), "ref: refs/heads/feature/worktree\n");
    writeFileSync(join(worktree, ".git"), "gitdir: ../metadata\n");
    process.chdir(nested);

    expect(await getCurrentBranchName()).toBe("feature/worktree");
  });
});
