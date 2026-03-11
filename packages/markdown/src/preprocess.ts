/**
 * Preprocess markdown content to fix rendering issues with Korean text.
 *
 * Handles:
 * 1. Bold markers wrapping quoted text: `**'text'**` → `'**text**'`
 * 2. Bold markers wrapping double-quoted text: `**"text"**` → `"**text**"`
 * 3. Bold closing `**` followed by Korean characters: `**text**에서` → `**text** 에서`
 * 4. Tilde escaping to prevent accidental strikethrough: `~` → `\~`
 */
export function preprocessMarkdown(content: string): string {
  if (!content) return "";

  // 1. Move single quotes outside of bold markers
  // **'text'** -> '**text**'
  let processed = content.replace(/\*\*'(.+?)'\*\*/g, "'**$1**'");

  // 2. Move double quotes outside of bold markers
  // **"text"** -> "**text**"
  processed = processed.replace(/\*\*"([^"]+)"\*\*/g, '"**$1**"');

  // 3. Handle cases where bold closing ** is followed by Korean character
  // **text**에서 -> **text** 에서
  processed = processed.replace(/(\*\*[^*]+?\*\*)(?=[가-힣])/g, "$1 ");

  // 4. Escape tildes to prevent accidental strikethrough
  processed = processed.replace(/~/g, "\\~");

  return processed;
}
