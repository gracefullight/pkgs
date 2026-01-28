# Project Overview: pkgs

## Purpose
A monorepo containing various open-source packages by gracefullight, including:
- **Saju (四柱命理)**: Korean/Chinese Four Pillars calculation library (TypeScript & Dart)
- **Angular Components**: Daum (Kakao) Address Search Component
- **Git Utilities**: Branch name validation tool
- **MCP Servers**: Cafe24 Admin API integration
- **CLI Tools**: Fullstack starter template
- **Zotero Plugin**: UTS APA 7th citation format plugin

## Tech Stack
- **Package Manager**: Bun 1.2.4
- **Runtime**: Node.js 24
- **Monorepo**: Bun workspaces (packages/*, apps/*)
- **Linting/Formatting**: Biome 2.3.11 with custom plugin
- **Release Management**: release-please
- **Version Manager**: mise (experimental monorepo root)
- **Additional**: Dart/Flutter for saju-dart package

## Code Style & Conventions
- **Formatter**: Biome with 2-space indentation, 100 char line width
- **Quotes**: Double quotes
- **Trailing Commas**: All
- **Import/Export**: Strict type imports/exports required (`useImportType`, `useExportType`)
- **Custom Rule**: No relative imports (via biome-plugin)
- **Commit Style**: Conventional commits (enforced by commitlint)

## Project Structure
```
pkgs/
├── packages/           # Main packages
│   ├── saju/          # TypeScript Saju library
│   ├── saju-dart/     # Dart/Flutter Saju library
│   ├── ng-daum-address/  # Angular component
│   ├── validate-branch/  # Git utility
│   ├── mcp-cafe24-admin/ # MCP server
│   ├── create-fullstack-starter/  # CLI tool
│   ├── biome-plugin/  # Custom Biome rules
│   └── zotero-plugin-uts/  # Zotero plugin
├── apps/              # Example applications
├── .github/workflows/ # CI/CD (release.yml, ci.yml, deploy.yml)
└── biome.json         # Biome configuration
```

## Release Configuration
- Uses release-please with component-based versioning
- Tag format: `component@version` (e.g., `@gracefullight/saju@1.0.0`)
- Separate release for each package
- Publishes to npm (TypeScript) and pub.dev (Dart)
