import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import { describe, expect, it } from "vitest";
import { preprocessMarkdown } from "@/preprocess";

function renderMarkdown(markdown: string): string {
  return renderToStaticMarkup(React.createElement(Markdown, null, markdown));
}

describe("preprocessMarkdown integration", () => {
  // --- Basic bold rendering ---

  it("renders bold Korean text with verb endings", () => {
    const input = "**앱 권한을 다시 승인**해 주시거나, **앱을 재설치**해 주셔야 합니다.";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>앱 권한을 다시 승인</strong>해 주시거나, <strong>앱을 재설치</strong>해 주셔야 합니다.</p>",
    );
  });

  it("renders bold text followed by Korean without punct boundary", () => {
    expect(renderMarkdown(preprocessMarkdown("**볼드텍스트**입니다"))).toBe(
      "<p><strong>볼드텍스트</strong>입니다</p>",
    );
  });

  // --- Quote handling ---

  it("renders quoted bold product names before Korean particles", () => {
    const input = "**'액티브핏 데일리 그린 파우더'**에 [BEST] 표시를 완료했습니다!";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p>&#x27;<strong>액티브핏 데일리 그린 파우더</strong>&#x27;에 [BEST] 표시를 완료했습니다!</p>",
    );
  });

  it("renders quoted bold text before punctuation", () => {
    const input = "**'상품명 변경'**: 상품 이름";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>&#x27;상품명 변경&#x27;</strong>: 상품 이름</p>",
    );
  });

  // --- Closing punct + Korean/digit (right-flanking fix) ---

  it("renders bold with closing paren before Korean", () => {
    const input = "**바꾸고 싶은 부분(색상, 레이아웃, 문구 등)**을 말씀해 주시면";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>바꾸고 싶은 부분(색상, 레이아웃, 문구 등)</strong> 을 말씀해 주시면</p>",
    );
  });

  it("renders bold with closing bracket before Korean", () => {
    const input = "관리자 페이지의 **[설정 > 일반]**에서 변경할 수 있습니다.";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p>관리자 페이지의 <strong>[설정 &gt; 일반]</strong> 에서 변경할 수 있습니다.</p>",
    );
  });

  it("renders bold with closing colon before Korean", () => {
    expect(renderMarkdown(preprocessMarkdown("**주의:**사항을 확인하세요"))).toBe(
      "<p><strong>주의:</strong> 사항을 확인하세요</p>",
    );
  });

  it("renders bold with closing colon before digit", () => {
    const input = "**보강된 주요 속성:**1. 할인 효과 적용";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>보강된 주요 속성:</strong> 1. 할인 효과 적용</p>",
    );
  });

  // --- Opening punct + Korean before (left-flanking fix) ---

  it("renders bold with brackets when preceded by Korean", () => {
    const input = "관리자 화면에서**[디자인 관리 > 디자인 보관함]**에 있는 스킨";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p>관리자 화면에서 <strong>[디자인 관리 &gt; 디자인 보관함]</strong> 에 있는 스킨</p>",
    );
  });

  it("renders bold with parens when preceded by Korean", () => {
    expect(renderMarkdown(preprocessMarkdown("결제에서**(할인 적용)**을 확인"))).toBe(
      "<p>결제에서 <strong>(할인 적용)</strong> 을 확인</p>",
    );
  });

  // --- Space trimming + flanking fix combined ---

  it("renders bold after trimming trailing space", () => {
    const input =
      "**다른 디자인의 스타일을 수정하거나, 현재 디자인의 느낌을 완전히 바꿔볼까요? ** 원하시는 작업이 있다면 말씀해 주세요!";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>다른 디자인의 스타일을 수정하거나, 현재 디자인의 느낌을 완전히 바꿔볼까요?</strong> 원하시는 작업이 있다면 말씀해 주세요!</p>",
    );
  });

  it("renders multiple broken bold segments with preserved spacing", () => {
    const input =
      "**단 한 줄도 수정되지 않았습니다. **시도했던 과정에서 코드에는**아무런 변화가 생기지 않았으니 안심하셔도 됩니다. **";
    const result = renderMarkdown(preprocessMarkdown(input));

    expect(result).toContain("<strong>단 한 줄도 수정되지 않았습니다.</strong>");
    expect(result).toContain("<strong>아무런 변화가 생기지 않았으니 안심하셔도 됩니다.</strong>");
  });

  it("renders bold with trimmed space and closing paren before Korean", () => {
    expect(renderMarkdown(preprocessMarkdown("**쇼핑몰 기본디자인 (base) **입니다"))).toBe(
      "<p><strong>쇼핑몰 기본디자인 (base)</strong> 입니다</p>",
    );
  });
});
