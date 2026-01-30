# @gracefullight/biome-plugin

Biome GritQL plugins for code quality.

## Installation

```bash
bun add -D @gracefullight/biome-plugin
```

## Usage

Add to your `biome.json`:

```json
{
  "plugins": [
    "node_modules/@gracefullight/biome-plugin/rules/no-relative-imports.grit"
  ]
}
```

## Rules

### no-relative-imports

Disallows relative imports (`./`, `../`). Use path aliases from `tsconfig.json` instead.

Supports:

- Static imports: `import { foo } from "./utils"`
- Type imports: `import type { Foo } from "./types"`
- Dynamic imports: `import("./lazy")`
- Re-exports: `export { foo } from "./utils"`
- Type re-exports: `export type { Foo } from "./types"`
- Barrel exports: `export * from "./all"`
- Namespace exports: `export * as ns from "./namespace"`

```typescript
// ❌ Error
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

## Limitations

GritQL plugins can only perform pattern matching. This rule flags **all** relative imports and cannot dynamically check if a path alias exists in your `tsconfig.json`.

## Sponsors

If this project helped you, please consider buying me a coffee!

<a href="https://www.buymeacoffee.com/gracefullight" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

Or leave a star:

```bash
gh api --method PUT /user/starred/gracefullight/pkgs
```

## License

MIT
