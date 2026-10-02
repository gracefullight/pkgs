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

Follow `.agents/skills/_shared/core/execution-policy.md` for authorization, clarification, verification, and completion. System/developer instructions and the user's request take precedence over OMA defaults. Never build, compile, bundle, or package software unless the user explicitly requests a build.

- **SSOT**: Do not modify `.agents/` definitions (skills, workflows, rules, agents, config) directly. Run outputs under `.agents/results/` and `.agents/state/` are generated artifacts and may be written.
- **Response language**: Follow `language` in `.agents/oma-config.yaml`.
- **Skills**: Read the relevant `.agents/skills/{name}/SKILL.md` when needed.
- **Subagents**:
  - claude: Same-vendor native dispatch via Claude Code Agent tool with `.claude/agents/{name}.md`; cross-vendor fallback via `oma agent spawn`
  - codex: Same-vendor native dispatch via Codex custom agents in `.codex/agents/{name}.toml`; cross-vendor fallback via `oma agent spawn`
  - cursor: `@agent-name` (defined in `.cursor/agents/`)
  - qwen: Same-vendor native dispatch via Qwen Code subagents in `.qwen/agents/{name}.md`; cross-vendor fallback via `oma agent spawn`
  - pi: pi has no native subagent API; use `oma agent spawn {agent} {prompt} {sessionId} --vendor pi` for CLI subprocess dispatch
- Write non-ASCII tool-call parameters as literal UTF-8, not Unicode escapes.

## Per-Agent Dispatch

Resolve each agent from `.agents/oma-config.cue` or `.agents/oma-config.yaml`, overlaid by `.agents/oma-config.local.cue` or `.agents/oma-config.local.yaml` when present. With `model_preset: free`, always use `oma agent spawn` so the subprocess receives the FreeLLMAPI route; `free.model` replaces per-agent model pins. Otherwise, explicit `agents:` overrides take priority. With `model_preset: auto`, follow the current vendor's native agent/model settings; use `default_cli` only when the runtime is unknown. Use native subagents when the target matches the current runtime; otherwise, or when native dispatch is unavailable, use `oma agent spawn`.

## Code Search

Serena MCP is required for code search and discovery. Load deferred tools before use. Use `find_file` for paths, `search_for_pattern` for content, and `find_symbol` / `get_symbols_overview` for symbols. Native search is only for paths outside this project, ignored paths, or plain non-code content. The PreToolUse guard already allows searches confined to confirmed provider exclusions or paths outside this project.

## Workflows

Run workflows only when explicitly requested or detected by a hook; never self-initiate. Read and follow `.agents/workflows/{name}.md`. Continue active workflows until complete or explicitly cancelled.

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
| i18n-arb | `.agents/rules/i18n-arb.md` | **/*.arb |
| i18n-guide | `.agents/rules/i18n-guide.md` | always |
| infrastructure | `.agents/rules/infrastructure.md` | **/*.{tf,tfvars,hcl} |
| lint-format-guide | `.agents/rules/lint-format-guide.md` | on request |
| market | `.agents/rules/market.md` | on request |
| mobile | `.agents/rules/mobile.md` | **/*.{dart,swift,kt} |
| quality | `.agents/rules/quality.md` | on request |

<!-- OMA:END -->
