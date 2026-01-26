export interface Macro {
  id: string;
  name: string;
  description: string;
  toolSequence: MacroStep[];
  createdAt: string;
  lastUsed: string | null;
  useCount: number;
  tags: string[];
}

export interface MacroStep {
  tool: string;
  args?: Record<string, unknown>;
  description?: string;
}

export interface MacroRecording {
  isRecording: boolean;
  startedAt: string | null;
  steps: MacroStep[];
}
