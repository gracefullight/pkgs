import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import { describe, expect, it } from "vitest";
import { preprocessMarkdown } from "@/preprocess";

function renderMarkdown(markdown: string): string {
  return renderToStaticMarkup(React.createElement(Markdown, null, markdown));
}

describe("preprocessMarkdown integration", () => {
  it("renders bold Korean text with verb endings as strong tags", () => {
    const input = "**앱 권한을 다시 승인**해 주시거나, **앱을 재설치**해 주셔야 합니다.";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>앱 권한을 다시 승인</strong>해 주시거나, <strong>앱을 재설치</strong>해 주셔야 합니다.</p>",
    );
  });

  it("renders quoted bold product names before Korean particles as strong tags", () => {
    const input = "**'액티브핏 데일리 그린 파우더'**에 [BEST] 표시를 완료했습니다!";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p>&#x27;<strong>액티브핏 데일리 그린 파우더</strong>&#x27;에 [BEST] 표시를 완료했습니다!</p>",
    );
  });

  it("keeps quoted bold text inside strong tags when punctuation follows", () => {
    const input = "**'상품명 변경'**: 상품 이름";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>&#x27;상품명 변경&#x27;</strong>: 상품 이름</p>",
    );
  });

  it("renders bold with trailing paren before Korean as strong tags", () => {
    const input = "**바꾸고 싶은 부분(색상, 레이아웃, 문구 등)**을 말씀해 주시면";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>바꾸고 싶은 부분(색상, 레이아웃, 문구 등</strong>)을 말씀해 주시면</p>",
    );
  });

  it("renders bold with trailing bracket before Korean as strong tags", () => {
    const input = "관리자 페이지의 **[설정 > 일반]**에서 변경할 수 있습니다.";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p>관리자 페이지의 <strong>[설정 &gt; 일반</strong>]에서 변경할 수 있습니다.</p>",
    );
  });

  it("renders bold with trailing colon before Korean as strong tags", () => {
    const input = "**주의:**사항을 확인하세요";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>주의</strong>:사항을 확인하세요</p>",
    );
  });

  it("renders bold with space-trimmed trailing paren before Korean as strong tags", () => {
    const input =
      "**다른 디자인의 스타일을 수정하거나, 현재 디자인의 느낌을 완전히 바꿔볼까요? ** 원하시는 작업이 있다면 말씀해 주세요!";

    expect(renderMarkdown(preprocessMarkdown(input))).toBe(
      "<p><strong>다른 디자인의 스타일을 수정하거나, 현재 디자인의 느낌을 완전히 바꿔볼까요?</strong> 원하시는 작업이 있다면 말씀해 주세요!</p>",
    );
  });
});
