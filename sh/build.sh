#!/usr/bin/env bash
set -euo pipefail

main() {
  rm -rf dist

  esbuild src/index.ts \
    --bundle \
    --format=esm \
    --outfile=dist/index.mjs \
    --external:react
}

main
