import { describe, expect, it } from "vitest";
import { preprocessMarkdown } from "@/preprocess";

describe("preprocessMarkdown enhancements", () => {
  it("fixes punctuation noise outside protected segments", () => {
    expect(preprocessMarkdown("첫 문장. , 다음 문장,, 그리고 마침표. . 끝")).toBe(
      "첫 문장. 다음 문장, 그리고 마침표. 끝",
    );
  });

  it("normalizes double brackets outside protected segments", () => {
    expect(preprocessMarkdown("참고 [[1]] 및 [[부록]]을 확인하세요.")).toBe(
      "참고 [1] 및 [부록]을 확인하세요.",
    );
  });

  it("reduces excessive bold density", () => {
    const words = Array.from({ length: 50 }, (_, i) => `word${i}`).join(" ");
    const result = preprocessMarkdown(`**bold1** ${words} **bold2** **bold3** **bold4**`);
    const boldMatches = result.match(/\*\*[^*]+\*\*/g) ?? [];

    expect(boldMatches).toHaveLength(1);
    expect(result).toContain("bold2");
    expect(result).toContain("bold3");
    expect(result).toContain("bold4");
  });

  it("does not modify fenced code blocks", () => {
    const input = "```md\n[[1]]\n문장. , 다음\n~code~\n```";
    expect(preprocessMarkdown(input)).toBe(input);
  });

  it("does not modify inline code spans", () => {
    expect(preprocessMarkdown("`[[1]] . , ~x~` 바깥 [[2]]")).toBe("`[[1]] . , ~x~` 바깥 [2]");
  });
});
