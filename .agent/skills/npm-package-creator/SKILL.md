---
name: npm-package-creator
description: Guide for creating new npm packages in Gracefullight's TypeScript package monorepo. Use when creating new packages in pnpm workspace environment using TypeScript, Biome, tsup, and Vitest with standardized package structure.
license: MIT
---

# npm Package Creator

This skill provides guidance for creating new TypeScript npm packages in the Gracefullight pkgs monorepo.

## Overview

Create standardized npm packages that follow existing project structure:
- **Monorepo**: pnpm workspace
- **Runtime**: Node.js 24, pnpm 10
- **Language**: TypeScript (ES2023)
- **Linter/Formatter**: Biome
- **Build**: tsup (ESM output)
- **Testing**: Vitest

---

# Process

## Phase 1: Create Package Directory

```bash
mkdir -p packages/your-package
cd packages/your-package
```

## Phase 2: Create package.json

Use the template from [package.json template](#reference-templates). Follow existing package patterns.

**Required fields**:
- `name`: `@gracefullight/*` format or `create-*`
- `version`: `0.1.0` (new package)
- `type`: `"module"`
- `main`, `types`, `exports`
- `scripts`: build, dev, test, lint, format, typecheck
- `publishConfig.access`: `"public"`

**Standard scripts**:
```json
{
  "build": "tsup",
  "dev": "tsx src/index.ts",
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "lint": "biome check src",
  "lint:fix": "biome check --write src",
  "format": "biome format --write src",
  "typecheck": "tsc --noEmit"
}
```

## Phase 3: Create TypeScript Config Files

**tsconfig.json**: See [tsconfig template](#reference-templates)

- `target`: `"ES2023"`
- `module`: `"ESNext"`
- `lib`: `["ES2023"]`
- `moduleResolution`: `"bundler"`
- `strict`: `true`
- `types`: `["node"]`

**tsup.config.ts**: See [tsup.config template](#reference-templates)

- `entry`: `["src/index.ts"]`
- `format`: `["esm"]`
- `dts`: `true`
- `target`: `"node24"`
- `clean`: `true`

## Phase 4: Create Source Structure

```bash
mkdir -p src test
touch src/index.ts
```

**Basic structure**:
```
packages/your-package/
├── src/
│   ├── index.ts          # Main entry point
│   ├── cli.ts            # For CLI packages
│   ├── lib/              # Library code
│   └── assets/           # Static files (if needed)
├── test/                 # Test files
├── dist/                 # Build output (auto-generated)
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

## Phase 5: Write Basic Code

```typescript
// src/index.ts
export function hello(name: string): string {
  return `Hello, ${name}!`;
}
```

## Phase 6: Create README.md

See [README template](#reference-templates).

**Required sections**:
- Package description
- Installation instructions
- Usage examples
- API reference
- Development guide
- License

## Phase 7: Install Dependencies

```bash
cd ../../
pnpm install
```

## Phase 8: Build and Test

```bash
cd packages/your-package

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint

# Type check
pnpm typecheck
```

## Phase 9: Verify Workspace Registration

`pnpm-workspace.yaml` has `packages/*` pattern, so automatic inclusion. No manual action required.

---

# Package-Specific Configurations

## CLI Packages

**Additional package.json**:
```json
{
  "bin": {
    "cli-name": "./dist/cli.js"
  }
}
```

**Additional tsup.config.ts**:
```typescript
banner: {
  js: "#!/usr/bin/env node"
}
```

**Additional dependencies**:
- `commander`: CLI framework
- `chalk`: Terminal styling
- `@clack/prompts`: Interactive prompts

## Library Packages

- Multiple entry points in `exports` field
- Comprehensive type definitions
- Target test coverage: 80%+

## Server Packages (MCP, etc.)

- Server-specific dependencies
- Environment variable handling
- Enhanced error handling
- Logging libraries

---

# Verification Checklist

Verify all items before publishing:

## package.json
- [ ] `name` uses correct scope (`@gracefullight/*`)
- [ ] `version` is set
- [ ] `type: "module"` is set
- [ ] `main` field exists
- [ ] `types` field exists
- [ ] `exports` field is properly configured
- [ ] `bin` field exists (CLI packages)
- [ ] `files: ["dist"]` included
- [ ] All required `scripts` present
- [ ] `engines.node: ">=24"` set
- [ ] `publishConfig.access: "public"`

## TypeScript Config
- [ ] `target: "ES2023"` set
- [ ] `module: "ESNext"` set
- [ ] `strict: true` set
- [ ] `types: ["node"]` included

## Source Code
- [ ] `src/index.ts` exists
- [ ] At least one export present
- [ ] No TypeScript errors
- [ ] Test files written (optional)

## Build and Test
- [ ] `pnpm build` succeeds
- [ ] `dist/` directory created
- [ ] `.d.ts` type definitions generated
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes

## Documentation
- [ ] `README.md` exists
- [ ] Installation instructions provided
- [ ] Usage examples included
- [ ] API reference included

---

# Useful Commands

## Workspace Commands

```bash
# Build all packages
pnpm -r build

# Test all packages
pnpm -r test

# Lint all packages
pnpm lint

# Install dependencies
pnpm install
```

## Package-Specific Commands

```bash
# Build specific package
pnpm --filter @gracefullight/your-package build

# Dev mode for specific package
pnpm --filter @gracefullight/your-package dev

# Test specific package
pnpm --filter @gracefullight/your-package test
```

## Pre-Publish Checks

```bash
# Dry run to test publishing
pnpm publish --dry-run

# Actual publish
pnpm publish
```

---

# Reference Templates

All templates are consolidated in [references/templates.md](references/templates.md).

Templates include:
- **package.json**: Complete template with all required fields
- **tsconfig.json**: TypeScript configuration for ES2023
- **tsup.config.ts**: Build configuration
- **README.md**: Standard documentation structure
- **Test template**: Basic Vitest test example
