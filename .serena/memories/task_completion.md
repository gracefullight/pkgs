# Task Completion Checklist for pkgs

## Before Committing
- [ ] Run `bun run lint` - no errors
- [ ] Run `bun run typecheck` - no type errors
- [ ] Run tests if applicable: `bun run --filter '<package>' test`

## Committing
- [ ] Use conventional commit format: `type(scope): message`
- [ ] Keep commits atomic (one logical change per commit)
- [ ] Include Co-authored-by trailer for AI assistance

## After Changes
- [ ] Verify Biome formatting: `bun run format`
- [ ] Check that build passes: `bun run build`
- [ ] Review changed files: `git diff --staged`

## Release Considerations
- [ ] For new features: use `feat:` commit type
- [ ] For bug fixes: use `fix:` commit type
- [ ] For breaking changes: include `BREAKING CHANGE:` in commit body
- [ ] release-please will automatically create release PR based on commits
