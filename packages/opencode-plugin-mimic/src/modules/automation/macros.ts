import type { I18n } from "@/lib/i18n";
import type { Macro, MacroRecording, MacroStep, ToolSequence } from "@/types";
import { generateId } from "@/utils/id";

export function startRecording(): MacroRecording {
  return {
    isRecording: true,
    startedAt: new Date().toISOString(),
    steps: [],
  };
}

export function stopRecording(recording: MacroRecording): MacroStep[] {
  recording.isRecording = false;
  return recording.steps;
}

export function recordStep(
  recording: MacroRecording,
  tool: string,
  args?: Record<string, unknown>,
): void {
  if (!recording.isRecording) return;

  recording.steps.push({
    tool,
    args,
    description: `${tool}${args ? ` with ${Object.keys(args).length} args` : ""}`,
  });
}

export function formatMacroForDisplay(macro: Macro, i18n: I18n): string {
  let output = `### 📼 ${macro.name}\n\n`;
  output += `**${i18n.t("macro.description")}**: ${macro.description}\n`;
  output += `**${i18n.t("macro.steps")}**: ${macro.toolSequence.length}\n`;
  output += `**${i18n.t("macro.use_count")}**: ${macro.useCount}\n`;

  if (macro.tags.length > 0) {
    output += `**${i18n.t("macro.tags")}**: ${macro.tags.join(", ")}\n`;
  }

  output += `\n**${i18n.t("macro.sequence")}**:\n`;
  for (let i = 0; i < macro.toolSequence.length; i++) {
    const step = macro.toolSequence[i];
    output += `${i + 1}. \`${step.tool}\``;
    if (step.description) {
      output += ` - ${step.description}`;
    }
    output += "\n";
  }

  return output;
}

export function suggestMacroFromSequence(
  sequence: ToolSequence,
  _i18n: I18n,
): { name: string; description: string } {
  const tools = sequence.tools;
  const firstTool = tools[0]?.replace(/^mimic-/, "") || "action";
  const lastTool = tools[tools.length - 1]?.replace(/^mimic-/, "") || "action";

  const name = `${firstTool}-to-${lastTool}`;
  const description = `Automated sequence: ${tools.join(" → ")} (used ${sequence.count}x)`;

  return { name, description };
}

export function createMacroFromSteps(
  name: string,
  description: string,
  steps: MacroStep[],
  tags: string[] = [],
): Macro {
  return {
    id: generateId(),
    name,
    description,
    toolSequence: steps,
    createdAt: new Date().toISOString(),
    lastUsed: null,
    useCount: 0,
    tags,
  };
}

export function createMacroFromSequence(
  sequence: ToolSequence,
  name?: string,
  description?: string,
): Macro {
  const steps: MacroStep[] = sequence.tools.map((tool) => ({
    tool,
    description: tool,
  }));

  return {
    id: generateId(),
    name: name || sequence.tools.join("-"),
    description: description || `Sequence used ${sequence.count} times`,
    toolSequence: steps,
    createdAt: new Date().toISOString(),
    lastUsed: null,
    useCount: 0,
    tags: [],
  };
}
