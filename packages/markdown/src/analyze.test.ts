import { describe, expect, it } from "vitest";
import { analyzeMarkdown } from "@/preprocess";

describe("analyzeMarkdown", () => {
  it("detects punctuation noise and double brackets", () => {
    const report = analyzeMarkdown("문장. , 다음 [[1]] 안내입니다.");

    expect(report.passed).toBe(false);
    expect(report.metrics.punctuationIssueCount).toBe(1);
    expect(report.metrics.doubleBracketCount).toBe(1);
    expect(report.issues.some((issue) => issue.rule === "punctuation-noise")).toBe(true);
    expect(report.issues.some((issue) => issue.rule === "double-bracket")).toBe(true);
  });

  it("detects excessive bold density", () => {
    const words = Array.from({ length: 50 }, (_, i) => `word${i}`).join(" ");
    const report = analyzeMarkdown(`**bold1** ${words} **bold2** **bold3** **bold4**`);

    expect(report.passed).toBe(false);
    expect(report.metrics.boldSegmentCount).toBe(4);
    expect(report.metrics.excessiveBold).toBe(true);
    expect(report.issues.some((issue) => issue.rule === "excessive-bold")).toBe(true);
  });

  it("calculates korean ratio", () => {
    const report = analyzeMarkdown("한글 English 한글");
    expect(report.metrics.koreanRatio).toBeGreaterThan(0.2);
    expect(report.metrics.koreanRatio).toBeLessThan(0.8);
  });

  it("ignores protected code spans while analyzing", () => {
    const report = analyzeMarkdown("`bad. , [[1]]` 바깥 [[2]]");

    expect(report.metrics.punctuationIssueCount).toBe(0);
    expect(report.metrics.doubleBracketCount).toBe(1);
  });
});
