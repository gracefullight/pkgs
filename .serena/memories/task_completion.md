# Task Completion Checklist

## After Code Changes

### 1. Lint Check
```bash
bun lint
```
If errors, run `bun lint:fix` for auto-fix

### 2. Type Check
In the relevant package:
```bash
bun build
```
Should have no build errors

### 3. Run Tests
In the relevant package:
```bash
bun test
```
All tests must pass

## Before Release

### 1. Create Changeset
```bash
bun changeset
```
- Select change type (major/minor/patch)
- Write change description

### 2. Update Versions
```bash
bun version
```

### 3. Build and Publish
```bash
bun release
```

## Before Commit

1. `bun lint` - Lint passes
2. `bun build` - Build succeeds
3. `bun test` (in relevant package) - Tests pass

## Important Notes
- Never use `as any`, `@ts-ignore`, `@ts-expect-error`
- Must use `import type` for type imports
- No empty catch blocks
