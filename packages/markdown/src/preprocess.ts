/**
 * Preprocess markdown content to fix rendering issues with Korean text.
 * Version 0.3.0
 *
 * Handles:
 * 1. Trim invalid inner spaces around bold text: `** text **` → `**text**` (preserves trailing space)
 * 2. Move quoted bold text outside markers when followed by Korean: `**'text'**에` → `'**text**'에`
 * 3. Move double-quoted bold text outside markers when followed by Korean: `**"text"**에` → `"**text**"에`
 * 4. Insert spaces around `**` when CommonMark flanking rules would fail
 * 5. Tilde escaping to prevent accidental strikethrough: `~` → `\~`
 */
export function preprocessMarkdown(content: string): string {
  if (!content) return "";

  const isWord = /[^\s\p{P}\p{S}]/u;
  const isPunct = /[\p{P}\p{S}]/u;

  // 1. Trim invalid inner spaces around bold markers, preserving trailing space after **
  // ** text ** -> **text**
  // **text. **next -> **text.** next (trailing space preserved)
  let processed = content.replace(
    /\*\*([^*]+?)\*\*(\S)?/g,
    (match, inner: string, after: string | undefined) => {
      const trimmed = inner.trim();
      if (!trimmed || trimmed === inner) return match;
      const trailingSpace = inner !== inner.trimEnd() && after ? " " : "";
      return `**${trimmed}**${trailingSpace}${after ?? ""}`;
    },
  );

  // 2. Move single quotes outside of bold markers when followed by Korean text
  // **'text'**에 -> '**text**'에
  processed = processed.replace(/\*\*'(.+?)'\*\*(?=[가-힣])/g, "'**$1**'");

  // 3. Move double quotes outside of bold markers when followed by Korean text
  // **"text"**에 -> "**text**"에
  processed = processed.replace(/\*\*"([^"]+)"\*\*(?=[가-힣])/g, '"**$1**"');

  // 4. Insert spaces around ** when CommonMark flanking rules would fail
  // Left-flanking fails: word char before ** + punct after → insert space before **
  // Right-flanking fails: punct before ** + word char after → insert space after **
  // Korean**[text]**Korean → Korean **[text]** Korean
  processed = processed.replace(
    /\*\*([^*]+?)\*\*/g,
    (match, inner: string, offset: number, str: string) => {
      const before = offset > 0 ? str[offset - 1] : "";
      const afterIdx = offset + match.length;
      const after = afterIdx < str.length ? str[afterIdx] : "";

      const leftFails = before !== "" && isWord.test(before) && isPunct.test(inner[0]);
      const rightFails =
        isPunct.test(inner[inner.length - 1]) && after !== "" && isWord.test(after);

      if (leftFails || rightFails) {
        const prefix = leftFails ? " " : "";
        const suffix = rightFails ? " " : "";
        return `${prefix}**${inner}**${suffix}`;
      }
      return match;
    },
  );

  // 5. Escape tildes to prevent accidental strikethrough
  processed = processed.replace(/~/g, "\\~");

  return processed;
}
