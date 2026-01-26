// Tool Registry
export { createAutomationTools, getMacroRecording, recordMacroStep } from "./automation";

// Tool Factories
export { createCoreTools } from "./core";
export { createErrorLearningTools } from "./error-learning";
export { createEvolutionTools } from "./evolution";
export { createGitTools } from "./git";
export { createInstinctTools } from "./instincts";
export { createTools } from "./main";
export { createMcpTools } from "./mcp";
export { createObservationTools } from "./observation";
export { type ToolFactory, type ToolFactoryContext, ToolRegistry, toolRegistry } from "./registry";
export { createSettingsTools } from "./settings";
