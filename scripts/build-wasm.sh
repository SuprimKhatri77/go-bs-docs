#!/usr/bin/env bash
# Builds wasm/main.go (which imports the real, published github.com/suprimkhatri77/go-bs)
# to WebAssembly and copies it, plus Go's JS glue, into public/.
#
# The compiled output is committed to the repo (see public/converter.wasm),
# so Vercel's build environment never needs Go installed — this script is
# only for maintainers regenerating it after a go-bs update. Requires Go
# with the js/wasm port (any modern Go toolchain).
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Building wasm/main.go for GOOS=js GOARCH=wasm..."
(cd wasm && GOOS=js GOARCH=wasm go build -ldflags="-s -w" -o ../public/converter.wasm .)

GOROOT="$(go env GOROOT)"
WASM_EXEC="$GOROOT/lib/wasm/wasm_exec.js"
if [ ! -f "$WASM_EXEC" ]; then
  # Older Go versions (<1.24) shipped it under misc/wasm instead.
  WASM_EXEC="$GOROOT/misc/wasm/wasm_exec.js"
fi
cp "$WASM_EXEC" public/wasm_exec.js

ls -lh public/converter.wasm public/wasm_exec.js
echo "Done. Commit the updated public/converter.wasm and public/wasm_exec.js."
