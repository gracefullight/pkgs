# pkgs — Gracefullight's Package Monorepo

## Quick Reference

- **Package manager**: Bun (`bun install`, NOT npm/yarn/pnpm)
- **Lockfile**: `bun.lock` — always commit after adding/removing deps. CI uses `--frozen-lockfile`.
- **Node**: v24 (via mise)
- **Monorepo**: Bun workspaces (`packages/*`, `apps/*`)

## Commands

- `bun install` — install all dependencies (run from root)
- `bun run build` — build all packages (tsup)
- `bun run lint` — Biome check
- `bun run --filter './packages/*' test` — test all packages
- `cd packages/<name> && npx vitest run` — test single package

## Conventions

- **Commits**: Conventional Commits (`feat`, `fix`, `chore`, etc.) — enforced by commitlint
- **Formatting**: Biome (space indent, double quotes, trailing commas)
- **Linting**: Biome recommended + `useImportType`, `useExportType`
- **Build**: tsup, ESM-only, `dts: true`
- **TypeScript**: `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`, strict
- **Exports**: `package.json` must have `exports`, `main`, `types`, `files: ["dist"]`

## Release Pipeline

- **release-please**: auto-creates release PRs on `main` push based on conventional commits
- Config: `.release-please-config.json` + `.release-please-manifest.json`
- **New package checklist**: add entry to both release-please files, both README.md/README.ko.md tables
- **npm publish**: automated on release via `bun publish --access public`
- Dart packages: published to pub.dev
- Zotero plugin: .xpi uploaded to GitHub Releases

## Structure

```
packages/           — published npm/pub packages
  biome-plugin/     — Biome GritQL plugins
  create-fullstack-starter/ — CLI scaffold tool
  markdown/         — Markdown preprocessing for Korean text
  mcp-cafe24-admin/ — MCP server for Cafe24 Admin API
  ng-daum-address/  — Angular Daum address component
  react-share/      — Headless social sharing for React
  saju/             — Four Pillars calculation (Node)
  saju-dart/        — Four Pillars calculation (Dart)
  tems-trp-parser/  — TEMS TRP RF log parser
  validate-branch/  — Git branch name validator
  zotero-plugin-uts/ — Zotero bibliography plugin
apps/               — example/demo apps (not published)
```

## Gotchas

- Always run `bun install` after adding deps — CI will fail on stale `bun.lock`
- Each package has its own `tsup.config.ts` and `vitest` setup — run tests from package dir
- `saju-dart` is Dart/Flutter, not Node — uses `dart test`, not vitest
- Biome config at root applies to all packages
