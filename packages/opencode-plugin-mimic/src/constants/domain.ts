import type { Language } from "@/lib/i18n";
import type { Domain } from "@/types";

/**
 * Domain constants for clustering
 */
export const DOMAINS = [
  "code-style",
  "testing",
  "git",
  "debugging",
  "file-organization",
  "tooling",
  "refactoring",
  "documentation",
  "other",
] as const;

/**
 * Domain keywords for pattern detection.
 * English keywords are always matched (base).
 * Korean keywords are additionally matched when language is ko-KR.
 */
export const DOMAIN_KEYWORDS_BY_LANG: Record<Language, Record<Domain, string[]>> = {
  "en-US": {
    "code-style": ["style", "format", "lint", "prettier", "eslint", "naming", "convention"],
    testing: ["test", "spec", "jest", "vitest", "mocha", "coverage", "assert", "expect"],
    git: ["commit", "branch", "merge", "push", "pull", "rebase", "stash", "git"],
    debugging: ["debug", "error", "fix", "bug", "issue", "trace", "log", "breakpoint"],
    "file-organization": ["move", "rename", "organize", "structure", "folder", "directory"],
    tooling: ["tool", "script", "build", "compile", "bundle", "config"],
    refactoring: ["refactor", "extract", "inline", "rename", "move", "simplify"],
    documentation: ["doc", "readme", "comment", "jsdoc", "markdown", "wiki"],
    other: [],
  },
  "ko-KR": {
    "code-style": ["스타일", "포맷", "린트", "네이밍", "컨벤션", "코딩규칙", "정렬"],
    testing: ["테스트", "단위테스트", "커버리지", "검증", "확인", "단언"],
    git: ["커밋", "브랜치", "병합", "푸시", "풀", "리베이스", "스태시", "깃"],
    debugging: ["디버그", "디버깅", "오류", "에러", "수정", "버그", "이슈", "추적", "로그"],
    "file-organization": ["이동", "이름변경", "정리", "구조", "폴더", "디렉토리", "파일정리"],
    tooling: ["도구", "스크립트", "빌드", "컴파일", "번들", "설정", "구성"],
    refactoring: ["리팩터", "리팩토링", "추출", "인라인", "단순화", "개선"],
    documentation: ["문서", "문서화", "주석", "리드미", "마크다운", "위키", "설명"],
    other: [],
  },
};
