#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { loadConfig } from "@/load-config";
import { getCurrentBranchName, validateWithDetails } from "@/validate-branch-name";

const pkg = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../package.json"), "utf-8"),
) as { version: string };

const { values } = parseArgs({
  options: {
    test: { type: "string", short: "t" },
    regexp: { type: "string", short: "r" },
    preset: { type: "string", short: "p" },
    version: { type: "boolean", short: "v" },
    help: { type: "boolean", short: "h" },
  },
  strict: true,
});

if (values.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (values.help) {
  console.log(`Usage: validate-branch [options]

Options:
  -t, --test <branch>    Test this branch name instead of the current one
  -r, --regexp <regexp>  Custom regular expression
  -p, --preset <preset>  gitflow or jira
  -v, --version          Print the version
  -h, --help             Print this help`);
  process.exit(0);
}

const preset = values.preset === "jira" || values.preset === "gitflow" ? values.preset : undefined;
if (values.preset && !preset) {
  console.error("Error: --preset must be gitflow or jira\n");
  process.exit(1);
}

const branch = values.test || (await getCurrentBranchName());
if (!branch) {
  console.error("Error: Not a git repository\n");
  process.exit(1);
}

const config = await loadConfig();
const customRegexp = values.regexp || config?.pattern;
const selected = preset || config?.preset || "gitflow";

console.log(`\nValidating branch: ${branch}\n`);
console.log(`Preset: ${selected}\n`);
if (config?.description) console.log(`Config: ${config.description}\n`);

const examples = {
  gitflow: ["feature/login", "fix/bug-123", "hotfix/security", "release/v1.0.0"],
  jira: ["FEATURE-123", "BUG-456", "STORY-789", "TASK-101"],
} as const;

try {
  const result = validateWithDetails(branch, { customRegexp, preset: selected });
  if (result.valid) {
    console.log("✓ Valid branch name\n");
    process.exit(0);
  }
  console.error("✗ Invalid branch name\n");
  console.error(result.error);
  console.error("\nExamples of valid branch names:");
  for (const example of examples[selected]) console.error(`  • ${example}`);
  console.error();
  process.exit(1);
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  console.error(`\nError: ${errorMessage}\n`);
  process.exit(1);
}
