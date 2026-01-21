# 🐛 GritQL pattern `export { $foo } from $source` fails to match while `export * from $source` works

## Environment information

<details>

```bash
CLI:
  Version:                      2.3.11
  Color support:                true

Platform:
  CPU Architecture:             aarch64
  OS:                           macos

Environment:
  BIOME_LOG_PATH:               unset
  BIOME_LOG_PREFIX_NAME:        unset
  BIOME_CONFIG_PATH:            unset
  BIOME_THREADS:                unset
  NO_COLOR:                     unset
  TERM:                         xterm-256color
  JS_RUNTIME_VERSION:           v24.12.0
  JS_RUNTIME_NAME:              node
  NODE_PACKAGE_MANAGER:         npm/11.6.2

Biome Configuration:
  Status:                       Loaded successfully
  Formatter enabled:            true
  Linter enabled:               true
  Assist enabled:               true
  VCS enabled:                  true

Workspace:
  Open Documents:               0
```

</details>

## What happened?

GritQL patterns for named exports (`export { $foo } from $source`) fail to match export statements, while the structurally similar star export pattern (`export * from $source`) works correctly.

### Reproduction steps

1. Create a directory and navigate to it:
```bash
mkdir -p biome_repro && cd biome_repro
```

2. Create a GritQL rule file (`rule.grit`):
```grit
`export { $foo } from $source` where {
  $source <: r"^['\"]\.\.?/.*",
  register_diagnostic(span=$source, message="Found relative export")
}
```

3. Create `biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "plugins": ["./rule.grit"],
  "linter": { "enabled": true, "rules": { "recommended": false } }
}
```

4. Create a test file (`repro.ts`):
```typescript
export { foo } from "../../deep/path";
```

5. Run Biome lint:
```bash
npx @biomejs/biome lint repro.ts
```

**Result**: No diagnostic is emitted. ❌

### Comparison with working patterns

| Pattern | Code | Result |
|---------|------|--------|
| `export * from $source` | `export * from "../../deep/path";` | ✅ Matches |
| `import $name from $source` | `import foo from "../../deep/path";` | ✅ Matches |
| `export { $foo } from $source` | `export { foo } from "../../deep/path";` | ❌ No match |

### Unit test reproduction (Biome source)

I verified this bug in the Biome source code by adding a test to `crates/biome_grit_patterns/tests/quick_test.rs`:

```rust
#[test]
fn test_export_named_from_deep_path() {
    let parse_grit_result = parse_grit(
        r#"`export { $foo } from $source` where {
            $source <: r"^['\"]\.\.?/.*"
        }"#,
    );
    // ... setup code ...

    let body = r#"export { foo } from "../../deep/path";"#;
    let parsed = parse(body, JsFileSource::js_module(), JsParserOptions::default());
    let file = GritTargetFile::new("test.js", parsed.into());
    let GritQueryResult { effects, .. } = query.execute(file).expect("could not execute query");

    // THIS FAILS - effects is empty
    assert!(!effects.is_empty(), "Expected match for export { foo } from");
}
```

### Investigation findings

1. **Mapping exists**: `JsExportNamedFromClause` is correctly mapped in `generated_mappings.rs`.

2. **Snippet parsing issue**: The pattern `export { $foo } from $source` gets incorrectly parsed as `JS_OBJECT_MEMBER_LIST` or `JSX_CHILD_LIST` instead of `JS_EXPORT_NAMED_FROM_CLAUSE`.

3. **Likely cause**: The `snippet_context_strings()` in `crates/biome_grit_patterns/src/grit_target_language/js_target_language.rs` may not provide adequate context for parsing `export { ... } from ...` statements.

## Expected result

The GritQL pattern `export { $foo } from $source` should match the code `export { foo } from "../../deep/path";` and emit a diagnostic, just like `export * from $source` does for `export * from "../../deep/path";`.

## Code of Conduct

- [x] I agree to follow Biome's Code of Conduct
