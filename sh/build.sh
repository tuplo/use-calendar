#!/usr/bin/env bash
set -euo pipefail

main() {
  rm -rf dist

  tsc --build tsconfig.build.json
  cp src/calhook.d.ts dist/calhook.d.ts
  rm dist/date-fns.* dist/helpers.* dist/props.* dist/index.js dist/*.tsbuildinfo
  rm -rf dist/react

  esbuild src/index.ts \
    --bundle \
    --external:react \
    --format=esm \
    --minify \
    --outfile=dist/index.esm.js

  esbuild src/index.ts \
    --bundle \
    --external:react \
    --format=cjs \
    --minify \
    --outfile=dist/index.cjs.js
}

main
