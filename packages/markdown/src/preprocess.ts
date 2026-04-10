const PUNCTUATION_PATTERNS = [
  { pattern: ". ,", fix: ". ", description: "orphaned comma after period" },
  { pattern: ",,", fix: ",", description: "double comma" },
  { pattern: ". .", fix: ". ", description: "double period with space" },
  { pattern: ", .", fix: ". ", description: "comma before period" },
  { pattern: ": ,", fix: ": ", description: "orphaned comma after colon" },
  { pattern: "; ,", fix: "; ", description: "orphaned comma after semicolon" },
  { pattern: "? ,", fix: "? ", description: "orphaned comma after question mark" },
  { pattern: "! ,", fix: "! ", description: "orphaned comma after exclamation mark" },
] as const;

const PROTECTED_SEGMENT_REGEX = /```[\s\S]*?```|`[^`\n]+`/g;
const DOUBLE_BRACKET_REGEX = /\[\[([^[\]]+)\]\]/g;
const BOLD_PATTERN_REGEX = /\*\*[^*]+\*\*/g;
const DETAILS_BLOCK_REGEX = /<details[\s\S]*?<\/details>/gi;
const KOREAN_CHAR_REGEX = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g;
const MIN_WORDS_FOR_BOLD_REDUCTION = 40;
const MIN_BOLD_SEGMENTS_FOR_REDUCTION = 4;

export interface MarkdownPreprocessOptions {
  maxBoldPer100Words?: number;
}

export interface MarkdownIssue {
  rule: "punctuation-noise" | "double-bracket" | "excessive-bold";
  severity: "warning";
  message: string;
  samples?: string[];
}

export interface MarkdownAnalysisMetrics {
  punctuationIssueCount: number;
  doubleBracketCount: number;
  boldSegmentCount: number;
  wordCount: number;
  koreanRatio: number;
  excessiveBold: boolean;
}

export interface MarkdownAnalysisResult {
  passed: boolean;
  issues: MarkdownIssue[];
  metrics: MarkdownAnalysisMetrics;
}

interface Segment {
  protected: boolean;
  value: string;
}

function splitSegments(content: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(PROTECTED_SEGMENT_REGEX)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ protected: false, value: content.slice(lastIndex, index) });
    }

    segments.push({ protected: true, value: match[0] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ protected: false, value: content.slice(lastIndex) });
  }

  return segments;
}

function transformUnprotectedSegments(
  content: string,
  transform: (segment: string) => string,
): string {
  return splitSegments(content)
    .map((segment) => (segment.protected ? segment.value : transform(segment.value)))
    .join("");
}

function getUnprotectedContent(content: string): string {
  return splitSegments(content)
    .filter((segment) => !segment.protected)
    .map((segment) => segment.value)
    .join("");
}

function fixBoldSpacing(content: string): string {
  const isWord = /[^\s\p{P}\p{S}]/u;
  const isPunct = /[\p{P}\p{S}]/u;

  let processed = content.replace(
    /\*\*([^*]+?)\*\*(\S)?/g,
    (match, inner: string, after: string | undefined) => {
      const trimmed = inner.trim();
      if (!trimmed || trimmed === inner) return match;
      const trailingSpace = inner !== inner.trimEnd() && after ? " " : "";
      return `**${trimmed}**${trailingSpace}${after ?? ""}`;
    },
  );

  processed = processed.replace(/\*\*'(.+?)'\*\*(?=[가-힣])/g, "'**$1**'");
  processed = processed.replace(/\*\*"([^"]+)"\*\*(?=[가-힣])/g, '"**$1**"');

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

  return processed;
}

function fixPunctuationNoise(content: string): string {
  let result = content;

  for (const { pattern, fix } of PUNCTUATION_PATTERNS) {
    while (result.includes(pattern)) {
      result = result.split(pattern).join(fix);
    }
  }

  return result.replace(/ {2,}/g, " ");
}

function normalizeDoubleBrackets(content: string): string {
  return content.replace(DOUBLE_BRACKET_REGEX, "[$1]");
}

function stripDetailsBlocks(content: string): string {
  return content.replace(DETAILS_BLOCK_REGEX, "");
}

function countWords(content: string): number {
  return stripDetailsBlocks(content)
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

function getAllowedBoldCount(content: string, maxBoldPer100Words: number): number {
  const wordCount = countWords(content);
  return Math.max(1, Math.floor(wordCount / 100) * maxBoldPer100Words);
}

function shouldReduceBold(
  content: string,
  boldSegmentCount: number,
  maxBoldPer100Words: number,
): boolean {
  const wordCount = countWords(content);
  const allowedBold = getAllowedBoldCount(content, maxBoldPer100Words);

  return (
    wordCount >= MIN_WORDS_FOR_BOLD_REDUCTION &&
    boldSegmentCount >= MIN_BOLD_SEGMENTS_FOR_REDUCTION &&
    boldSegmentCount > allowedBold
  );
}

function reduceExcessiveBold(content: string, maxBoldPer100Words: number): string {
  const boldSegmentCount = countBoldSegments(content);
  if (!shouldReduceBold(content, boldSegmentCount, maxBoldPer100Words)) {
    return content;
  }

  const allowedBold = getAllowedBoldCount(content, maxBoldPer100Words);
  let seen = 0;

  return splitSegments(content)
    .map((segment) => {
      if (segment.protected) return segment.value;

      return segment.value.replace(BOLD_PATTERN_REGEX, (match) => {
        seen++;
        if (seen > allowedBold) {
          return match.replace(/\*\*/g, "");
        }
        return match;
      });
    })
    .join("");
}

function escapeTildes(content: string): string {
  return content.replace(/~/g, "\\~");
}

function countKoreanRatio(content: string): number {
  const nonWhitespace = content.replace(/\s/g, "");
  if (nonWhitespace.length === 0) return 0;

  const koreanCount = (nonWhitespace.match(KOREAN_CHAR_REGEX) ?? []).length;
  return koreanCount / nonWhitespace.length;
}

function collectPunctuationSamples(content: string): string[] {
  const samples = new Set<string>();

  for (const { pattern } of PUNCTUATION_PATTERNS) {
    let searchStart = 0;
    while (true) {
      const position = content.indexOf(pattern, searchStart);
      if (position === -1) break;
      samples.add(pattern);
      searchStart = position + 1;
    }
  }

  return [...samples];
}

function countPunctuationIssues(content: string): number {
  let count = 0;

  for (const { pattern } of PUNCTUATION_PATTERNS) {
    let searchStart = 0;
    while (true) {
      const position = content.indexOf(pattern, searchStart);
      if (position === -1) break;
      count++;
      searchStart = position + 1;
    }
  }

  return count;
}

function countDoubleBrackets(content: string): number {
  return [...content.matchAll(DOUBLE_BRACKET_REGEX)].length;
}

function countBoldSegments(content: string): number {
  return (stripDetailsBlocks(content).match(BOLD_PATTERN_REGEX) ?? []).length;
}

export function analyzeMarkdown(
  content: string,
  options: MarkdownPreprocessOptions = {},
): MarkdownAnalysisResult {
  const maxBoldPer100Words = options.maxBoldPer100Words ?? 1;
  const inspectable = getUnprotectedContent(content);

  const punctuationIssueCount = countPunctuationIssues(inspectable);
  const doubleBracketCount = countDoubleBrackets(inspectable);
  const boldSegmentCount = countBoldSegments(inspectable);
  const wordCount = countWords(inspectable);
  const allowedBold = getAllowedBoldCount(inspectable, maxBoldPer100Words);
  const excessiveBold = shouldReduceBold(inspectable, boldSegmentCount, maxBoldPer100Words);
  const koreanRatio = countKoreanRatio(inspectable);

  const issues: MarkdownIssue[] = [];

  if (punctuationIssueCount > 0) {
    issues.push({
      rule: "punctuation-noise",
      severity: "warning",
      message: `Found ${punctuationIssueCount} punctuation noise issue(s).`,
      samples: collectPunctuationSamples(inspectable),
    });
  }

  if (doubleBracketCount > 0) {
    issues.push({
      rule: "double-bracket",
      severity: "warning",
      message: `Found ${doubleBracketCount} double bracket reference(s).`,
    });
  }

  if (excessiveBold) {
    issues.push({
      rule: "excessive-bold",
      severity: "warning",
      message: `Found ${boldSegmentCount} bold segment(s), exceeding the allowed ${allowedBold}.`,
    });
  }

  return {
    passed: issues.length === 0,
    issues,
    metrics: {
      punctuationIssueCount,
      doubleBracketCount,
      boldSegmentCount,
      wordCount,
      koreanRatio,
      excessiveBold,
    },
  };
}

/**
 * Preprocess markdown content to fix rendering issues with Korean text.
 *
 * Handles:
 * 1. Trim invalid inner spaces around bold text: `** text **` → `**text**`
 * 2. Move quoted bold text outside markers when followed by Korean: `**'text'**에` → `'**text**'에`
 * 3. Insert spaces around `**` when CommonMark flanking rules would fail
 * 4. Fix common punctuation noise: `. ,` → `. `
 * 5. Normalize double brackets: `[[1]]` → `[1]`
 * 6. Reduce excessive bold density outside protected code spans
 * 7. Escape tildes outside protected code spans
 */
export function preprocessMarkdown(
  content: string,
  options: MarkdownPreprocessOptions = {},
): string {
  if (!content) return "";

  const maxBoldPer100Words = options.maxBoldPer100Words ?? 1;

  let processed = transformUnprotectedSegments(content, fixBoldSpacing);
  processed = transformUnprotectedSegments(processed, fixPunctuationNoise);
  processed = transformUnprotectedSegments(processed, normalizeDoubleBrackets);
  processed = reduceExcessiveBold(processed, maxBoldPer100Words);
  processed = transformUnprotectedSegments(processed, escapeTildes);

  return processed;
}
