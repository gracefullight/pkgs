import { describe, expect, it } from "vitest";
import { analyzeMarkdown, preprocessMarkdown } from "@/preprocess";

describe("Markdown structure preservation", () => {
  it("preserves list indentation and hard line breaks", () => {
    const input = "- parent  \n    - child  \n      continuation\n";
    expect(preprocessMarkdown(input)).toBe(input);
  });

  it("preserves tilde fenced code blocks", () => {
    const input = "~~~md\n[[1]] 문장. , ~code~\n~~~";
    expect(preprocessMarkdown(input)).toBe(input);
    expect(analyzeMarkdown(input).passed).toBe(true);
  });

  it("preserves code spans containing a single backtick", () => {
    const input = "``code ` [[1]] ~code~``";
    expect(preprocessMarkdown(input)).toBe(input);
    expect(analyzeMarkdown(input).passed).toBe(true);
  });

  it("preserves longer fences containing a shorter fence", () => {
    const input = "````md\n```\n[[1]] ~code~\n```\n````";
    expect(preprocessMarkdown(input)).toBe(input);
  });

  it("does not add escapes to already escaped tildes", () => {
    const once = preprocessMarkdown("~text~");
    expect(preprocessMarkdown(once)).toBe(once);
  });

  it("excludes protected code from the prose bold density limit", () => {
    const code = `${"word ".repeat(100)}**a** **b** **c** **d**`;
    const input = `~~~md\n${code}\n~~~\n**first** **second**`;
    expect(analyzeMarkdown(input).passed).toBe(true);
    expect(preprocessMarkdown(input)).toBe(input);
  });
});
