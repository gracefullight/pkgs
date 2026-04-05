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
});
