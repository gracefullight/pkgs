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

<!-- OMA:START — managed by oh-my-agent. Do not edit this block manually. -->

# oh-my-agent

## Architecture

- **SSOT**: `.agents/` directory (do not modify directly)
- **Response language**: Follows `language` in `.agents/oma-config.yaml`
- **Skills**: `.agents/skills/` (domain specialists)
- **Workflows**: `.agents/workflows/` (multi-step orchestration)
- **Subagents**: `oma agent:spawn {agent} {prompt} {sessionId}`

## Workflows

Execute by naming the workflow in your prompt. Keywords are auto-detected via hooks.

| Workflow | File | Description |
|----------|------|-------------|
| orchestrate | `orchestrate.md` | Parallel subagents + Review Loop |
| work | `work.md` | Step-by-step with remediation loop |
| ultrawork | `ultrawork.md` | 5-Phase Gate Loop (11 reviews) |
| plan | `plan.md` | PM task breakdown |
| brainstorm | `brainstorm.md` | Design-first ideation |
| review | `review.md` | QA audit |
| debug | `debug.md` | Root cause + minimal fix |
| commit | `commit.md` | Conventional Commits |

To execute: read and follow `.agents/workflows/{name}.md` step by step.

## Auto-Detection

Hooks: `UserPromptSubmit` (keyword detection), `PreToolUse`, `Stop` (persistent mode)
Keywords defined in `.agents/hooks/core/triggers.json` (multi-language).
Persistent workflows (orchestrate, ultrawork, work) block termination until complete.
Deactivate: say "workflow done".

## Rules

1. **Do not modify `.agents/` files** — SSOT protection
2. Workflows execute via keyword detection or explicit naming — never self-initiated
3. Response language follows `.agents/oma-config.yaml`

## Project Rules

Read the relevant file from `.agents/rules/` when working on matching code.

| Rule | File | Scope |
|------|------|-------|
| backend | `.agents/rules/backend.md` | on request |
| commit | `.agents/rules/commit.md` | on request |
| database | `.agents/rules/database.md` | **/*.{sql,prisma} |
| debug | `.agents/rules/debug.md` | on request |
| design | `.agents/rules/design.md` | on request |
| dev-workflow | `.agents/rules/dev-workflow.md` | on request |
| frontend | `.agents/rules/frontend.md` | **/*.{tsx,jsx,css,scss} |
| i18n-guide | `.agents/rules/i18n-guide.md` | always |
| infrastructure | `.agents/rules/infrastructure.md` | **/*.{tf,tfvars,hcl} |
| lint-format-guide | `.agents/rules/lint-format-guide.md` | on request |
| mobile | `.agents/rules/mobile.md` | **/*.{dart,swift,kt} |
| quality | `.agents/rules/quality.md` | on request |

<!-- OMA:END -->
