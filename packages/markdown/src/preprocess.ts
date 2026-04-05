/**
 * Preprocess markdown content to fix rendering issues with Korean text.
 * Version 0.3.0
 *
 * Handles:
 * 1. Trim invalid inner spaces around bold text: `** text **` → `**text**` (preserves trailing space)
 * 2. Move quoted bold text outside markers when followed by Korean: `**'text'**에` → `'**text**'에`
 * 3. Move double-quoted bold text outside markers when followed by Korean: `**"text"**에` → `"**text**"에`
 * 4. Convert `**...**` to `<strong>` when CommonMark flanking rules fail
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

  // 4. Convert **...** to <strong>...</strong> when CommonMark flanking rules prevent bold rendering
  // Left-flanking fails when: word char before opening ** AND punct char after opening **
  // Right-flanking fails when: punct char before closing ** AND word char after closing **
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
        return `<strong>${inner}</strong>`;
      }
      return match;
    },
  );

  // 5. Escape tildes to prevent accidental strikethrough
  processed = processed.replace(/~/g, "\\~");

  return processed;
}
