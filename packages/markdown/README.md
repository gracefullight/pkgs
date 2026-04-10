# @gracefullight/markdown

Markdown preprocessing utilities for Korean (CJK) text authoring.

Fixes common issues around malformed bold markers and accidental strikethrough while preserving natural Korean rendering in `react-markdown`.

## Install

```bash
npm install @gracefullight/markdown
# or
yarn add @gracefullight/markdown
# or
bun add @gracefullight/markdown
```

## Usage

```ts
import { analyzeMarkdown, preprocessMarkdown } from "@gracefullight/markdown";

const raw = "** 쇼핑몰 기본디자인 (base)**: 현재는 사용 중이지 않은 기본 디자인입니다.";
const fixed = preprocessMarkdown(raw);
// => "**쇼핑몰 기본디자인 (base)**: 현재는 사용 중이지 않은 기본 디자인입니다."

const report = analyzeMarkdown("문장. , 다음 [[1]] 안내입니다.");
// => { passed: false, issues: [...], metrics: { punctuationIssueCount: 1, doubleBracketCount: 1, ... } }
```

## What it fixes

| Before | After |
|--------|-------|
| `** text **` | `**text**` |
| `**'상품명'**에` | `'**상품명**'에` |
| `**"상품명"**에` | `"**상품명**"에` |
| `문장. , 다음` | `문장. 다음` |
| `[[1]]` | `[1]` |
| `~text~` | `\~text\~` |

Code fences and inline code are preserved as-is. The package also exposes `analyzeMarkdown()` for reporting punctuation noise, double brackets, bold density, and Korean character ratio before applying fixes.

## License

MIT
