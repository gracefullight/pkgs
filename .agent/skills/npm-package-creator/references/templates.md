# Reference Templates

This file contains all templates referenced in SKILL.md for creating new npm packages.

---

## package.json Template

```json
{
  "name": "@gracefullight/your-package",
  "version": "0.1.0",
  "description": "Enter package description here",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "bin": {
    "cli-name": "./dist/cli.js"
  },
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsx src/index.ts",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "biome check src",
    "lint:fix": "biome check --write src",
    "format": "biome format --write src",
    "typecheck": "tsc --noEmit"
  },
  "keywords": [
    "keyword1",
    "keyword2",
    "keyword3"
  ],
  "author": {
    "name": "Eunkwang Shin",
    "email": "gracefullight.dev@gmail.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/gracefullight/pkgs.git",
    "directory": "packages/your-package"
  },
  "homepage": "https://github.com/gracefullight/pkgs/tree/main/packages/your-package#readme",
  "bugs": {
    "url": "https://github.com/gracefullight/pkgs/issues"
  },
  "license": "MIT",
  "funding": {
    "type": "github",
    "url": "https://github.com/sponsors/gracefullight"
  },
  "publishConfig": {
    "access": "public"
  },
  "engines": {
    "node": ">=24"
  },
  "devDependencies": {
    "@biomejs/biome": "2.3.11",
    "@types/node": "^24.10.4",
    "@vitest/coverage-v8": "^4.0.17",
    "tsup": "^8.5.1",
    "tsx": "^4.21.0",
    "typescript": "^5",
    "vitest": "^4.0.17"
  },
  "dependencies": {}
}
```

**Note**: Keep `bin` field for CLI packages, remove for library packages.

---

## tsconfig.json Template

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "lib": ["ES2023"],
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## tsup.config.ts Template

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  shims: true,
  target: "node24",
  splitting: false,
  banner: {
    js: "#!/usr/bin/env node",
  },
});
```

**Note**: `banner` section is only required for CLI packages. Remove `banner` section for library packages.

---

## README.md Template

```markdown
# @gracefullight/your-package

> Brief package description in one sentence

[![npm version](https://img.shields.io/npm/v/@gracefullight/your-package.svg)](https://www.npmjs.org/package/@gracefullight/your-package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Funding](https://img.shields.io/github/sponsors/gracefullight)](https://github.com/sponsors/gracefullight)

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
pnpm add @gracefullight/your-package
npm install @gracefullight/your-package
yarn add @gracefullight/your-package
\`\`\`

## Usage

### Basic Usage

\`\`\`typescript
import { function1 } from "@gracefullight/your-package";

// Usage example
const result = function1("parameter");
console.log(result);
\`\`\`

### CLI Usage (if applicable)

\`\`\`bash
npx your-package [options]
\`\`\`

## API Reference

### \`function1(param)\`

Function description...

\`\`\`typescript
function function1(param: string): void
\`\`\`

**Parameters:**
- \`param\`: Parameter description

**Returns:** Return type description

---

## Development

\`\`\`bash
# Install dependencies
pnpm install

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint

# Format
pnpm lint:fix
\`\`\`

## License

MIT
\`\`\`

---

## Test Template

```typescript
import { describe, it, expect } from "vitest";
import { hello } from "../src/index";

describe("hello", () => {
  it("should return greeting message", () => {
    expect(hello("World")).toBe("Hello, World!");
  });

  it("should handle empty string", () => {
    expect(hello("")).toBe("Hello, !");
  });
});
```

**Note**: Use project path alias instead of relative imports.
