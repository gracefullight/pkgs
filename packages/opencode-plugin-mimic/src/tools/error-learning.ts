import { tool } from "@opencode-ai/plugin";
import { z } from "zod";
import { suggestFixes } from "@/modules/learning/error-patterns";
import type { ToolFactory } from "@/tools/registry";

export const createErrorLearningTools: ToolFactory = (ctx) => {
  const { stateManager, directory, i18n, i18nPromise } = ctx;

  return {
    "mimic-error-suggest": tool({
      description: i18n.t("tool.error_suggest.description"),
      args: {
        error: z.string().describe("The error message to find fixes for"),
      },
      async execute({ error }) {
        const i18n = await i18nPromise;
        const mimicCtx = { stateManager, directory, i18n, client: null as never };

        const fixes = await suggestFixes(mimicCtx, error);

        if (fixes.length === 0) {
          return i18n.t("error.no_patterns");
        }

        const lines = [i18n.t("error.suggest_title")];
        for (const fix of fixes) {
          lines.push("");
          lines.push(`**${fix.description}**`);
          lines.push(
            i18n.t("error.fix_confidence", { confidence: Math.round(fix.confidence * 100) }),
          );
          if (fix.toolSequence.length > 0) {
            lines.push(i18n.t("error.tools_used", { tools: fix.toolSequence.join(" → ") }));
          }
          if (fix.filesChanged.length > 0) {
            lines.push(i18n.t("error.files_changed", { files: fix.filesChanged.join(", ") }));
          }
        }

        return lines.join("\n");
      },
    }),

    "mimic-error-patterns": tool({
      description: i18n.t("tool.error_patterns.description"),
      args: {
        errorType: z
          .string()
          .optional()
          .describe("Filter by error type (compile, runtime, lint, test)"),
      },
      async execute({ errorType }) {
        const i18n = await i18nPromise;
        const patterns = await stateManager.listErrorPatterns();

        if (patterns.length === 0) {
          return i18n.t("error.no_patterns");
        }

        const filtered = errorType ? patterns.filter((p) => p.errorType === errorType) : patterns;

        const lines = [i18n.t("error.patterns_title", { count: filtered.length })];
        for (const pattern of filtered.slice(0, 10)) {
          lines.push("");
          lines.push(`**[${pattern.errorType}]** ${pattern.errorSignature}`);
          lines.push(`- Occurrences: ${pattern.occurrences}`);
          lines.push(`- Fixes learned: ${pattern.fixes.length}`);
          lines.push(`- Last seen: ${pattern.lastSeen}`);
        }

        return lines.join("\n");
      },
    }),
  };
};
