#!/usr/bin/env node

import { Command, Option } from "commander";
import chalk from "chalk";
import { getCurrentBranchName, validateWithDetails } from "./validate-branch-name";
import { loadConfig, type Config } from "./load-config";

const SUCCESS_CODE = 0;
const FAILED_CODE = 1;

const program = new Command();

program
  .name("validate-branch")
  .description("Git branch name validation tool")
  .version("0.1.0", "-v, --version");

program.addOption(
  new Option("-t, --test <branch>", "Test target branch name (uses current branch by default)"),
);

program.addOption(
  new Option("-r, --regexp <regexp>", "Custom regular expression to test branch name"),
);

program.addOption(
  new Option("-p, --preset <preset>", "Use preset pattern (gitflow or jira)").choices([
    "gitflow",
    "jira",
  ]),
);

async function main() {
  program.parse(process.argv);

  const options = program.opts<{
    test?: string;
    regexp?: string;
    preset?: "gitflow" | "jira";
  }>();
  const branch = options.test || (await getCurrentBranchName());

  if (!branch) {
    console.error(chalk.red.bold("Error: Not a git repository\n"));
    process.exit(FAILED_CODE);
  }

  const config = await loadConfig();
  const customRegexp = options.regexp || config?.pattern;
  const preset = options.preset || config?.preset || "gitflow";

  console.log(chalk.cyan.bold(`\nValidating branch: ${chalk.yellow(branch)}\n`));
  console.log(chalk.gray(`Preset: ${preset}\n`));

  if (config?.description) {
    console.log(chalk.gray(`Config: ${config.description}\n`));
  }

  try {
    const result = validateWithDetails(branch, { customRegexp, preset });

    if (result.valid) {
      console.log(chalk.green.bold("✓ Valid branch name\n"));
      process.exit(SUCCESS_CODE);
    } else {
      console.error(chalk.red.bold("✗ Invalid branch name\n"));
      console.error(chalk.yellow(result.error));
      process.exit(FAILED_CODE);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(chalk.red.bold(`\nError: ${errorMessage}\n`));
    process.exit(FAILED_CODE);
  }
}

main();
