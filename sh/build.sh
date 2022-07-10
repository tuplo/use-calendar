#!/usr/bin/env bash
set -euo pipefail

main() {
  rm -rf dist
  tsc --build tsconfig.build.json
  cp src/calhook.d.ts dist/calhook.d.ts
  rm dist/date-fns.* dist/helpers.* dist/props.* dist/index.js dist/*.tsbuildinfo

  esbuild src/index.ts \
    --bundle \
    --format=esm \
    --outfile=dist/index.mjs \
    --external:react
}

main
