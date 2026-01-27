# On Task Completion

Before completing a task, ensure the following:
1. Run `bun lint` and fix any issues (use `bun lint:fix`).
2. Run `bun typecheck` to ensure there are no TypeScript errors.
3. Run `bun test:run` if any logic was changed that might affect existing tests.
4. Verify that new tools are registered in `src/tools/index.ts`.
5. Ensure all file names follow the kebab-case convention.
