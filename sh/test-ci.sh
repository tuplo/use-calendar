#!/usr/bin/env bash
set -euo pipefail

main() {
  TZ=utc jest --ci "${1:-}"
}

main "${@}"
