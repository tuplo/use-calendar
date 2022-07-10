#!/usr/bin/env bash
set -euo pipefail

main() {
  TZ=utc jest --ci
}

main
