import { tool } from "@opencode-ai/plugin";
import { format } from "date-fns";
import { formatCapabilityType } from "@/lib/i18n";
import {
  evolveCapability,
  formatEvolutionResult,
  getEvolutionSuggestions,
} from "@/modules/evolution/engine";
import { groupByDomain } from "@/modules/knowledge/instincts";
import type { ToolFactory } from "@/tools/registry";
import type { Domain, Instinct } from "@/types";

/**
 * Evolution tools: evolve, capabilities
 */
export const createEvolutionTools: ToolFactory = (ctx) => {
  const { stateManager, directory, i18n, i18nPromise } = ctx;

  return {
    "mimic-evolve": tool({
      description: i18n.t("tool.evolve.description"),
      args: {
        accept: tool.schema.string().optional().describe(i18n.t("tool.evolve.args.accept")),
      },
      async execute(args) {
        const i18n = await i18nPromise;
        const innerCtx = { stateManager, directory, i18n };

        if (args.accept) {
          const suggestions = await getEvolutionSuggestions(innerCtx);
          const suggestion = suggestions.find((s) => s.pattern.id === args.accept);
          if (!suggestion) {
            return i18n.t("evolve.no_pattern", { id: args.accept });
          }
          const { capability, filePath } = await evolveCapability(innerCtx, suggestion);
          return `${i18n.t("evolve.absorbed_header")}\n\n${formatEvolutionResult(
            innerCtx,
            capability,
            filePath,
          )}`;
        }

        const suggestions = await getEvolutionSuggestions(innerCtx);
        const instincts = await stateManager.listInstincts();
        const domainMap = groupByDomain(instincts);

        if (suggestions.length === 0) {
          return i18n.t("evolve.empty");
        }

        let output = `${i18n.t("evolve.menu_title")}\n\n`;
        output += `${i18n.t("evolve.menu_intro")}\n\n`;

        const formatRelatedInstincts = (domain: Domain): string => {
          const related = domainMap.get(domain) || [];
          if (related.length === 0) return "";
          return related
            .slice(0, 3)
            .map((inst: Instinct) => `\`${inst.trigger}\``)
            .join(", ");
        };

        for (const s of suggestions) {
          output += `### ✨ ${s.name}\n`;
          output += `- **${i18n.t("evolve.menu_type")}**: ${formatCapabilityType(i18n, s.type)}\n`;
          output += `- **${i18n.t("evolve.menu_reason")}**: ${s.reason}\n`;
          output += `- **${i18n.t("evolve.menu_pattern_id")}**: \`${s.pattern.id}\`\n`;

          const relatedStr = formatRelatedInstincts(s.pattern.type as Domain);
          if (relatedStr) {
            output += `- **${i18n.t("evolve.menu_instincts")}**: ${relatedStr}\n`;
          }
          output += "\n";
        }

        output += `\n${i18n.t("evolve.menu_footer")}`;
        return output;
      },
    }),

    "mimic-capabilities": tool({
      description: i18n.t("tool.capabilities.description"),
      args: {},
      async execute() {
        const i18n = await i18nPromise;
        const state = await stateManager.read();

        if (state.evolution.capabilities.length === 0) {
          return i18n.t("capabilities.empty");
        }

        let output = `${i18n.t("capabilities.title")}\n\n`;
        output += `${i18n.t("capabilities.intro")}\n\n`;
        for (const cap of state.evolution.capabilities) {
          output += `### ✨ ${cap.name}\n`;
          output += `- **${i18n.t("capabilities.type")}**: ${formatCapabilityType(
            i18n,
            cap.type,
          )}\n`;
          output += `- **${i18n.t("capabilities.description")}**: ${cap.description}\n`;
          output += `- **${i18n.t("capabilities.consumed")}**: ${format(
            new Date(cap.createdAt),
            "yyyy-MM-dd",
          )}\n\n`;
        }
        return output;
      },
    }),

    "mimic-evolution-ready": tool({
      description: i18n.t("tool.evolution_ready.description"),
      args: {},
      async execute() {
        const i18n = await i18nPromise;
        const state = await stateManager.read();
        const instincts = await stateManager.listInstincts();
        const domainMap = groupByDomain(instincts);

        const pendingDomains = state.evolution.pendingSuggestions || [];
        if (pendingDomains.length === 0) {
          return i18n.t("evolution_ready.none");
        }

        let output = "";
        for (const domain of pendingDomains) {
          const domainInstincts = domainMap.get(domain as Domain) || [];
          output += `${i18n.t("evolve.domain_title")}\n\n`;
          output += `${i18n.t("evolve.domain_intro", { domain })}\n\n`;
          output += `${i18n.t("evolve.domain_instincts_header", { count: domainInstincts.length })}\n\n`;

          for (const inst of domainInstincts.slice(0, 10)) {
            const confidence = Math.round(inst.confidence * 100);
            output += `- **${inst.trigger}** (${confidence}% confidence)\n`;
            output += `  - Action: ${inst.action}\n`;
          }
          output += "\n";
        }

        output += `*${i18n.t("evolution_ready.hint")}*`;
        return output;
      },
    }),
  };
};
