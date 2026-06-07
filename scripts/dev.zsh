#!/bin/zsh
set -euo pipefail

ROOT="${0:A:h:h}"
cd "$ROOT"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    echo "Usage: scripts/dev.zsh [all|citadel|nc_presentation|ncottage-www|@forge/name] [extra args...]"
    exit 0
fi

TARGET="${1:-ncottage-www}"
shift || true

case "$TARGET" in
    all)
        exec pnpm dev "$@"
        ;;
    @forge/*)
        exec pnpm --filter "$TARGET" dev "$@"
        ;;
    citadel|nc_presentation|ncottage-www)
        exec pnpm --filter "@forge/$TARGET" dev "$@"
        ;;
    *)
        echo "Unknown dev target: $TARGET" >&2
        echo "Usage: scripts/dev.zsh [all|citadel|nc_presentation|ncottage-www|@forge/name] [extra args...]" >&2
        exit 2
        ;;
esac
