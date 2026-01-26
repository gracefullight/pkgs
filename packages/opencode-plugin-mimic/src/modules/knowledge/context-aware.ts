import type { MimicContext } from "@/core/context";
import type { Domain, Instinct } from "@/types";

export interface CurrentContext {
  currentFile?: string;
  currentBranch?: string;
  recentTools: string[];
  recentFiles: string[];
}

/**
 * Infer domain from file path.
 * Matches patterns like **\/test/**, **\/*.test.*, **\/docs/**, **.config.*, **\/git/**
 */
export function inferDomainFromPath(filePath: string): Domain | null {
  const lowerPath = filePath.toLowerCase();

  if (
    lowerPath.includes("/test/") ||
    lowerPath.includes("/__tests__/") ||
    /\.(test|spec)\.[jt]sx?$/.test(lowerPath) ||
    /\.(test|spec)\.ts$/.test(lowerPath)
  ) {
    return "testing";
  }

  if (lowerPath.includes("/docs/") || lowerPath.includes("/documentation/")) {
    return "documentation";
  }

  if (
    /\.config\.[jt]s$/.test(lowerPath) ||
    /\.config\.json$/.test(lowerPath) ||
    lowerPath.endsWith(".config.ts") ||
    lowerPath.endsWith(".config.js") ||
    lowerPath.endsWith(".config.mjs")
  ) {
    return "tooling";
  }

  if (lowerPath.includes("/.git/") || lowerPath.includes("/git/")) {
    return "git";
  }

  if (
    lowerPath.endsWith(".md") ||
    lowerPath.endsWith("readme") ||
    lowerPath.includes("readme")
  ) {
    return "documentation";
  }

  if (
    lowerPath.includes("/styles/") ||
    lowerPath.includes("/css/") ||
    lowerPath.endsWith(".css") ||
    lowerPath.endsWith(".scss")
  ) {
    return "code-style";
  }

  return null;
}

/**
 * Infer domain from branch name.
 * - feature/test-* -> testing
 * - fix/* -> debugging
 * - docs/* -> documentation
 * - refactor/* -> refactoring
 */
export function inferDomainFromBranch(branch: string): Domain | null {
  const lowerBranch = branch.toLowerCase();

  if (
    lowerBranch.startsWith("feature/test") ||
    lowerBranch.startsWith("test/") ||
    lowerBranch.includes("/test-")
  ) {
    return "testing";
  }

  if (lowerBranch.startsWith("fix/") || lowerBranch.startsWith("bugfix/") || lowerBranch.startsWith("hotfix/")) {
    return "debugging";
  }

  if (lowerBranch.startsWith("docs/") || lowerBranch.startsWith("documentation/")) {
    return "documentation";
  }

  if (lowerBranch.startsWith("refactor/") || lowerBranch.startsWith("refactoring/")) {
    return "refactoring";
  }

  if (lowerBranch.startsWith("chore/") || lowerBranch.startsWith("tooling/") || lowerBranch.startsWith("config/")) {
    return "tooling";
  }

  if (lowerBranch.startsWith("style/") || lowerBranch.startsWith("lint/")) {
    return "code-style";
  }

  return null;
}

/**
 * Get relevant instincts based on current context.
 * - Matches current file's domain
 * - Infers domain from branch name (feature/auth -> auth related)
 * - Matches tools recently used
 * - Returns sorted by confidence
 */
export async function getRelevantInstincts(
  ctx: MimicContext,
  context: CurrentContext,
): Promise<Instinct[]> {
  const instincts = await ctx.stateManager.listInstincts();
  const approvedInstincts = instincts.filter(
    (i) => i.status === "approved" && i.confidence >= 0.5,
  );

  if (approvedInstincts.length === 0) {
    return [];
  }

  const relevantDomains = new Set<Domain>();

  if (context.currentFile) {
    const fileDomain = inferDomainFromPath(context.currentFile);
    if (fileDomain) {
      relevantDomains.add(fileDomain);
    }
  }

  if (context.currentBranch) {
    const branchDomain = inferDomainFromBranch(context.currentBranch);
    if (branchDomain) {
      relevantDomains.add(branchDomain);
    }
  }

  for (const file of context.recentFiles) {
    const fileDomain = inferDomainFromPath(file);
    if (fileDomain) {
      relevantDomains.add(fileDomain);
    }
  }

  const toolDomains = inferDomainsFromTools(context.recentTools);
  for (const domain of toolDomains) {
    relevantDomains.add(domain);
  }

  if (relevantDomains.size === 0) {
    return approvedInstincts.slice(0, 5);
  }

  const relevant = approvedInstincts.filter((inst) => relevantDomains.has(inst.domain));

  return relevant.sort((a, b) => b.confidence - a.confidence);
}

function inferDomainsFromTools(tools: string[]): Domain[] {
  const domains: Domain[] = [];
  const toolsLower = tools.map((t) => t.toLowerCase());

  for (const tool of toolsLower) {
    if (tool.includes("test") || tool.includes("vitest") || tool.includes("jest")) {
      if (!domains.includes("testing")) domains.push("testing");
    }
    if (tool.includes("git") || tool.includes("commit") || tool.includes("branch")) {
      if (!domains.includes("git")) domains.push("git");
    }
    if (tool.includes("debug") || tool.includes("fix") || tool.includes("error")) {
      if (!domains.includes("debugging")) domains.push("debugging");
    }
    if (tool.includes("lint") || tool.includes("format") || tool.includes("prettier")) {
      if (!domains.includes("code-style")) domains.push("code-style");
    }
    if (tool.includes("doc") || tool.includes("readme") || tool.includes("markdown")) {
      if (!domains.includes("documentation")) domains.push("documentation");
    }
    if (tool.includes("refactor") || tool.includes("rename") || tool.includes("extract")) {
      if (!domains.includes("refactoring")) domains.push("refactoring");
    }
  }

  return domains;
}

export function formatContextSummary(
  context: CurrentContext,
  relevantInstincts: Instinct[],
  i18n: MimicContext["i18n"],
): string {
  const lines: string[] = [];

  lines.push(`## ${i18n.t("context.title")}`);
  lines.push("");

  if (context.currentFile) {
    lines.push(`**${i18n.t("context.current_file")}**: \`${context.currentFile}\``);
  }

  if (context.currentBranch) {
    lines.push(`**${i18n.t("context.current_branch")}**: \`${context.currentBranch}\``);
  }

  lines.push("");

  if (relevantInstincts.length > 0) {
    lines.push(`### ${i18n.t("context.relevant_instincts")}`);
    lines.push("");

    for (const inst of relevantInstincts.slice(0, 5)) {
      const bar =
        "●".repeat(Math.round(inst.confidence * 5)) +
        "○".repeat(5 - Math.round(inst.confidence * 5));
      const sourceTag = inst.source === "inherited" ? " 📥" : "";
      lines.push(`- [${bar}] **${inst.title}**${sourceTag} (${inst.domain})`);
      lines.push(`  ${inst.description}`);
    }
  } else {
    lines.push(i18n.t("context.no_relevant"));
  }

  return lines.join("\n");
}
