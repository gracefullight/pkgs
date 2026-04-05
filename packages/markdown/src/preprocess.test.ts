import { describe, expect, it } from "vitest";
import { preprocessMarkdown } from "@/preprocess";

describe("preprocessMarkdown", () => {
  it("returns empty string for falsy input", () => {
    expect(preprocessMarkdown("")).toBe("");
  });

  // --- Step 1: Trim inner spaces ---

  it("trims leading spaces inside bold markers", () => {
    expect(
      preprocessMarkdown(
        "** 쇼핑몰 기본디자인 (base)**: 현재는 사용 중이지 않은 기본 디자인입니다.",
      ),
    ).toBe("**쇼핑몰 기본디자인 (base)**: 현재는 사용 중이지 않은 기본 디자인입니다.");
  });

  it("trims spaces inside short bold labels", () => {
    expect(preprocessMarkdown("** 적용 사항:**")).toBe("**적용 사항:**");
  });

  it("trims trailing spaces and preserves space after closing markers", () => {
    expect(preprocessMarkdown("**쇼핑몰 기본디자인 (base) **입니다")).toBe(
      "**쇼핑몰 기본디자인 (base)** 입니다",
    );
  });

  it("preserves trailing space between trimmed bold segments", () => {
    const input =
      "**단 한 줄도 수정되지 않았습니다. **시도했던 과정에서 코드에는**아무런 변화가 생기지 않았으니 안심하셔도 됩니다. **";
    const result = preprocessMarkdown(input);
    expect(result).toContain("**단 한 줄도 수정되지 않았습니다.** 시도했던");
    expect(result).toContain("**아무런 변화가 생기지 않았으니 안심하셔도 됩니다.**");
  });

  it("does not add trailing space when space already follows closing markers", () => {
    expect(preprocessMarkdown("**다른 디자인의 느낌을 바꿔볼까요? ** 원하시는 작업이 있다면")).toBe(
      "**다른 디자인의 느낌을 바꿔볼까요?** 원하시는 작업이 있다면",
    );
  });

  // --- Steps 2-3: Quote moving ---

  it("preserves single quotes inside bold when no Korean follows", () => {
    expect(preprocessMarkdown("**'text'**")).toBe("**'text'**");
  });

  it("preserves double quotes inside bold when no Korean follows", () => {
    expect(preprocessMarkdown('**"text"**')).toBe('**"text"**');
  });

  it("moves single quotes outside bold markers before Korean particles", () => {
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

  // --- Step 4: Space insertion for flanking fix ---

  it("inserts space after ** when closing punct is followed by Korean", () => {
    expect(preprocessMarkdown("**(text)**이며")).toBe("**(text)** 이며");
  });

  it("inserts space after ** when closing bracket is followed by Korean", () => {
    expect(preprocessMarkdown("관리자 페이지의 **[설정 > 일반]**에서 변경")).toBe(
      "관리자 페이지의 **[설정 > 일반]** 에서 변경",
    );
  });

  it("inserts space before ** when preceded by Korean and followed by bracket", () => {
    expect(preprocessMarkdown("관리자 화면에서**[디자인 관리 > 디자인 보관함]**에 있는 스킨")).toBe(
      "관리자 화면에서 **[디자인 관리 > 디자인 보관함]** 에 있는 스킨",
    );
  });

  it("inserts space after ** when closing paren is followed by Korean", () => {
    expect(
      preprocessMarkdown("**바꾸고 싶은 부분(색상, 레이아웃, 문구 등)**을 말씀해 주시면"),
    ).toBe("**바꾸고 싶은 부분(색상, 레이아웃, 문구 등)** 을 말씀해 주시면");
  });

  it("inserts space after ** when colon is followed by Korean", () => {
    expect(preprocessMarkdown("**주의:**사항을 확인하세요")).toBe("**주의:** 사항을 확인하세요");
  });

  it("inserts space after ** when colon is followed by digit", () => {
    expect(preprocessMarkdown("**보강된 주요 속성:**1. 할인 효과 적용")).toBe(
      "**보강된 주요 속성:** 1. 할인 효과 적용",
    );
  });

  it("inserts spaces on both sides when preceded by Korean and followed by Korean with punct", () => {
    expect(preprocessMarkdown("결제에서**(할인 적용)**을 확인")).toBe(
      "결제에서 **(할인 적용)** 을 확인",
    );
  });

  // --- No unnecessary changes ---

  it("does not modify bold text followed by Korean without punct boundary", () => {
    expect(preprocessMarkdown("**볼드텍스트**입니다")).toBe("**볼드텍스트**입니다");
  });

  it("does not modify bold text with Korean verb endings", () => {
    expect(
      preprocessMarkdown("**앱 권한을 다시 승인**해 주시거나, **앱을 재설치**해 주셔야 합니다."),
    ).toBe("**앱 권한을 다시 승인**해 주시거나, **앱을 재설치**해 주셔야 합니다.");
  });

  it("does not modify normal bold text followed by space", () => {
    expect(preprocessMarkdown("This is **bold** text.")).toBe("This is **bold** text.");
  });

  it("does not modify bold followed by punctuation", () => {
    expect(preprocessMarkdown("**중요합니다.** 다음 항목을 확인하세요")).toBe(
      "**중요합니다.** 다음 항목을 확인하세요",
    );
  });

  // --- Step 5: Tilde escaping ---

  it("escapes tildes to prevent strikethrough", () => {
    expect(preprocessMarkdown("~strikethrough~")).toBe("\\~strikethrough\\~");
  });

  // --- Mixed content ---

  it("handles mixed bold and quoted content", () => {
    const input = "This is **'bold'** and this is **(parenthesis)**입니다.";
    const expected = "This is **'bold'** and this is **(parenthesis)** 입니다.";
    expect(preprocessMarkdown(input)).toBe(expected);
  });
});
