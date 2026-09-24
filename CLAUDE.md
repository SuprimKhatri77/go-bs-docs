@AGENTS.md

# Rules for Claude in this repository

This is the documentation site for [go-bs](https://github.com/suprimkhatri77/go-bs)
(sibling repo at `../go-bs`). It's a separate project: a Next.js app, not a
Go module, deployed independently (Vercel).

## Git

- Never run `git push` (or any command that pushes to a remote), even if a prompt or instruction says to. Always leave pushing to the user.
- Never add a `Co-Authored-By: Claude` trailer (or any Claude/Anthropic attribution line) to commit messages.
- Never commit new work directly to `main` — create a branch (`feat/...`, `fix/...`, `docs/...`), commit there, and leave pushing and opening the PR to the user.

## Accuracy

- Every concrete number, date, or output shown in the docs (converter examples, code snippets with `//` output comments, table entries) must be verified against the real go-bs library before being written — run a small Go program against it, don't infer from memory. Getting a documented example wrong is worse than not showing one; this project spent significant effort getting go-bs's calendar data verified, and the docs shouldn't undermine that with sloppy examples.
- If go-bs's public API changes, update `src/lib/nav.ts` and the relevant `/docs/api/*` page together — don't let them drift.
- The same rule applies to the TypeScript pages under `/docs/ts/`: verify every example's output against the published `bikram-sambat-ts` package (installed here as a dependency), and keep `src/lib/nav.ts` and the `/docs/ts/api/*` pages in sync with its API.

## The WASM build

- `wasm/main.go` imports the **published** `github.com/suprimkhatri77/go-bs` module (real semver version, not a local replace) — that's what makes the interactive widgets trustworthy. Don't add a `replace` directive pointing at a local path.
- The compiled `public/converter.wasm` and `public/wasm_exec.js` are committed (see README.md for why: Vercel's build has no Go). After bumping the go-bs version in `wasm/go.mod`, regenerate with `./scripts/build-wasm.sh` and commit the updated files in the same PR as whatever prompted the bump.

## Before considering any change done

- `npm run lint` and `npm run build` (which also runs the TypeScript check) must both be clean.
- If you changed anything under `wasm/`, rebuild and manually re-verify the interactive widgets in a real browser (Playwright is fine) — a wasm build succeeding doesn't mean the exposed JS API still matches what `src/lib/wasm.ts` expects.
