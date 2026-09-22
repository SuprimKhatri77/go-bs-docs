# go-bs-docs

Documentation site for [go-bs](https://github.com/suprimkhatri77/go-bs), a
dependency-free Go library for converting between Gregorian (AD) and Bikram
Sambat (BS) dates.

Next.js (App Router, TypeScript, Tailwind v4). Every page is statically
generated — there's no backend.

## What's interactive

The homepage's AD↔BS converter and the calendar-grid page's live month view
both run the **real go-bs library**, compiled to WebAssembly — not a
JavaScript reimplementation. See [`wasm/`](./wasm) and
[`src/lib/wasm.ts`](./src/lib/wasm.ts).

## Development

```sh
npm install
npm run dev
```

## The WASM build

`wasm/main.go` is a small Go program that imports the published
`github.com/suprimkhatri77/go-bs` module and exposes a JS-friendly API
(`window.goBS`) via `syscall/js`. It's presentation-layer glue, not part of
go-bs itself.

The compiled output (`public/converter.wasm`, `public/wasm_exec.js`) is
**committed to this repo**, so Vercel's build never needs Go installed.
Regenerate it after a go-bs update:

```sh
cd wasm && go get github.com/suprimkhatri77/go-bs@latest && cd ..
./scripts/build-wasm.sh
```

Requires a Go toolchain with the js/wasm port (any modern Go). The compiled
`.wasm` is ~3.1MB uncompressed, ~880KB gzipped (which Vercel/most hosts
serve automatically).

## Checks

```sh
npm run lint
npm run build   # also runs the TypeScript check
```

## Deploying

Zero-config on Vercel — it's a standard Next.js app with no server-side
dependencies (the WASM file is a static asset).

## License

MIT — see [LICENSE](LICENSE). Matches go-bs's license; this is documentation
for that project, not a separate product.
