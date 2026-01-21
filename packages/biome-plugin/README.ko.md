# @gracefullight/biome-plugin

코드 품질을 위한 Biome GritQL 플러그인.

## 설치

```bash
pnpm add -D @gracefullight/biome-plugin
```

## 사용법

`biome.json`에 추가:

```json
{
  "plugins": [
    "node_modules/@gracefullight/biome-plugin/rules/no-relative-imports.grit"
  ]
}
```

## 규칙

### no-relative-imports

상대 경로 import(`./`, `../`)를 금지합니다. `tsconfig.json`의 path alias를 사용하세요.

지원 항목:

- 정적 import: `import { foo } from "./utils"`
- 타입 import: `import type { Foo } from "./types"`
- 동적 import: `import("./lazy")` (warning)
- Re-export: `export { foo } from "./utils"`
- 타입 re-export: `export type { Foo } from "./types"`
- Barrel export: `export * from "./all"`
- Namespace export: `export * as ns from "./namespace"`

```typescript
// ❌ 에러
import { foo } from "./utils";
import type { Foo } from "../types";
const lazy = await import("./lazy");
export { bar } from "./components";
export type { Baz } from "../models";
export * from "./all";

// ✅ OK
import { foo } from "@/utils";
import type { Foo } from "@/types";
const lazy = await import("@/lazy");
export { bar } from "@/components";
export type { Baz } from "@/models";
export * from "@/all";
```

## 제한사항

GritQL 플러그인은 패턴 매칭만 수행합니다. 이 규칙은 **모든** 상대 경로 import를 표시하며, `tsconfig.json`의 path alias 존재 여부를 동적으로 확인할 수 없습니다.

## 라이선스

MIT
