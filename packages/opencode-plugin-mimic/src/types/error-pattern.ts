export interface ErrorPattern {
  id: string;
  errorSignature: string; // 에러 메시지의 핵심 부분 (정규화)
  errorType: string; // 에러 유형 (compile, runtime, lint, test)
  fixes: ErrorFix[];
  firstSeen: string;
  lastSeen: string;
  occurrences: number;
}

export interface ErrorFix {
  description: string;
  toolSequence: string[]; // 수정에 사용된 도구들
  filesChanged: string[];
  confidence: number; // 0-1, 이 수정이 성공한 비율
  successCount: number;
  failCount: number;
}
