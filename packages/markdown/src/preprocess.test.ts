import { describe, expect, it } from "vitest";
import { preprocessMarkdown } from "@/preprocess";

describe("preprocessMarkdown", () => {
  it("returns empty string for falsy input", () => {
    expect(preprocessMarkdown("")).toBe("");
  });

  it("moves single quotes outside of bold markers", () => {
    expect(preprocessMarkdown("**'text'**")).toBe("'**text**'");
  });

  it("moves double quotes outside of bold markers", () => {
    expect(preprocessMarkdown('**"text"**')).toBe('"**text**"');
  });

  it("trims invalid spaces immediately inside bold markers", () => {
    expect(
      preprocessMarkdown(
        "** 쇼핑몰 기본디자인 (base)**: 현재는 사용 중이지 않은 기본 디자인입니다.",
      ),
    ).toBe("**쇼핑몰 기본디자인 (base)**: 현재는 사용 중이지 않은 기본 디자인입니다.");
  });

  it("trims invalid spaces inside short bold labels", () => {
    expect(preprocessMarkdown("** 적용 사항:**")).toBe("**적용 사항:**");
  });

  it("trims trailing spaces immediately before bold closing markers", () => {
    expect(preprocessMarkdown("**쇼핑몰 기본디자인 (base) **입니다")).toBe(
      "**쇼핑몰 기본디자인 (base)** 입니다",
    );
  });

  it("adds space between bold closing and Korean particle", () => {
    expect(preprocessMarkdown("**(text)**이며")).toBe("**(text)** 이며");
  });

  it("adds space after bold text ending with bracket if followed by Korean", () => {
    const input = "관리자 페이지의 **[설정 > 일반]**에서 변경할 수 있습니다.";
    const expected = "관리자 페이지의 **[설정 > 일반]** 에서 변경할 수 있습니다.";
    expect(preprocessMarkdown(input)).toBe(expected);
  });

  it("adds space after any bold text followed by Korean", () => {
    expect(preprocessMarkdown("**볼드텍스트**입니다")).toBe("**볼드텍스트** 입니다");
  });

  it("escapes tildes to prevent strikethrough", () => {
    expect(preprocessMarkdown("~strikethrough~")).toBe("\\~strikethrough\\~");
  });

  it("does not affect normal bold text followed by space", () => {
    expect(preprocessMarkdown("This is **bold** text.")).toBe("This is **bold** text.");
  });

  it("handles mixed content correctly", () => {
    const input = "This is **'bold'** and this is **(parenthesis)**입니다.";
    const expected = "This is '**bold**' and this is **(parenthesis)** 입니다.";
    expect(preprocessMarkdown(input)).toBe(expected);
  });
});
