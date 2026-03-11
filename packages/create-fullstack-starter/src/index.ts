import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import tiged from "tiged";

const TEMPLATE_REPO = "first-fluke/fullstack-starter";

async function isGhCliAvailable(): Promise<boolean> {
  try {
    execSync("gh auth status", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

async function isAlreadyStarred(): Promise<boolean> {
  try {
    execSync(`gh api user/starred/${TEMPLATE_REPO}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

async function promptForStar(): Promise<boolean> {
  const result = await p.confirm({
    message:
      "If you're enjoying fullstack-starter, would you like to support the project by starring it on GitHub?",
    initialValue: true,
  });

  if (p.isCancel(result)) {
    return false;
  }

  return result === true;
}

async function starRepository(): Promise<boolean> {
  try {
    execSync(`gh api -X PUT /user/starred/${TEMPLATE_REPO}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

async function resolveTargetDirectory(directory?: string): Promise<string> {
  if (directory) {
    return directory;
  }

  const result = await p.text({
    message: "Project directory:",
    placeholder: ".",
    validate: (value) => {
      if (!value.trim()) {
        return "Directory name cannot be empty";
      }
    },
  });

  if (p.isCancel(result)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return result || ".";
}

function ensureTargetDirectoryIsAvailable(targetDir: string, resolvedPath: string): void {
  const isCurrentDir = targetDir === ".";

  if (!existsSync(resolvedPath)) {
    return;
  }

  const files = readdirSync(resolvedPath);
  const hasFiles = files.filter((f) => !f.startsWith(".")).length > 0;

  if (hasFiles && !isCurrentDir) {
    p.cancel(`Directory "${targetDir}" is not empty.`);
    process.exit(1);
  }
}

async function maybePromptToStarRepository(): Promise<void> {
  if (!(await isGhCliAvailable())) {
    return;
  }

  if (await isAlreadyStarred()) {
    return;
  }

  if (!(await promptForStar())) {
    return;
  }

  if (await starRepository()) {
    p.log.message(chalk.yellow("Thanks for starring! ⭐"));
  }
}

function showNextSteps(targetDir: string, isCurrentDir: boolean): void {
  p.note(
    [
      !isCurrentDir && chalk.cyan(`cd ${targetDir}`),
      chalk.cyan("mise install        # Install runtimes"),
      chalk.cyan("mise run install    # Install dependencies"),
      chalk.cyan("mise infra:up       # Start local infrastructure"),
      chalk.cyan("mise dev            # Start development servers"),
    ]
      .filter(Boolean)
      .join("\n"),
    "Next steps",
  );
}

const program = new Command();

program
  .name("create-fullstack-starter")
  .description("Scaffold a fullstack-starter template from GitHub")
  .version("0.1.0", "-v, --version")
  .argument("[directory]", "Target directory for the project")
  .action(async (directory?: string) => {
    await main(directory);
  });

async function main(directory?: string) {
  p.intro(chalk.cyan.bold("Fullstack Starter - Production-ready fullstack monorepo template"));

  const targetDir = await resolveTargetDirectory(directory);

  const resolvedPath = path.resolve(process.cwd(), targetDir);
  const isCurrentDir = targetDir === ".";

  ensureTargetDirectoryIsAvailable(targetDir, resolvedPath);

  const s = p.spinner();
  s.start(`Cloning template from ${TEMPLATE_REPO}...`);

  try {
    const emitter = tiged(TEMPLATE_REPO, {
      disableCache: true,
      force: isCurrentDir,
      verbose: false,
    });

    await emitter.clone(resolvedPath);
    s.stop("Template cloned successfully!");

    await maybePromptToStarRepository();
    showNextSteps(targetDir, isCurrentDir);

    p.log.info(chalk.gray("Documentation: https://github.com/first-fluke/fullstack-starter"));

    p.outro(chalk.green.bold("Your project is ready!"));
  } catch (error) {
    s.stop("Failed to clone template.");
    const message = error instanceof Error ? error.message : "Unknown error";
    p.cancel(message);
    process.exit(1);
  }
}

program.parse();
