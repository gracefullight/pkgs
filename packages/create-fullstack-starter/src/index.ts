import { execSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { platform } from "node:os";
import path from "node:path";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import tiged from "tiged";

const TEMPLATE_REPO = "first-fluke/fullstack-starter";

function isGhInstalled(): boolean {
  try {
    execSync("gh --version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function isGhAuthenticated(): boolean {
  try {
    execSync("gh auth status", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function isAlreadyStarred(): boolean {
  try {
    execSync(`gh api user/starred/${TEMPLATE_REPO}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function getGhInstallCommand(): string {
  const os = platform();
  if (os === "darwin") return "brew install gh";
  if (os === "win32") return "winget install GitHub.cli";
  return "sudo apt install gh";
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

export function validateTargetDirectory(targetDir: string, resolvedPath: string): string | null {
  const isCurrentDir = targetDir === ".";

  if (!existsSync(resolvedPath)) {
    return null;
  }

  const files = readdirSync(resolvedPath);

  if (files.includes(".git")) {
    return `Directory "${targetDir}" contains a .git folder. Remove it first or choose another directory.`;
  }

  const hasFiles = files.filter((f) => !f.startsWith(".")).length > 0;

  if (hasFiles && !isCurrentDir) {
    return `Directory "${targetDir}" is not empty.`;
  }

  return null;
}

function ensureTargetDirectoryIsAvailable(targetDir: string, resolvedPath: string): void {
  const error = validateTargetDirectory(targetDir, resolvedPath);
  if (error) {
    p.cancel(error);
    process.exit(1);
  }
}

async function ensureGhInstalled(): Promise<boolean> {
  if (isGhInstalled()) {
    return true;
  }

  const installCmd = getGhInstallCommand();
  const shouldInstall = await p.confirm({
    message: `GitHub CLI (gh) is not installed. Install with ${chalk.cyan(installCmd)}?`,
    initialValue: false,
  });

  if (p.isCancel(shouldInstall) || !shouldInstall) {
    return false;
  }

  const s = p.spinner();
  s.start("Installing GitHub CLI...");
  const result = spawnSync(installCmd, { shell: true, stdio: "pipe" });

  if (result.status !== 0) {
    s.stop("Installation failed.");
    return false;
  }

  s.stop("GitHub CLI installed!");
  return true;
}

async function ensureGhAuthenticated(): Promise<boolean> {
  if (isGhAuthenticated()) {
    return true;
  }

  const shouldAuth = await p.confirm({
    message: `GitHub CLI is not authenticated. Run ${chalk.cyan("gh auth login")}?`,
    initialValue: false,
  });

  if (p.isCancel(shouldAuth) || !shouldAuth) {
    return false;
  }

  spawnSync("gh", ["auth", "login"], { stdio: "inherit" });
  return isGhAuthenticated();
}

async function maybePromptToStarRepository(): Promise<void> {
  if (!(await ensureGhInstalled()) || !(await ensureGhAuthenticated())) {
    return;
  }

  if (isAlreadyStarred()) {
    return;
  }

  const shouldStar = await p.confirm({
    message: `Would you like to star ${chalk.cyan(TEMPLATE_REPO)} on GitHub?`,
    initialValue: true,
  });

  if (p.isCancel(shouldStar) || !shouldStar) {
    return;
  }

  try {
    execSync(`gh api -X PUT /user/starred/${TEMPLATE_REPO}`, { stdio: "pipe" });
    p.log.message(chalk.yellow("Thanks for starring! ⭐"));
  } catch {
    p.log.warning("Failed to star the repository.");
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
