# Development Commands

## Environment Setup
```bash
# Install Node.js 24, bun 10 via mise
mise install

# Install dependencies
bun install
```

## Root Level Commands
```bash
# Build all packages
bun build

# Lint check
bun lint

# Lint auto-fix
bun lint:fix

# Format
bun format

# Create changeset
bun changeset

# Update versions
bun version

# Publish packages
bun release
```

## Package-specific Commands

### packages/saju
```bash
cd packages/saju

bun build          # Build with tsc + tsc-alias
bun dev            # Run with tsx
bun test           # Run vitest
bun test:ui        # Vitest UI mode
bun test:coverage  # Coverage report
bun lint           # Biome lint
bun lint:fix       # Biome lint auto-fix
bun format         # Biome format
```

### packages/validate-branch
```bash
cd packages/validate-branch

bun build       # Build with tsup
bun dev         # Run CLI with tsx
bun test        # Run vitest
bun lint        # Biome lint
bun lint:fix    # Biome lint auto-fix
bun format      # Biome format
```

### apps/saju-example
```bash
cd apps/saju-example

bun dev         # Next.js dev server (Turbopack)
bun build       # Next.js build
bun start       # Production server
bun lint        # Next.js lint
```

## Git Commands
```bash
git status
git diff
git log --oneline -10
git add .
git commit -m "message"
git push
```
