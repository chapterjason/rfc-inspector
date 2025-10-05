# Repository Guidelines

## Project Vision & Intent

- Goal: parse and edit every detail of RFC TXT documents, capturing structure, content, and formatting so nothing is lost between input and output.
- Principles: guarantee parse followed by render reproduces the original bytes (newline- and whitespace-aware), favor correctness over convenience, and build small, composable primitives that stay explicit and readable.
- Scope: build a reusable AST and utilities first; additional CLIs, static sites, or integrations should layer on the library rather than bake in assumptions.

## Workspace Layout & Module Organization
- Root `package.json` orchestrates npm workspaces for `packages/lib`, `packages/bin`, and `packages/browser`. Run commands from the root unless you need package-specific overrides.
- **Library (`packages/lib`)**: houses the core parser, AST shapes, renderers, patch application, and utilities. Source lives under `packages/lib/src/**`; build artifacts land in `packages/lib/dist/`. Supplemental design notes are in `packages/lib/docs/`.
- **CLI runner (`packages/bin`)**: wraps the library to download RFCs, apply curated patches, and emit rendered outputs. Sources live in `packages/bin/src/**`; sample RFC fixtures sit in `packages/bin/rfc/`; curated AST patches live in `packages/bin/patches/**`. Emitted JS goes to `packages/bin/dist/`.
- **Browser inspector (`packages/browser`)**: bundles the interactive AST explorer. Entry HTML is `packages/browser/index.html`; browser-side TypeScript and styles live under `packages/browser/src/**`; bundles are written to `packages/browser/dist/` via esbuild.
- Top-level TypeScript config (`tsconfig.json`) defines workspace-wide compiler options and path aliases (for example `@rfc-inspector/lib`). Keep new modules cohesive; prefer directory hierarchies such as `Tree/<Area>/<File>.ts` within the library.

## Architecture Overview (Library)
- Core parser: `packages/lib/src/Tree/Parser.ts` produces a `Document` given a line-oriented cursor.
- Matchers: `packages/lib/src/Tree/Matcher/*` identify structural blocks by priority. Extendable set; keep matchers small and explicit.
- Nodes: `packages/lib/src/Tree/Node/*` define AST node shapes, metadata, and positional data.
- Patch utilities: `packages/lib/src/Tree/Patch/*` provides structural diffing and patch application. Consult `packages/lib/docs/PatchFormat.md` before altering patch schema.
- Utilities: `packages/lib/src/Utils/*` host cursors and helpers. `ArrayCursor` remains the primary adapter for raw lines.

### Renderer Structure
- Location: `packages/lib/src/Tree/Render/*` — small, composable renderers per node kind.
- Entry points: `RenderDocument.ts` (flatten children), `RenderNode.ts` (dispatch by type), `RenderToString.ts` (join with `\\n`).
- Principles: guarantee parse followed by render reproduces the original bytes (newline- and whitespace-aware), favor correctness over convenience, and build small, composable primitives that stay explicit and readable.

### CLI Runner
- Entry point: `packages/bin/src/index.ts`; utilities reside under `packages/bin/src/Utils/`.
- The script materializes `rfc/`, `output/`, and `patches/` directories relative to the working directory. Keep side-effects deliberate and guard filesystem writes with explicit paths.
- When adding new CLI capabilities, reuse the core library surface (`parse`, `render`, `patch`, cursors) rather than re-implementing parsing logic.

### Browser Inspector
- Location: `packages/browser/index.html` backed by modules in `packages/browser/src/**`.
- When adding or renaming node types or renderers, update the inspector in tandem:
  - Add a CSS color variable for the new type (for example `--HttpResponse`).
  - Add a `.type-visible-<Type>` rule to tint lines for that type.
  - Add the type string to the `KNOWN_TYPES` array for legend toggles.
  - Optionally extend the sample AST used in the inspector demo to include the new type.
  - Keep imports aligned with files emitted to `packages/browser/dist/`.

## Build, Test, and Development Commands
- Install: `npm ci` (root) bootstraps all workspaces. Avoid `npm install` to keep lockfile deterministic.
- Build: `npm run build` (root) executes each package's build. Build a single workspace with `npm run build --workspace @rfc-inspector/lib` (or the relevant package name).
- Type-check: `npm run typecheck` (root) or per package via `--workspace`.
- Tests: library specs live in `packages/lib/tests/**/*.spec.ts`; run them with `npm run test --workspace @rfc-inspector/lib`. Coverage is `npm run coverage --workspace @rfc-inspector/lib`.
- Lint: `npm run lint` (root) cascades to every workspace; apply safe fixes with `npm run lint:fix` or narrow to one package via `--workspace`.
- Watch modes: `npm run watch --workspace @rfc-inspector/lib` (tsc watch), `npm run watch --workspace @rfc-inspector/bin`, and `npm run watch --workspace @rfc-inspector/browser`. The browser package also exposes `npm run serve --workspace @rfc-inspector/browser` for a rebuild-and-serve loop.
- Clean: `npm run clean` (root) removes build outputs for all workspaces.

