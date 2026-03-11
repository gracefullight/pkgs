# @gracefullight/markdown

Markdown preprocessing utilities for Korean (CJK) text rendering.

Fixes common issues where `react-markdown` (or similar parsers) fails to parse bold syntax when followed immediately by Korean characters.

## Install

```bash
npm install @gracefullight/markdown
```

## Usage

```ts
import { preprocessMarkdown } from "@gracefullight/markdown";

const raw = "**[설정]**에서 변경할 수 있습니다.";
const fixed = preprocessMarkdown(raw);
// => "**[설정]** 에서 변경할 수 있습니다."
```

## What it fixes

| Before | After |
|--------|-------|
| `**'text'**` | `'**text**'` |
| `**"text"**` | `"**text**"` |
| `**text**에서` | `**text** 에서` |
| `~text~` | `\~text\~` |

## License

MIT
