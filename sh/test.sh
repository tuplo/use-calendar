#!/usr/bin/env bash
set -euo pipefail

main() {
  TZ=utc jest --watch "${1:-}"
}

main "${@}"