## Coding Style & Naming Conventions
- TypeScript strict mode is enabled across the monorepo; resolve all type errors before merging.
- Naming: do not use abbreviations; avoid single-letter identifiers. In loops, name the counter `index`.
- Case: TypeScript files and folders start with Uppercase (for example `Parser.ts`, `Tree/Matcher/IndentedBlockMatcher.ts`). Existing lowercase entries are legacy; prefer uppercase for any new code.
- Line endings: normalize inputs to `\\n` and serialize using `\\n`.
- Indentation: spaces only. Represent indentation internally as explicit counts. Expand leading tabs to 4 spaces. Do not emit spaces on otherwise blank lines.
- Whitespace: preserve blank-line counts between blocks and at file boundaries; ignore incidental whitespace on empty lines.
- Braces: always use `{}` for control structures, even single statements.
- Comments: code should remain self-explanatory; add concise comments only where logic is non-obvious.
- A single file should only contain a single type, class, interface, or function.

## Testing Guidelines
- Test runner: Vitest (configured in `packages/lib/vitest.config.ts`). Keep tests under `packages/lib/tests/**/*.spec.ts`.
- Embed RFC-like snippets directly in tests as string arrays; include context lines to exercise matcher integration. Normalize line endings to `\\n` and keep runs deterministic (no network or filesystem writes beyond the workspace).
- Follow AAA comments where it clarifies intent:
  - `// Arrange: ...` — set up inputs and state.
  - `// Act: ...` — perform the operation under test. Multiple acts are allowed when sequencing is relevant.
  - `// Assert: ...` — verify outcomes.
- Use `// Act & Assert: ...` only when the assertion itself drives the behavior being tested.
- Refer to the primary System Under Test as `sut` when it is an object or instance; call bare functions directly.
- Prefer descriptive expectation helpers (for example `actualKinds`, `expectedKinds`). Do not introduce variables for inline literal assertions.

## CI & Automation
- Continuous integration lives under `.github/workflows/`. The `ci.yml` workflow runs on pushes and pull requests, covering type-check (`npm run typecheck`), builds (`npm run build`), Vitest runs across Node 18/20/22 (including coverage), a smoke invocation of the built CLI output, and a summary job. Keep scripts idempotent and ensure new commands integrate cleanly with this pipeline.
- Static site deployment uses `pages.yml`, which rebuilds the workspaces, prepares `_site/` with `packages/browser/index.html` and bundled assets, and publishes to GitHub Pages. Update the packaging steps if the inspector entry point or bundle layout changes.

## Agent-Specific Instructions
- Align with the vision: prioritize parser correctness, whitespace fidelity, and simple, composable APIs.
- Apply naming and formatting rules across every workspace. Maintain LF endings and spaces-only indentation. Keep braces explicit.
- Prefer minimal dependencies and explicit module boundaries. Introduce runtime dependencies only with strong justification and scope them to the relevant workspace.

### Paragraph Indentation (RFC Source)
- Treat narrative paragraphs as starting with exactly 3 leading spaces. These inputs are RFC-like, not Markdown, and sections are indented accordingly. Matchers and renderers must preserve this convention when identifying and emitting paragraph content. Do not trim these leading spaces from paragraph lines.

## Commit & Pull Request Guidelines
- Commits: use clear, imperative subjects (for example "Add parser for indented blocks"). Group related changes and keep diffs focused.
- Pull requests: include a summary, rationale, and links to issues. Provide before/after parsing examples when behavior changes. Confirm `npm run typecheck`, `npm run test --workspace @rfc-inspector/lib`, and `npm run coverage --workspace @rfc-inspector/lib` succeed locally.

## Security & Dependencies
- Keep dependencies minimal. Justify new runtime dependencies and prefer dev-only tools when possible. Scope dependencies to the workspace that needs them.
- Follow ESM (`"type": "module"`) conventions; avoid introducing CommonJS.

## MCP

- For any jetbrains tool which asks for a `projectPath` use the absolute path to the root of this repository NOT `.`.
