#!/usr/bin/env bash
set -euo pipefail

main() {
  rm -rf dist
  rm -rf cjs

  tsc --build tsconfig.build.json
  cp src/calhook.d.ts dist/calhook.d.ts
  rm dist/date-fns.* dist/helpers.* dist/props.* dist/index.js dist/*.tsbuildinfo

  esbuild src/index.ts \
    --bundle \
    --format=esm \
    --outfile=dist/index.mjs \
    --external:react

  esbuild src/cjs/index.js \
    --bundle \
    --outfile=dist/index.cjs \
    --external:react

  # node12 compatibility
  mkdir cjs && cp dist/index.cjs cjs/index.js
}

main
