import { describe, expect, it } from "vitest";
import { preprocessMarkdown } from "@/preprocess";

describe("preprocessMarkdown", () => {
  it("returns empty string for falsy input", () => {
    expect(preprocessMarkdown("")).toBe("");
  });

  it("preserves single quotes inside bold markers when no Korean follows", () => {
    expect(preprocessMarkdown("**'text'**")).toBe("**'text'**");
  });

  it("preserves double quotes inside bold markers when no Korean follows", () => {
    expect(preprocessMarkdown('**"text"**')).toBe('**"text"**');
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
      "**쇼핑몰 기본디자인 (base**)입니다",
    );
  });

  it("moves closing paren outside bold markers when followed by Korean", () => {
    expect(preprocessMarkdown("**(text)**이며")).toBe("**(text**)이며");
  });

  it("moves closing bracket outside bold markers when followed by Korean", () => {
    const input = "관리자 페이지의 **[설정 > 일반]**에서 변경할 수 있습니다.";
    const expected = "관리자 페이지의 **[설정 > 일반**]에서 변경할 수 있습니다.";
    expect(preprocessMarkdown(input)).toBe(expected);
  });

  it("moves trailing punctuation outside bold markers when followed by Korean", () => {
    expect(
      preprocessMarkdown("**바꾸고 싶은 부분(색상, 레이아웃, 문구 등)**을 말씀해 주시면"),
    ).toBe("**바꾸고 싶은 부분(색상, 레이아웃, 문구 등**)을 말씀해 주시면");
  });

  it("moves colon outside bold markers when followed by Korean", () => {
    expect(preprocessMarkdown("**주의:**사항을 확인하세요")).toBe("**주의**:사항을 확인하세요");
  });

  it("does not add space after any bold text followed by Korean", () => {
    expect(preprocessMarkdown("**볼드텍스트**입니다")).toBe("**볼드텍스트**입니다");
  });

  it("preserves natural spacing for Korean verb endings after bold text", () => {
    expect(
      preprocessMarkdown("**앱 권한을 다시 승인**해 주시거나, **앱을 재설치**해 주셔야 합니다."),
    ).toBe("**앱 권한을 다시 승인**해 주시거나, **앱을 재설치**해 주셔야 합니다.");
  });

  it("preserves quoted bold product names before Korean particles", () => {
    expect(preprocessMarkdown("**'액티브핏 데일리 그린 파우더'**에 [BEST] 표시")).toBe(
      "'**액티브핏 데일리 그린 파우더**'에 [BEST] 표시",
    );
  });

  it("moves double quotes outside bold markers before Korean particles", () => {
    expect(preprocessMarkdown('**"상품명"**에 표시')).toBe('"**상품명**"에 표시');
  });

  it("preserves quoted bold text before punctuation", () => {
    expect(preprocessMarkdown("**'상품명 변경'**: 상품 이름")).toBe("**'상품명 변경'**: 상품 이름");
  });

  it("escapes tildes to prevent strikethrough", () => {
    expect(preprocessMarkdown("~strikethrough~")).toBe("\\~strikethrough\\~");
  });

  it("does not affect normal bold text followed by space", () => {
    expect(preprocessMarkdown("This is **bold** text.")).toBe("This is **bold** text.");
  });

  it("handles mixed content correctly", () => {
    const input = "This is **'bold'** and this is **(parenthesis)**입니다.";
    const expected = "This is **'bold'** and this is **(parenthesis**)입니다.";
    expect(preprocessMarkdown(input)).toBe(expected);
  });
});
