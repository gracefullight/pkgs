/**
 * Preprocess markdown content to fix rendering issues with Korean text.
 * Version 0.2.0
 *
 * Handles:
 * 1. Trim invalid inner spaces around bold text: `** text **` → `**text**`
 * 2. Move quoted bold text outside markers when followed by Korean: `**'text'**에` → `'**text**'에`
 * 3. Move double-quoted bold text outside markers when followed by Korean: `**"text"**에` → `"**text**"에`
 * 4. Move trailing punctuation outside bold markers when followed by word char: `**text:**1` → `**text**:1`
 * 5. Tilde escaping to prevent accidental strikethrough: `~` → `\~`
 */
export function preprocessMarkdown(content: string): string {
  if (!content) return "";

  // 1. Trim invalid inner spaces around bold markers
  // ** text ** -> **text**
  let processed = content.replace(/\*\*([^*]+?)\*\*/g, (match, inner: string) => {
    const trimmed = inner.trim();
    return trimmed && trimmed !== inner ? `**${trimmed}**` : match;
  });

  // 2. Move single quotes outside of bold markers when followed by Korean text
  // **'text'**에 -> '**text**'에
  processed = processed.replace(/\*\*'(.+?)'\*\*(?=[가-힣])/g, "'**$1**'");

  // 3. Move double quotes outside of bold markers when followed by Korean text
  // **"text"**에 -> "**text**"에
  processed = processed.replace(/\*\*"([^"]+)"\*\*(?=[가-힣])/g, '"**$1**"');

  // 4. Move trailing punctuation outside bold markers when followed by word characters
  // Fixes CommonMark right-flanking delimiter: punct before closing ** + non-punct/non-space after = no bold
  // **text:**1. list → **text**:1. list | **text(등))**Korean → **text(등)**))Korean
  processed = processed.replace(/\*\*([^*]+?)([)\]:;,.!?]+)\*\*(?=[^\s\p{P}\p{S}])/gu, "**$1**$2");

  // 5. Escape tildes to prevent accidental strikethrough
  processed = processed.replace(/~/g, "\\~");

  return processed;
}
