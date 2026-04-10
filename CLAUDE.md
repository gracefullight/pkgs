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
# oh-my-agent — Claude Code Integration

## Reading Large Files
When reading large files, run `wc -l` first to check the line count. If the file is over 2,000 lines, use the `offset` and `limit` parameters on the Read tool to read in chunks rather than attempting to read the entire file at once.

## Architecture
- **SSOT**: `.agents/` directory (do not modify directly)
- **Response language**: Follows `language` in `.agents/oma-config.yaml`
- **Domain Skills**: `.agents/skills/` (exposed to `.claude/skills/` via symlinks)
- **Workflows**: `.agents/workflows/` (mapped to `.claude/skills/` as thin routers)
- **Subagents**: `.claude/agents/` (spawned via Task tool)

## Slash Commands

| Command | Workflow | Execution |
|:--|:--|:--|
| `/orchestrate` | `orchestrate.md` | Parallel subagents + Review Loop |
| `/work` | `work.md` | TaskCreate + Issue Remediation Loop |
| `/ultrawork` | `ultrawork.md` | 5-Phase Gate Loop |
| `/plan` | `plan.md` | Inline PM analysis |
| `/exec-plan` | `exec-plan.md` | Inline plan management |
| `/brainstorm` | `brainstorm.md` | Inline design exploration |
| `/review` | `review.md` | qa-reviewer subagent delegation |
| `/debug` | `debug.md` | Inline + subagent |
| `/commit` | `commit.md` | Inline git commit |
| `/tools` | `tools.md` | Inline MCP management |
| `/stack-set` | `stack-set.md` | Inline stack configuration |
| `/deepinit` | `deepinit.md` | Inline project initialization |

## Automatic Workflow Detection

Workflows activate via natural-language keywords — no `/command` required.
The `UserPromptSubmit` hook detects keywords and injects `[OMA WORKFLOW: ...]` into context.
Trigger keywords are defined in `.claude/hooks/triggers.json` (multi-language support).

### Hook Behavior
- `[OMA WORKFLOW: ...]` → read and execute the workflow file immediately
- `[OMA PERSISTENT MODE: ...]` → workflow still in progress, continue execution
- Informational context ("what is X?") is filtered out — no false triggers
- Explicit `/command` input skips the hook (no duplication)
- Persistent-mode workflows (`ultrawork`, `orchestrate`, `work`) block termination until complete
- Deactivate persistent mode: say "workflow done" → deletes `.agents/state/{workflow}-state-{sessionId}.json`

## Required References (before any skill execution)
1. `.agents/skills/_shared/core/skill-routing.md` — Agent routing
2. `.agents/skills/_shared/core/context-loading.md` — Selective resource loading
3. `.agents/skills/_shared/core/prompt-structure.md` — Goal, Context, Constraints, Done When

## Subagent Rules
- Definitions: `.claude/agents/*.md` → spawn via Task tool
- Parallel: multiple Task tool calls in a single message
- Results: synchronous return, written to `.agents/results/result-{agent}[-{sessionId}].md`
- Subagents require Charter Preflight (`CHARTER_CHECK`)

## Rules
1. **Do not modify `.agents/` files** — SSOT protection
2. Domain skills load only via explicit invocation or agent `skills` field
3. Workflows execute via explicit `/command` or hook auto-detection only — never self-initiated
4. Plans saved to `.agents/plan.json`
5. `stack/` is generated output — SSOT exception
<!-- OMA:END -->
