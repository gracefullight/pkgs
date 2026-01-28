# Suggested Commands for pkgs

## Development
```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Type check all packages
bun run typecheck
```

## Linting & Formatting
```bash
# Check linting
bun run lint

# Fix linting issues
bun run lint:fix

# Format code
bun run format
```

## Testing
```bash
# Test all packages
bun run --filter './packages/*' test

# Test specific package
bun run --filter '@gracefullight/saju' test
```

## Package Management
```bash
# Add dependency to specific package
bun add <package> --filter '@gracefullight/<package-name>'

# Add dev dependency to root
bun add -d <package>
```

## Release
```bash
# Release please (triggered via CI, but can check locally)
# See .github/workflows/release.yml
```

## Git
```bash
# Current branch
git branch --show-current

# Recent commits
git log -20 --oneline

# Check status
git status
```

## Utility (Darwin/macOS)
```bash
# List directory
ls -la

# Find files
find . -name "*.ts" -not -path "*/node_modules/*"

# Search in files
grep -r "pattern" --include="*.ts" .

# Check mise tools
mise list
```
