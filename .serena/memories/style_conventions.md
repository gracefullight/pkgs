# Style Conventions for pkgs

## TypeScript/JavaScript
- **Indentation**: 2 spaces
- **Line Width**: 100 characters
- **Quotes**: Double quotes
- **Trailing Commas**: All (where valid)
- **Semicolons**: Required (Biome default)

## Import/Export Rules
- **Strict Type Imports**: Required (`import type { ... }`)
- **Strict Type Exports**: Required (`export type { ... }`)
- **No Relative Imports**: Use package names instead (enforced by custom Biome plugin)

## Commit Convention
- **Format**: Conventional Commits
- **Types**: feat, fix, chore, docs, style, refactor, test, ci, build, perf
- **Scope**: Optional, use package name (e.g., `feat(saju): add solar term calculation`)

## Naming Conventions
- **Files**: kebab-case for utilities, PascalCase for classes/components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Package Names**: @gracefullight/* for scoped packages

## Code Patterns
- Prefer explicit types over inference for public APIs
- Use strict null checks
- Organize imports (Biome assist action enabled)
