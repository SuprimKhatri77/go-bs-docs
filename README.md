# go-bs-docs

Documentation site for [go-bs](https://github.com/suprimkhatri77/go-bs) and
its TypeScript sibling
[bikram-sambat-ts](https://github.com/SuprimKhatri77/bikram-sambat-ts):
dependency-free libraries for converting between Gregorian (AD) and Bikram
Sambat (BS) dates, with identical calendar data and results.

Next.js (App Router, TypeScript, Tailwind v4). Every page is statically
generated — there's no backend.

## Languages

Each language has its own pages and sidebar. Go, the default, has no URL
prefix, so the original go-bs URLs never changed; other languages live under
`/docs/<id>/`:

```text
/docs/api/conversion              Go
/docs/ts/api/conversion           TypeScript
/docs/api/conversion?lang=ts      redirects to /docs/ts/api/conversion
```

The sidebar's language switcher links to the same page in the other language
(or its getting-started page, if there's no equivalent). `?lang=` accepts a
language's id or aliases in any case (`ts`, `typescript`, `js`, `go`,
`golang`, …) and is handled by redirects generated in `next.config.ts`, so
every page stays static. Unknown values are ignored.

To add a language:

1. Add it to `LANGUAGES` in [`src/lib/languages.ts`](./src/lib/languages.ts)
   (and its logo to `LanguageSwitcher.tsx`).
2. Add its sidebar to `NAV` in [`src/lib/nav.ts`](./src/lib/nav.ts). Pages
   that exist in several languages share a slug, which is how the switcher
   and `?lang=` find a page's counterpart.
3. Add its pages under `src/app/docs/<id>/`, each with an
   `opengraph-image.tsx`.

The sitemap, RSS feed, search, `llms.txt`, `llms-full.txt` and the `.md`
versions of each page all pick up new pages from the nav automatically.

## What's interactive

The calendar-grid pages' live month view runs the **real library** in each
language, not a reimplementation: go-bs compiled to WebAssembly on the Go page
(see [`wasm/`](./wasm) and [`src/lib/wasm.ts`](./src/lib/wasm.ts)), and the
published `bikram-sambat-ts` npm package on the TypeScript page.

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

After a bikram-sambat-ts release that the docs cover, bump it with
`npm install bikram-sambat-ts@latest`.

## License

MIT — see [LICENSE](LICENSE). Matches go-bs's and bikram-sambat-ts's
license; this is documentation for those projects, not a separate product.
